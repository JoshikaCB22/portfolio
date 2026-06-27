'use strict';

/**
 * main.js
 * - Mobile hamburger menu toggle
 * - Intersection Observer fade-in animations
 * - Active nav link highlighting on scroll
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════════
     HAMBURGER MENU
     ══════════════════════════════════════════════ */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu when a nav link is clicked (single-page navigation) */
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (event) {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ══════════════════════════════════════════════
     FADE-IN ANIMATION (Intersection Observer)
     ══════════════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    /* Observe sections and cards/category blocks that will be dynamically added */
    document.querySelectorAll('.section, .fade-in').forEach(function (el) {
      el.classList.add('fade-in');
      fadeObserver.observe(el);
    });

    /* Also observe dynamically-injected cards once the DOM settles */
    const gridObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            /* Observe the node itself if it needs fade-in */
            if (node.classList && node.classList.contains('fade-in')) {
              fadeObserver.observe(node);
            }
            /* Observe any fade-in descendants */
            if (node.querySelectorAll) {
              node.querySelectorAll('.fade-in').forEach(function (child) {
                fadeObserver.observe(child);
              });
            }
          }
        });
      });
    });

    ['projects-grid', 'skills-container'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) gridObserver.observe(el, { childList: true, subtree: true });
    });

  } else {
    /* Fallback: make everything visible immediately */
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ══════════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHTING (scroll-based)
     ══════════════════════════════════════════════ */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links .nav-link[href^="#"]');

  if (sections.length === 0 || navAnchors.length === 0) return;

  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '64',
    10
  );

  /**
   * Determines which section is currently in view and highlights
   * the corresponding nav link.
   */
  function updateActiveLink() {
    let currentId = '';

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= navHeight + 24) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* Run once on load, then on scroll */
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });

});
