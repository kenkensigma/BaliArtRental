/**
 * BALI ART RENTAL & PRODUCTION : CLIENT SCRIPT
 * Handles cinematic scroll reveals, mobile drawer, active section highlighting,
 * accessible keyboard interactions, and verified inquiry form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Dynamic Copyright Year
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Cinematic Scroll-Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // -------------------------------------------------------------------------
  // 3. Header Scroll State
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');

  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // -------------------------------------------------------------------------
  // 4. Mobile Drawer Navigation & Backdrop
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    if (!menuToggle || !mobileDrawer || !mobileBackdrop) return;
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus first link in drawer
    const firstLink = mobileDrawer.querySelector('a');
    if (firstLink) firstLink.focus();
  };

  const closeDrawer = () => {
    if (!menuToggle || !mobileDrawer || !mobileBackdrop) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    menuToggle.focus();
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer when any mobile nav link is clicked
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Handle Escape key to close mobile drawer
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // -------------------------------------------------------------------------
  // 5. Active Navigation Link Highlighting on Scroll
  // -------------------------------------------------------------------------
  const observedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            desktopNavLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('is-active');
              } else {
                link.classList.remove('is-active');
              }
            });
            mobileNavLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('is-active');
              } else {
                link.classList.remove('is-active');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    observedSections.forEach((sec) => navObserver.observe(sec));
  }

  // -------------------------------------------------------------------------
  // 6. Smooth Scroll with Header Offset for Anchor Links
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Set focus to target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Interactive Inquiry Form Validation & Submission Feedback
  // -------------------------------------------------------------------------
  const inquiryForm = document.getElementById('event-inquiry-form');
  const submissionAlert = document.getElementById('submission-alert');
  const alertSummary = document.getElementById('alert-summary');
  const resetFormBtn = document.getElementById('reset-inquiry-btn');
  const directWaBtn = document.getElementById('direct-wa-btn');

  if (inquiryForm) {
    // Form fields
    const nameField = document.getElementById('inquiry-name');
    const contactField = document.getElementById('inquiry-contact');
    const typeField = document.getElementById('inquiry-type');
    const dateField = document.getElementById('inquiry-date');
    const locationField = document.getElementById('inquiry-location');
    const messageField = document.getElementById('inquiry-message');

    const validateField = (input, condition, errorId) => {
      const group = input.closest('.form-group');
      const errorMsg = document.getElementById(errorId);
      if (!condition) {
        group.classList.add('has-error');
        if (errorMsg) errorMsg.style.display = 'block';
        return false;
      } else {
        group.classList.remove('has-error');
        if (errorMsg) errorMsg.style.display = 'none';
        return true;
      }
    };

    // Live validation on blur
    if (nameField) {
      nameField.addEventListener('blur', () => {
        validateField(nameField, nameField.value.trim().length >= 2, 'err-name');
      });
    }

    if (contactField) {
      contactField.addEventListener('blur', () => {
        validateField(contactField, contactField.value.trim().length >= 5, 'err-contact');
      });
    }

    if (typeField) {
      typeField.addEventListener('change', () => {
        validateField(typeField, typeField.value.trim() !== '', 'err-type');
      });
    }

    if (messageField) {
      messageField.addEventListener('blur', () => {
        validateField(messageField, messageField.value.trim().length >= 10, 'err-message');
      });
    }

    // Submit handler
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameField, nameField.value.trim().length >= 2, 'err-name');
      const isContactValid = validateField(contactField, contactField.value.trim().length >= 5, 'err-contact');
      const isTypeValid = validateField(typeField, typeField.value.trim() !== '', 'err-type');
      const isMessageValid = validateField(messageField, messageField.value.trim().length >= 10, 'err-message');

      if (!isNameValid || !isContactValid || !isTypeValid || !isMessageValid) {
        // Focus first field with error
        const firstError = inquiryForm.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Valid submission
      const clientName = nameField.value.trim();
      const clientContact = contactField.value.trim();
      const eventType = typeField.options[typeField.selectedIndex].text;
      const eventDate = dateField.value || 'To be determined';
      const eventLocation = locationField.value.trim() || 'Bali (Venue TBD)';
      const projectReqs = messageField.value.trim();

      // Build structured summary text
      const summaryText = `Client: ${clientName} | Contact: ${clientContact}\nEvent: ${eventType}\nDate: ${eventDate}\nVenue: ${eventLocation}\nRequirements: ${projectReqs}`;

      if (alertSummary) {
        alertSummary.textContent = summaryText;
      }

      // Prepare WhatsApp prefilled link with inquiry data
      const waNumber = '6281234567890'; // Placeholder client WA
      const waMessage = encodeURIComponent(
        `Hello Bali Art Rental & Production,\n\nI would like to discuss event production for:\n• Client: ${clientName}\n• Event Type: ${eventType}\n• Proposed Date: ${eventDate}\n• Venue: ${eventLocation}\n• Details: ${projectReqs}\n\nLooking forward to your consultation.`
      );

      if (directWaBtn) {
        directWaBtn.setAttribute('href', `https://wa.me/${waNumber}?text=${waMessage}`);
      }

      // Reveal feedback card
      inquiryForm.style.display = 'none';
      if (submissionAlert) {
        submissionAlert.classList.add('is-active');
        submissionAlert.setAttribute('tabindex', '-1');
        submissionAlert.focus();
      }
    });

    // Reset handler
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        inquiryForm.reset();
        inquiryForm.style.display = 'block';
        if (submissionAlert) {
          submissionAlert.classList.remove('is-active');
        }
        nameField.focus();
      });
    }
  }
});
