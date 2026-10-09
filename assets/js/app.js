const STRINGS = {
  en: {
    htmlLang: 'en-CA',
    title: 'Win a Stroller System | Canadian Parent',
    description: 'Join 400,000+ Canadian parents. Get free baby samples and enter to win over $30,000 in prizes. New giveaways every week. 100% free.',
    skip: 'Skip to the form',
    home: 'Canadian Parent home',
    language: 'Language',
    welcome: 'Welcome to Canadian Parent',
    tagline: 'Canada’s largest community of new and expecting parents.',
    intro: 'Discover free sample packs, valuable coupons, and your chance to win a share of over $300,000 in prizes for your family.',
    step: 'Step {n} of {total}',
    q1: 'What would you like to explore?',
    hint1: 'Pick as many as you like.',
    samples: 'Free samples',
    coupons: 'Coupons',
    giveaways: 'Giveaways',
    tips: 'Parent tips',
    all: 'All of the above',
    q2: 'What’s your first name?',
    q3: 'And your last name?',
    q4: 'How old is your youngest child?',
    hint4: 'Choose one.',
    pregnant: 'I’m pregnant',
    age03: '0–3 years',
    age3plus: '3+ years',
    noKids: 'No children yet',
    q5: 'Where should we send your perks?',
    emailLabel: 'Your email address',
    emailPlaceholder: 'name@example.com',
    consent: 'By entering your information and clicking submit, you agree to our <a href="https://canadianparent.ca/join/privacy.html" target="_blank" rel="noopener" class="font-medium text-ink underline">Privacy Policy</a>, <a href="https://canadianparent.ca/join/rules.html" target="_blank" rel="noopener" class="font-medium text-ink underline">Terms and Conditions</a> and understand that we will be sending you our newsletters by email. Unsubscribe at any time.',
    back: 'Back',
    start: 'Get Started',
    continue: 'Continue',
    submit: 'Submit',
    doneTitle: 'Thanks, {name}. You’re all set.',
    doneText: 'Watch your inbox for samples, coupons and giveaways.',
    legal: 'Legal',
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    disclaimer: 'No purchase necessary. Giveaways are open to residents of Canada 18+; see the official rules for each draw. Sample offers come from independent brands, may change and may vary by location. Canadian Parent is not affiliated with or sponsored by the brands mentioned. <br>© 2026 Canadian Parent. No purchase required. 100% free. Open to residents of Canada.',
    errChooseMany: 'Choose at least one option.',
    errChooseOne: 'Choose an option.',
    errFirstName: 'Enter your first name.',
    errLastName: 'Enter your last name.',
    errNameChars: 'Use letters, spaces, hyphens or apostrophes only.',
    errEmailEmpty: 'Enter your email address.',
    errEmailBad: 'Enter an email address like name@example.com.',
    errConsent: 'Tick the box to agree before submitting.',
  },
  fr: {
    htmlLang: 'fr-CA',
    title: 'Gagnez une poussette | Canadian Parent',
    description: 'Joignez-vous à plus de 400 000 parents canadiens. Obtenez des échantillons gratuits pour bébé et courez la chance de gagner plus de 30 000 $ en prix. Nouveaux concours chaque semaine. 100 % gratuit.',
    skip: 'Passer au formulaire',
    home: 'Accueil Canadian Parent',
    language: 'Langue',
    welcome: 'Bienvenue chez Canadian Parent',
    tagline: 'La plus grande communauté de nouveaux et futurs parents au Canada.',
    intro: 'Découvrez des trousses d’échantillons gratuits, des coupons avantageux et courez la chance de gagner une part de plus de 300 000 $ en prix pour votre famille.',
    step: 'Étape {n} de {total}',
    q1: 'Qu’aimeriez-vous découvrir?',
    hint1: 'Choisissez-en autant que vous voulez.',
    samples: 'Échantillons gratuits',
    coupons: 'Coupons',
    giveaways: 'Concours',
    tips: 'Conseils parentaux',
    all: 'Tout ce qui précède',
    q2: 'Quel est votre prénom?',
    q3: 'Et votre nom de famille?',
    q4: 'Quel âge a votre plus jeune enfant?',
    hint4: 'Choisissez-en un.',
    pregnant: 'Je suis enceinte',
    age03: '0 à 3 ans',
    age3plus: '3 ans et plus',
    noKids: 'Pas encore d’enfant',
    q5: 'Où devrions-nous envoyer vos avantages?',
    emailLabel: 'Votre adresse courriel',
    emailPlaceholder: 'nom@exemple.com',
    consent: 'En saisissant vos renseignements et en cliquant sur Soumettre, vous acceptez notre <a href="https://canadianparent.ca/join/privacy.html" target="_blank" rel="noopener" class="font-medium text-ink underline">Politique de confidentialité</a> et nos <a href="https://canadianparent.ca/join/rules.html" target="_blank" rel="noopener" class="font-medium text-ink underline">Conditions générales</a>, et comprenez que nous vous enverrons nos infolettres par courriel. Vous pouvez vous désabonner en tout temps.',
    back: 'Retour',
    start: 'Commencer',
    continue: 'Continuer',
    submit: 'Soumettre',
    doneTitle: 'Merci, {name}. C’est fait!',
    doneText: 'Surveillez votre boîte de réception pour des échantillons, des coupons et des concours.',
    legal: 'Mentions légales',
    terms: 'Conditions générales',
    privacy: 'Politique de confidentialité',
    disclaimer: 'Aucun achat requis. Les concours sont ouverts aux résidents du Canada âgés de 18 ans et plus; consultez le règlement officiel de chaque tirage. Les offres d’échantillons proviennent de marques indépendantes, peuvent changer et varier selon la région. Canadian Parent n’est pas affilié aux marques mentionnées ni commandité par celles-ci. <br>© 2026 Canadian Parent. Aucun achat requis. 100 % gratuit. Ouvert aux résidents du Canada.',
    errChooseMany: 'Choisissez au moins une option.',
    errChooseOne: 'Choisissez une option.',
    errFirstName: 'Entrez votre prénom.',
    errLastName: 'Entrez votre nom de famille.',
    errNameChars: 'Utilisez seulement des lettres, des espaces, des traits d’union ou des apostrophes.',
    errEmailEmpty: 'Entrez votre adresse courriel.',
    errEmailBad: 'Entrez une adresse courriel comme nom@exemple.com.',
    errConsent: 'Cochez la case pour accepter avant de soumettre.',
  },
};

