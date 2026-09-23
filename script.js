/* ==========================================================================
   Seetha S – Portfolio Interaction Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Navbar Scroll Style
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. Mobile Navigation Auto-close
  const navCollapse = document.getElementById('navMenu');
  if (navCollapse && window.bootstrap) {
    const navLinks = navCollapse.querySelectorAll('.nav-link, .btn-download');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const bsCollapse = window.bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }

  // 4. Hero Code Card 3D Tilt Effect
  const codeCard = document.getElementById('heroCodeCard');
  if (codeCard && window.matchMedia('(hover: hover)').matches) {
    const wrapper = codeCard.closest('.hero-card-container');
    if (wrapper) {
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        codeCard.style.transform = `perspective(1000px) rotateX(${6 - y * 10}deg) rotateY(${-8 + x * 12}deg) rotateZ(1.5deg) translateZ(12px)`;
      });

      wrapper.addEventListener('mouseleave', () => {
        codeCard.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(6deg) rotateZ(1.5deg)';
      });
    }
  }

  // 5. Download CV Action
  const cvBtn = document.getElementById('downloadCvBtn');
  if (cvBtn) {
    cvBtn.addEventListener('click', () => {
      const originalHtml = cvBtn.innerHTML;
      cvBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Downloading...';
      
      setTimeout(() => {
        cvBtn.innerHTML = originalHtml;
      }, 2000);
    });
  }

  // 6. Contact Form Submission (Web3Forms Email Integration)
  const form = document.getElementById('contactForm');
  const successToast = document.getElementById('formSuccessToast');
  const errorToast = document.getElementById('formErrorToast');
  const submitBtn = document.getElementById('submitBtn');
  const accessKeyInput = document.getElementById('web3formsKey');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      if (successToast) successToast.classList.add('d-none');
      if (errorToast) errorToast.classList.add('d-none');

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';

      const formData = new FormData(form);
      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

      // If access key is placeholder, use mailto fallback
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        const name = document.getElementById('contactName')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const subject = document.getElementById('contactSubject')?.value || 'New Project Inquiry';
        const message = document.getElementById('contactMessage')?.value || '';

        const mailtoUrl = `mailto:seethasivakumar001@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        window.location.href = mailtoUrl;

        if (successToast) {
          successToast.textContent = 'Opening your email client to send message...';
          successToast.classList.remove('d-none');
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        form.reset();
        form.classList.remove('was-validated');
        return;
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          if (successToast) {
            successToast.innerHTML = '<i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i> Thank you! Your message has been sent successfully.';
            successToast.classList.remove('d-none');
            successToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();
          form.classList.remove('was-validated');

          setTimeout(() => {
            if (successToast) successToast.classList.add('d-none');
          }, 6000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (errorToast) {
          errorToast.classList.remove('d-none');
          errorToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // 7. Interactive Chart Bars Animation on View
  const bars = document.querySelectorAll('.bar');
  if (bars.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((bar) => {
            const originalHeight = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
              bar.style.height = originalHeight;
            }, 100);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const dashboard = document.querySelector('.dashboard-mockup');
    if (dashboard) observer.observe(dashboard);
  }

});
