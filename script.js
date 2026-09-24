(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuToggle = document.getElementById('menuToggle');
  var navMobile = document.getElementById('navMobile');
  var navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  function onScroll() {
    if (window.scrollY > 16) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  function updateActiveNav() {
    var sections = document.querySelectorAll('section[id], footer[id]');
    var scrollPos = window.scrollY + 120;
    var currentId = '';
    sections.forEach(function (s) {
      if (scrollPos >= s.offsetTop) currentId = s.id;
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '#' + currentId) link.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  menuToggle.addEventListener('click', function () {
    var open = menuToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navMobile.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menuToggle.classList.remove('open');
      navMobile.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-section').forEach(function (el) {
    revealObserver.observe(el);
  });

  var mapDots = document.getElementById('mapDots');
  if (mapDots) {
    var dots = [];
    for (var y = 30; y < 390; y += 18) {
      for (var x = 30; x < 930; x += 18) {
        var opacity = 0.08 + Math.random() * 0.12;
        dots.push('<circle cx="' + x + '" cy="' + y + '" r="1.5" fill="rgba(148,163,184,' + opacity + ')"/>');
      }
    }
    mapDots.innerHTML = dots.join('');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      menuToggle.classList.remove('open');
      navMobile.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

const subscribeForm = document.getElementById("subscribeForm");
const subscriberEmail = document.getElementById("subscriberEmail");
const subscribeMessage = document.getElementById("subscribeMessage");

subscribeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = subscriberEmail.value.trim();

    if (!email) return;

    subscribeMessage.textContent = "Thank you for subscribing to RETURN.";
    subscriberEmail.value = "";
});