const form = document.getElementById('join');
const steps = [...form.querySelectorAll('[data-step]')];
const bars = [...form.querySelectorAll('[data-bar]')];
const back = form.querySelector('[data-back]');
const next = form.querySelector('[data-next]');
const count = document.getElementById('step-count');
const intro = form.querySelector('[data-intro]');
const done = document.getElementById('done');
const doneTitle = document.getElementById('done-title');
const langButtons = document.querySelectorAll('[data-lang]');
let current = 0;
let lang = 'en';

const t = (key, vars = {}) => STRINGS[lang][key].replace(/\{(\w+)\}/g, (_, k) => vars[k]);

const NAME = /^\p{L}[\p{L}' .-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const checked = (name) => [...form.querySelectorAll(`[name="${name}"]:checked`)].map((el) => el.value);

const name = (emptyKey) => (el) => {
  const v = el.value.trim();
  if (!v) return emptyKey;
  if (!NAME.test(v)) return 'errNameChars';
  return '';
};

// Each validator returns '' when valid, otherwise the STRINGS key of the error.
const validators = {
  interests: () => (checked('interests').length ? '' : 'errChooseMany'),
  firstName: name('errFirstName'),
  lastName: name('errLastName'),
  age: () => (checked('age').length ? '' : 'errChooseOne'),
  email: (el) => {
    const v = el.value.trim();
    if (!v) return 'errEmailEmpty';
    return EMAIL.test(v) ? '' : 'errEmailBad';
  },
  consent: (el) => (el.checked ? '' : 'errConsent'),
};

// Returns true when every field in the step is valid; focuses the first invalid one.
function validate(step, focus = true) {
  let firstInvalid = null;
  const fields = [...step.querySelectorAll('[data-validate]')];
  if (step.matches('[data-validate]')) fields.unshift(step);
  for (const el of fields) {
    const msg = validators[el.dataset.validate](el);
    document.getElementById(`${el.dataset.validate}-error`).textContent = msg ? t(msg) : '';
    el.setAttribute('aria-invalid', String(!!msg));
    if (msg && !firstInvalid) firstInvalid = el;
  }
  if (firstInvalid && focus) (firstInvalid.matches('input') ? firstInvalid : firstInvalid.querySelector('input')).focus();
  return !firstInvalid;
}

const hasError = (step) => step.matches('[aria-invalid="true"]') || !!step.querySelector('[aria-invalid="true"]');

function show(index, focus = true) {
  current = index;
  steps.forEach((step, i) => (step.hidden = i !== index));
  bars.forEach((bar, i) => {
    bar.classList.toggle('bg-coral', i <= index);
    bar.classList.toggle('bg-line', i > index);
  });
  count.textContent = t('step', { n: index + 1, total: steps.length });
  intro.hidden = index !== 0;
  back.classList.toggle('invisible', index === 0);
  next.textContent = t(index === 0 ? 'start' : index === steps.length - 1 ? 'submit' : 'continue');
  if (!focus) return;
  const step = steps[index];
  (step.querySelector('input:not([type="checkbox"], [type="radio"])') || step.querySelector('legend')).focus();
}

function setLang(code) {
  lang = code;
  document.documentElement.lang = t('htmlLang');
  document.title = t('title');
  document.querySelector('meta[name="description"]').content = t('description');
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.querySelectorAll('[data-i18n-label]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nLabel)));
  form.email.placeholder = t('emailPlaceholder');
  doneTitle.textContent = t('doneTitle', { name: form.firstName.value.trim() });
  langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  show(current, false);
  if (hasError(steps[current])) validate(steps[current], false);
  try {
    localStorage.setItem('lang', lang);
  } catch {}
}

langButtons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));

form.addEventListener('change', ({ target }) => {
  if (target.name === 'interests') {
    const all = form.querySelector('[name="interests"][value="all"]');
    const rest = [...form.querySelectorAll('[name="interests"]:not([value="all"])')];
    if (target === all) rest.forEach((el) => (el.checked = all.checked));
    else all.checked = rest.every((el) => el.checked);
  }
});

// Once an error is showing, re-check live so it clears as soon as it's fixed.
['input', 'change'].forEach((type) =>
  form.addEventListener(type, () => {
    if (hasError(steps[current])) validate(steps[current], false);
  })
);

back.addEventListener('click', () => show(current - 1));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate(steps[current])) return;
  if (current < steps.length - 1) return show(current + 1);

  const data = {
    interests: checked('interests').filter((v) => v !== 'all'),
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    youngestChild: checked('age')[0],
    email: form.email.value.trim(),
    consent: form.consent.checked,
    language: lang,
  };
  console.log('Form submitted:', data);

  doneTitle.textContent = t('doneTitle', { name: data.firstName });
  form.hidden = true;
  done.hidden = false;
  done.focus();
});

// Restore the visitor's last language choice.
try {
  const saved = localStorage.getItem('lang');
  if (saved !== lang && STRINGS[saved]) setLang(saved);
} catch {}
