/* =====================================================
   DIVYA SANJAY DESALE — PORTFOLIO JAVASCRIPT
   ===================================================== */

'use strict';

// ============================================================
// TYPED ROLE ANIMATION
// ============================================================
const roles = [
  'Data Analyst',
  'Statistics Enthusiast',
  'Python Developer',
  'Nature Photographer',
  'Problem Solver',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-role');

function typeRole() {
  const current = roles[roleIndex];
  if (!typedEl) return;

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, isDeleting ? 60 : 90);
}
setTimeout(typeRole, 600);


// ============================================================
// NAVBAR — SCROLL + ACTIVE SECTION
// ============================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // sticky nav
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // back to top
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    if (window.scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  }

  // active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});

// close on link click
mobileMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});


// ============================================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


// ============================================================
// SKILL BARS — ANIMATE ON VISIBLE
// ============================================================
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-width');
          setTimeout(() => { fill.style.width = targetWidth; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('#skills').forEach(el => skillObserver.observe(el));


// ============================================================
// COUNTER ANIMATION (STATS)
// ============================================================
function animateCounter(el, target, decimals = 2, duration = 1500) {
  const start = performance.now();
  const from = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = from + (target - from) * ease;
    el.textContent = current.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target.querySelector('.stat-number');
        if (!el) return;
        const text = el.textContent.trim();
        const num = parseFloat(text);
        if (!isNaN(num)) {
          const decimals = text.includes('.') ? text.split('.')[1].length : 0;
          animateCounter(el, num, decimals, 1400);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card').forEach(el => counterObserver.observe(el));


// ============================================================
// FLOATING PARTICLES
// ============================================================
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 28;

if (particleContainer) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = Math.random() * 100;
    const size = Math.random() * 3 + 1.5;
    const duration = Math.random() * 14 + 8;
    const delay = Math.random() * 10;
    const drift = (Math.random() - 0.5) * 160;
    p.style.cssText = `
      left: ${x}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
      opacity: ${Math.random() * 0.4 + 0.1};
    `;
    particleContainer.appendChild(p);
  }
}


// ============================================================
// BACK TO TOP
// ============================================================
document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('submit-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  // Simulate send (replace with real endpoint / EmailJS / Formspree)
  await new Promise(r => setTimeout(r, 1600));

  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';

  if (formSuccess) {
    formSuccess.textContent = '✅ Thank you! I\'ll get back to you soon.';
    formSuccess.style.display = 'block';
  }

  contactForm.reset();

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.background = '';
    if (formSuccess) formSuccess.textContent = '';
  }, 5000);
});


// ============================================================
// SMOOTH HOVER TILT ON PROJECT CARDS
// ============================================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ============================================================
// ACTIVE NAV ON LOAD
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  // Stagger reveal delays for child elements
  document.querySelectorAll('.skills-grid .skill-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
  });
  document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
  document.querySelectorAll('.hobbies-grid .hobby-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
});
