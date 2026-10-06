const fs = require('node:fs');
const { spawn } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const pageName = process.argv.find(arg => /^--page=/.test(arg))?.slice(7) || 'index copy.html';
const previewName = pageName === 'index.html' ? 'main-desktop-preview.png' : pageName === 'index2.html' ? 'index2-desktop-preview.png' : 'giveaway-desktop-preview.png';

const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--remote-debugging-port=9337', '--remote-allow-origins=http://localhost',
  `--user-data-dir=${path.join(os.tmpdir(), 'cp-giveaway-qa')}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore' });

(async () => {
  let target;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const targets = await fetch('http://127.0.0.1:9337/json').then(r => r.json());
      target = targets.find(t => t.type === 'page');
      if (target) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!target) throw new Error('Browser debugger did not start.');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = event => {
    const result = JSON.parse(event.data);
    if (result.method === 'Runtime.exceptionThrown') errors.push(result.params.exceptionDetails.text);
    if (result.id) {
      const task = pending.get(result.id);
      pending.delete(result.id);
      if (result.error) task.reject(result.error); else task.resolve(result.result);
    }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, {resolve, reject}); ws.send(JSON.stringify({id, method, params}));
  });
  await call('Runtime.enable');
  await call('Page.enable');
  if (process.argv.includes('--motion')) {
    await call('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await call('Page.addScriptToEvaluateOnNewDocument', {source:`
      window.__cozyDelays = []; window.__cozyNudges = [];
      const nativeTimeout = window.setTimeout;
      window.setTimeout = function(fn, delay, ...args) {
        if (delay >= 1000) window.__cozyDelays.push(delay);
        return nativeTimeout.call(this, fn, delay, ...args);
      };
      const nativeAnimate = Element.prototype.animate;
      Element.prototype.animate = function(frames, options) {
        if (this.matches('.discover-cta')) window.__cozyNudges.push({id:this.id,frames,options,at:performance.now(),
          simultaneous:Array.from(document.querySelectorAll('.discover-cta')).reduce((n,b)=>n+b.getAnimations().length,0),
          hovered:this.closest('.discover-card').matches(':hover'),
          focused:this.closest('.discover-card').contains(document.activeElement)});
        return nativeAnimate.call(this,frames,options);
      };
    `});
  }
  await call('Emulation.setDeviceMetricsOverride', {width:1440,height:1400,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate', {url:process.argv.includes('--file') ? pathToFileURL(path.resolve(pageName)).href : `http://127.0.0.1:4173/${encodeURIComponent(pageName)}`});
  const readiness = await call('Runtime.evaluate', {expression:`(async()=>{
    while(document.readyState !== 'complete') await new Promise(r=>setTimeout(r,100));
    await document.fonts.ready;
    await Promise.all(Array.from(document.querySelectorAll('.giveaway-hero img')).map(img => img.decode()));
    return true;
  })()`, awaitPromise:true, returnByValue:true});
  if (readiness.exceptionDetails) throw new Error('Images or fonts failed to load.');
  const results = [];
  for (const width of [1440,1024,768,390,320]) {
    await call('Emulation.setDeviceMetricsOverride', {width,height:1400,deviceScaleFactor:1,mobile:false});
    const {result} = await call('Runtime.evaluate', {returnByValue:true, expression:`(()=>{
      const cards=Array.from(document.querySelectorAll('.giveaway-card'));
      cards[0].focus();
      const textRects=[];
      const textWalker=document.createTreeWalker(document.querySelector('.giveaway-hero'),NodeFilter.SHOW_TEXT);
      while(textWalker.nextNode()) {
        if(!textWalker.currentNode.textContent.trim()) continue;
        const range=document.createRange(); range.selectNodeContents(textWalker.currentNode);
        textRects.push(...range.getClientRects());
      }
      const collidingIcons=Array.from(document.querySelectorAll('.cozy-content-icon')).filter(icon=>{
        const r=icon.getBoundingClientRect();
        return textRects.some(t=>r.left<t.right&&r.right>t.left&&r.top<t.bottom&&r.bottom>t.top);
      }).map(icon=>({class:icon.getAttribute('class'),card:icon.closest('.discover-card')?.getAttribute('class')}));
      return {
        width:innerWidth, pageWidth:document.documentElement.scrollWidth,iconTextOverlaps:collidingIcons.length,collidingIcons,
        h1Count:document.querySelectorAll('h1').length,
        cards:cards.map(card=>({href:card.href,imageLoaded:card.querySelector('img').naturalWidth>0,
          overflows:Array.from(card.querySelectorAll('h2,p,.giveaway-footer span')).some(el=>el.scrollWidth>el.clientWidth+1),title:card.querySelector('h2').textContent})),
        focusedCard:document.activeElement===cards[0],
        missingAnchors:Array.from(document.querySelectorAll('a[href^="#"]')).map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))),
        font:getComputedStyle(document.querySelector('h1')).fontFamily,
        columns:getComputedStyle(document.querySelector('.giveaway-grid')).gridTemplateColumns
      };
    })()`});
    results.push(result.value);
  }
  await call('Emulation.setDeviceMetricsOverride', {width:1440,height:1400,deviceScaleFactor:1,mobile:false});
  await call('Runtime.evaluate', {expression:'document.activeElement.blur();window.scrollTo(0,0)'});
  let motion;
  if (process.argv.includes('--motion')) {
    await call('Page.bringToFront');
    const probe = await call('Runtime.evaluate', {awaitPromise:true, returnByValue:true, expression:`(async()=>{
      const deadline=performance.now()+14000;
      while(window.__cozyNudges.length<2&&performance.now()<deadline) await new Promise(r=>setTimeout(r,40));
      const nudge=window.__cozyNudges[1];
      if(!nudge) return {error:'Two random CTA nudges did not occur within the expected interval.',hasFocus:document.hasFocus()};
      document.getElementById(nudge.id).closest('.discover-card').focus();
      const focusStopped=document.querySelectorAll('.discover-cta').length&&Array.from(document.querySelectorAll('.discover-cta')).every(b=>!b.getAnimations().length);
      const toggle=document.querySelector('.discover-motion-toggle');
      toggle.click();
      return {nudge,repeatedNudges:window.__cozyNudges.slice(0,2),focusStopped,paused:toggle.getAttribute('aria-pressed')==='true',delays:window.__cozyDelays,
        iconCount:document.querySelectorAll('.cozy-mark').length,
        contentIconCount:document.querySelectorAll('.cozy-content-icon').length,
        iconTypes:Array.from(document.querySelectorAll('.cozy-mark use')).map(u=>u.getAttribute('href'))};
    })()`});
    motion = probe.result.value;
    await call('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    const reduced = await call('Runtime.evaluate', {awaitPromise:true,returnByValue:true,expression:`new Promise(resolve=>setTimeout(()=>resolve({
      reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
      toggleHidden:document.querySelector('.discover-motion-toggle').hidden,
      animationCount:Array.from(document.querySelectorAll('.discover-cta')).reduce((n,b)=>n+b.getAnimations().length,0)
    }),100))`});
    motion.reducedMotion = reduced.result.value;
    console.log(JSON.stringify({motion},null,2));
  }
  if (!process.argv.includes('--checks-only')) {
    if (motion) {
      await call('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
      await call('Runtime.evaluate', {awaitPromise:true,expression:`new Promise(resolve=>requestAnimationFrame(()=>{
        const toggle=document.querySelector('.discover-motion-toggle');
        if(toggle?.getAttribute('aria-pressed')==='true') toggle.click();
        document.activeElement.blur(); window.scrollTo(0,0); resolve();
      }))`});
    }
    const capture = await call('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
    fs.writeFileSync(previewName, Buffer.from(capture.data,'base64'));
  }
  console.log(JSON.stringify({results:results.map(r=>({...r,cards:r.cards.map(c=>({imageLoaded:c.imageLoaded,overflows:c.overflows}))})),errors},null,2));
  const expectedLinks = ['stroller', 'diapers', 'babysample2', 'lululemon', 'amazon'].map(slug=>`https://work.jqd.io/${slug}/`);
  const repeatedBad = motion && !motion.error && (motion.repeatedNudges.length!==2 || motion.repeatedNudges[0].id===motion.repeatedNudges[1].id || motion.repeatedNudges.some(n=>n.simultaneous||n.hovered||n.focused));
  const motionBad = motion && (motion.error || repeatedBad || !motion.focusStopped || !motion.paused || motion.nudge?.options.duration!==820 || motion.nudge?.hovered || motion.nudge?.focused || motion.iconCount!==6 || motion.contentIconCount!==8 || !motion.reducedMotion.reduced || !motion.reducedMotion.toggleHidden || motion.reducedMotion.animationCount);
  const bad = motionBad || errors.length || results.some(r=>r.h1Count!==1||r.pageWidth>r.width||r.iconTextOverlaps||r.cards.length!==5||!r.focusedCard||r.missingAnchors.length||r.cards.some((c,i)=>!c.imageLoaded||c.overflows||c.href!==expectedLinks[i]));
  ws.close();
  browser.kill();
  if (bad) process.exitCode = 1;
})().catch(error=>{console.error(error);browser.kill();process.exitCode=1;});
