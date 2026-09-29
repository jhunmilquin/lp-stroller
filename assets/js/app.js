(() => {
  'use strict';

  const REQUIRE_NEWSLETTER_CONSENT = false;
  const form = document.getElementById('join');
  const summary = document.getElementById('error-summary');
  const summaryList = document.getElementById('error-summary-list');
  const button = document.getElementById('join-button');
  const fieldKeys = ['first-name', 'last-name', 'email', 'age', 'newsletter'];
  const errors = new Map();
  const previouslyInvalid = new Set();
  let submitted = false;
  let submitting = false;
  let finished = false;

  /** Trim all values; normalize names and lowercase the email before validation. */
  function normalize() {
    for (const id of ['first-name', 'last-name']) {
      const field = document.getElementById(id);
      field.value = field.value.trim().replace(/ +/g, ' ').normalize('NFC');
    }
    const email = document.getElementById('email');
    email.value = email.value.trim().toLowerCase();
    const company = document.getElementById('company');
    company.value = company.value.trim();
    return {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: email.value,
      youngestChild: form.querySelector('input[name="youngestChild"]:checked')?.value || '',
      newsletter: document.getElementById('newsletter').checked,
      company: company.value
    };
  }

  /** Validate a Unicode name, counting characters rather than UTF-16 code units. */
  function validateName(value, label) {
    const length = Array.from(value).length;
    if (!length) return `Enter your ${label.toLowerCase()}.`;
    if (length < 2) return `${label} must be at least 2 characters.`;
    if (length > 40) return `${label} must be 40 characters or fewer.`;
    if (!/^\p{L}+(?:[ '’-]\p{L}+)*$/u.test(value)) {
      return 'Use letters only. Hyphens and apostrophes are OK.';
    }
    return '';
  }

  /** Check email structure, lengths, dot placement, domain labels, and alphabetic TLD. */
  function validateEmail(value) {
    if (!value) return 'Enter your email address.';
    const invalid = 'Enter a valid email address, like name@example.com.';
    if (value.length > 254 || /\s/.test(value)) return invalid;
    const parts = value.split('@');
    if (parts.length !== 2) return invalid;
    const [local, domain] = parts;
    if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return invalid;
    if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return invalid;
    const labels = domain.split('.');
    if (labels.length < 2 || !/^[a-z]{2,}$/i.test(labels[labels.length - 1])) return invalid;
    if (labels.some(label => label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return invalid;
    return '';
  }

  /** Return the elements carrying a field's invalid state. */
  function controlsFor(key) {
    return key === 'age'
      ? Array.from(form.querySelectorAll('input[name="youngestChild"]'))
      : [document.getElementById(key)];
  }

  /** Build a decorative sprite icon without using HTML from user input. */
  function makeIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#icon-${name}`);
    svg.append(use);
    return svg;
  }

  /** Mark a field invalid and announce its inline message. */
  function showError(key, message) {
    errors.set(key, message);
    previouslyInvalid.add(key);
    controlsFor(key).forEach(control => control.setAttribute('aria-invalid', 'true'));
    if (key === 'age') {
      document.getElementById('age-group').dataset.invalid = 'true';
      document.getElementById('age-group').setAttribute('aria-invalid', 'true');
    }
    const target = document.getElementById(`${key}-error`);
    if (target.textContent !== message) target.replaceChildren(makeIcon('alert'), document.createTextNode(message));
  }

  /** Clear a corrected field without touching any of the entered values. */
  function clearError(key) {
    errors.delete(key);
    controlsFor(key).forEach(control => control.removeAttribute('aria-invalid'));
    document.getElementById(`${key}-error`).replaceChildren();
    if (key === 'age') {
      document.getElementById('age-group').removeAttribute('data-invalid');
      document.getElementById('age-group').removeAttribute('aria-invalid');
    }
  }

  /** Validate one field; untouched fields remain quiet until the first submit. */
  function validateField(key, payload) {
    const validators = {
      'first-name': () => validateName(payload.firstName, 'First name'),
      'last-name': () => validateName(payload.lastName, 'Last name'),
      email: () => validateEmail(payload.email),
      age: () => ['pregnant', '0-3', '3-plus', 'none'].includes(payload.youngestChild)
        ? '' : 'Choose the age of your youngest child.',
      newsletter: () => REQUIRE_NEWSLETTER_CONSENT && !payload.newsletter
        ? 'Check the box to get the newsletter.' : ''
    };
    const message = validators[key]();
    if (message) showError(key, message);
    else clearError(key);
    return !message;
  }

  /** Render a stable-order summary with links that focus each invalid control. */
  function renderSummary() {
    summaryList.replaceChildren();
    for (const key of fieldKeys) {
      if (!errors.has(key)) continue;
      const item = document.createElement('li');
      const link = document.createElement('a');
      const target = controlsFor(key)[0];
      link.href = `#${target.id}`;
      link.className = 'inline-flex min-h-12 items-center underline';
      link.textContent = errors.get(key);
      link.addEventListener('click', event => {
        event.preventDefault();
        target.focus();
      });
      item.append(link);
      summaryList.append(item);
    }
    summary.hidden = !submitted || errors.size === 0;
  }

  /** Offer common-domain corrections as optional buttons, never validation errors. */
  function showEmailHint() {
    const hint = document.getElementById('email-hint');
    const email = document.getElementById('email');
    const value = email.value.trim().toLowerCase();
    const [local, domain, extra] = value.split('@');
    const corrections = {
      'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com',
      'hotmial.com': 'hotmail.com', 'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com', 'icloud.co': 'icloud.com'
    };
    const candidate = local && !extra && corrections[domain] ? `${local}@${corrections[domain]}` : '';
    const suggestion = candidate && !validateEmail(candidate) ? candidate : '';
    if (hint.dataset.suggestion === suggestion) return;
    hint.dataset.suggestion = suggestion;
    hint.replaceChildren();
    if (!suggestion) return;
    const apply = document.createElement('button');
    apply.type = 'button';
    apply.className = 'min-h-12 max-w-full cursor-pointer rounded-sm text-left text-sm break-all text-teal underline';
    apply.textContent = `Did you mean ${suggestion}?`;
    apply.addEventListener('click', () => {
      email.value = suggestion;
      validateField('email', normalize());
      showEmailHint();
      if (submitted) renderSummary();
      email.focus({ preventScroll: true });
    });
    hint.append(apply);
  }

  /** Replace the ticket body with the requested local demo confirmation. */
  function showSuccess(payload, honeypot) {
    const panel = document.createElement('div');
    panel.className = 'flex min-h-80 flex-col justify-center py-8';
    const heading = document.createElement('h3');
    heading.id = 'success-heading';
    heading.tabIndex = -1;
    heading.className = 'text-3xl leading-tight break-words';
    heading.textContent = `You're in, ${payload.firstName || 'friend'}!`;
    const message = document.createElement('p');
    message.className = 'mt-5 text-lg';
    message.textContent = 'Your entry is saved. Watch your inbox for new giveaways and free samples.';
    panel.append(heading, message);
    document.getElementById('ticket-body').replaceChildren(panel);
    document.getElementById('entered-stamp').classList.add('is-visible');
    finished = true;
    submitting = false;
    heading.focus({ preventScroll: true });
    if (!honeypot) {
      const { company, ...sanitizedPayload } = payload;
      console.info('Demo only, not sent', sanitizedPayload);
    }
  }

  /** Prevent network submission, validate, and run one guarded 800ms demo state. */
  function handleSubmit(event) {
    event.preventDefault();
    if (submitting || finished) return;
    const payload = normalize();
    const honeypot = Boolean(payload.company);
    submitted = true;
    if (!honeypot) {
      fieldKeys.forEach(key => validateField(key, payload));
      showEmailHint();
      renderSummary();
      if (errors.size) {
        summary.focus();
        return;
      }
    }
    submitting = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    document.getElementById('joining-spinner').hidden = false;
    document.getElementById('join-button-label').textContent = 'Joining…';
    window.setTimeout(() => showSuccess(payload, honeypot), 800);
  }

  /** Scroll to the form and focus its first field; respect reduced-motion preferences. */
  function initScrollLinks() {
    document.querySelectorAll('[data-scroll-to-form]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const target = document.getElementById('join') || document.getElementById('success-heading');
        const focusTarget = document.getElementById('first-name') || target;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
        // iOS Safari: focusing an input mid-smooth-scroll opens the keyboard and cancels the scroll.
        if (!window.matchMedia('(pointer: coarse)').matches) focusTarget.focus({ preventScroll: true });
      });
    });
  }

  /** Attach blur validation plus live revalidation after a field has shown an error. */
  function initValidation() {
    document.getElementById('newsletter').required = REQUIRE_NEWSLETTER_CONSENT;
    for (const key of ['first-name', 'last-name', 'email', 'newsletter']) {
      const control = document.getElementById(key);
      control.addEventListener('blur', () => {
        validateField(key, normalize());
        if (key === 'email') showEmailHint();
        if (submitted) renderSummary();
      });
      const eventName = key === 'newsletter' ? 'change' : 'input';
      control.addEventListener(eventName, () => {
        if (previouslyInvalid.has(key) || submitted) {
          // Normalize a snapshot while typing, preserving caret position and spaces.
          const payload = {
            firstName: document.getElementById('first-name').value.trim().replace(/ +/g, ' ').normalize('NFC'),
            lastName: document.getElementById('last-name').value.trim().replace(/ +/g, ' ').normalize('NFC'),
            email: document.getElementById('email').value.trim().toLowerCase(),
            newsletter: document.getElementById('newsletter').checked
          };
          validateField(key, payload);
          if (submitted) renderSummary();
        }
        if (key === 'email') showEmailHint();
      });
    }
    const ageGroup = document.getElementById('age-group');
    ageGroup.addEventListener('focusout', event => {
      if (!ageGroup.contains(event.relatedTarget)) {
        validateField('age', normalize());
        if (submitted) renderSummary();
      }
    });
    ageGroup.addEventListener('change', () => {
      if (previouslyInvalid.has('age') || submitted) {
        validateField('age', normalize());
        if (submitted) renderSummary();
      }
    });
  }

  form.addEventListener('submit', handleSubmit);
  initValidation();
  initScrollLinks();
})();
