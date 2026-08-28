const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const actionStatus = document.getElementById('actionStatus');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const navigationItems = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navigationItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('[data-message]').forEach((button) => {
  button.addEventListener('click', () => {
    actionStatus.textContent = button.dataset.message;
  });
});

const WEB3FORMS_ACCESS_KEY = 'f342a994-d651-44ea-8dc6-545f53d510bb';

document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formStatus = document.getElementById('formStatus');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!form.checkValidity()) {
    form.reportValidity();
    formStatus.textContent = 'Please complete all required fields with valid details.';
    return;
  }

  if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    formStatus.textContent = 'Message could not be sent. The contact form is not configured yet.';
    return;
  }

  const formData = new FormData(form);

  formData.set('access_key', WEB3FORMS_ACCESS_KEY);
  formData.set('subject', form.elements.subject.value.trim());
  formData.set('replyto', form.elements.email.value.trim());
  formStatus.textContent = 'Sending your message...';
  submitButton.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error(result.message || 'Message submission failed');
    }

    formStatus.textContent = 'Message sent successfully. Thank you for reaching out!';
    form.reset();
  } catch (error) {
    formStatus.textContent = `Message could not be sent. ${error.message}`;
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
