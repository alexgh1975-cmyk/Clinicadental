/**
 * CLÍNICA DENTAL AURADENT - High-Converting Interactive Logic
 * Handles interactive before/after slider, multi-step booking engine,
 * symptom evaluator quiz, FAQ accordion, modals, and dynamic social proof toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initBeforeAfterSlider();
  initSymptomEvaluator();
  initMultiStepBooking();
  initModalSystem();
  initFaqAccordion();
  initTreatmentButtons();
  initSocialProofToasts();
  initSpotsCounter();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('navigation-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE BEFORE & AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const sliderBox = document.getElementById('ba-slider-box');
  const sliderRange = document.getElementById('ba-slider-range');
  const afterWrapper = document.getElementById('ba-after-wrapper');
  const afterImg = document.getElementById('ba-after-img');
  const handle = document.getElementById('ba-handle');

  if (!sliderBox || !sliderRange || !afterWrapper || !afterImg || !handle) return;

  function updateSlider(val) {
    const boxWidth = sliderBox.offsetWidth;
    afterWrapper.style.width = `${val}%`;
    afterImg.style.width = `${boxWidth}px`;
    handle.style.left = `${val}%`;
  }

  // Update on input
  sliderRange.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Keep image width synced with container on resize
  window.addEventListener('resize', () => {
    updateSlider(sliderRange.value);
  });

  // Initial call
  updateSlider(50);
}

/* ==========================================================================
   4. INTERACTIVE SYMPTOM & SMILE EVALUATOR
   ========================================================================== */
function initSymptomEvaluator() {
  const optionBtns = document.querySelectorAll('.symptom-option-btn');
  const step1 = document.getElementById('eval-step-1');
  const step2 = document.getElementById('eval-step-2');
  const pill1 = document.getElementById('eval-pill-1');
  const pill2 = document.getElementById('eval-pill-2');
  const resultHeading = document.getElementById('eval-result-heading');
  const resultParagraph = document.getElementById('eval-result-paragraph');
  const resetBtn = document.getElementById('eval-reset-btn');
  const applyBtn = document.getElementById('eval-apply-btn');

  if (!optionBtns.length || !step1 || !step2) return;

  let selectedTreatmentKey = 'implantes';

  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      optionBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      selectedTreatmentKey = btn.getAttribute('data-treatment');

      if (resultHeading) resultHeading.textContent = title;
      if (resultParagraph) resultParagraph.textContent = desc;

      // Switch to Step 2
      step1.classList.remove('active');
      step2.classList.add('active');
      pill1.classList.remove('active');
      pill2.classList.add('active');
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
      pill2.classList.remove('active');
      pill1.classList.add('active');
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      // Pre-select service in booking form
      selectServiceInBookingForm(selectedTreatmentKey);
    });
  }
}

/* ==========================================================================
   5. MULTI-STEP APPOINTMENT BOOKING ENGINE
   ========================================================================== */
function initMultiStepBooking() {
  const form = document.getElementById('appointment-form');
  const successScreen = document.getElementById('booking-success-screen');
  const serviceCards = document.querySelectorAll('.service-option-card');
  const stepIndicator = document.getElementById('step-indicator-text');
  
  const step1 = document.getElementById('booking-step-1');
  const step2 = document.getElementById('booking-step-2');
  const step3 = document.getElementById('booking-step-3');

  const dot1 = document.getElementById('dot-1');
  const dot2 = document.getElementById('dot-2');
  const dot3 = document.getElementById('dot-3');

  const line1 = document.getElementById('line-1');
  const line2 = document.getElementById('line-2');

  const btnNext1 = document.getElementById('btn-next-step-1');
  const btnPrev2 = document.getElementById('btn-prev-step-2');
  const btnNext2 = document.getElementById('btn-next-step-2');
  const btnPrev3 = document.getElementById('btn-prev-step-3');
  const btnReset = document.getElementById('btn-reset-form');

  const dateInput = document.getElementById('booking-date');

  if (!form || !step1 || !step2 || !step3) return;

  // Set default minimum date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  let selectedService = 'Implantes Dentales';

  // Service Card Selection
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const name = card.querySelector('.service-option-name');
      if (name) selectedService = name.textContent.trim();
    });
  });

  // Step Navigation Logic
  function goToStep(stepNumber) {
    [step1, step2, step3].forEach(s => s.classList.remove('active'));
    [dot1, dot2, dot3].forEach(d => {
      d.classList.remove('active');
      d.classList.remove('completed');
    });
    [line1, line2].forEach(l => l.classList.remove('completed'));

    if (stepNumber === 1) {
      step1.classList.add('active');
      dot1.classList.add('active');
      if (stepIndicator) stepIndicator.textContent = 'Paso 1 de 3';
    } else if (stepNumber === 2) {
      step2.classList.add('active');
      dot1.classList.add('completed');
      line1.classList.add('completed');
      dot2.classList.add('active');
      if (stepIndicator) stepIndicator.textContent = 'Paso 2 de 3';
    } else if (stepNumber === 3) {
      step3.classList.add('active');
      dot1.classList.add('completed');
      line1.classList.add('completed');
      dot2.classList.add('completed');
      line2.classList.add('completed');
      dot3.classList.add('active');
      if (stepIndicator) stepIndicator.textContent = 'Paso 3 de 3';
    }
  }

  if (btnNext1) {
    btnNext1.addEventListener('click', () => goToStep(2));
  }
  if (btnPrev2) {
    btnPrev2.addEventListener('click', () => goToStep(1));
  }
  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      if (!dateInput.value) {
        showToast('Por favor, selecciona una fecha para tu cita.');
        dateInput.focus();
        return;
      }
      goToStep(3);
    });
  }
  if (btnPrev3) {
    btnPrev3.addEventListener('click', () => goToStep(2));
  }

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('patient-name');
    const phoneInput = document.getElementById('patient-phone');
    const emailInput = document.getElementById('patient-email');
    const timePrefInput = document.getElementById('booking-time-pref');

    if (!nameInput.value || !phoneInput.value || !emailInput.value) {
      showToast('Por favor, completa los campos obligatorios.');
      return;
    }

    // Populate Success Ticket
    const patientName = nameInput.value.trim().split(' ')[0] || 'Paciente';
    const randomCode = 'AUR-' + Math.floor(1000 + Math.random() * 9000);
    const dateFormatted = dateInput.value;
    const timePref = timePrefInput ? timePrefInput.value : 'Tarde';

    const successNameEl = document.getElementById('success-patient-name');
    const ticketCodeEl = document.getElementById('ticket-code');
    const ticketServiceEl = document.getElementById('ticket-service');
    const ticketDatetimeEl = document.getElementById('ticket-datetime');

    if (successNameEl) successNameEl.textContent = patientName;
    if (ticketCodeEl) ticketCodeEl.textContent = randomCode;
    if (ticketServiceEl) ticketServiceEl.textContent = selectedService;
    if (ticketDatetimeEl) ticketDatetimeEl.textContent = `${dateFormatted} · ${timePref}`;

    // Switch view
    form.style.display = 'none';
    if (successScreen) successScreen.classList.add('active');

    showToast(`¡Cita confirmada con éxito, ${patientName}!`);
  });

  // Reset Form
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successScreen) successScreen.classList.remove('active');
      goToStep(1);
    });
  }
}

// Global Helper to Pre-select a Service in Form
function selectServiceInBookingForm(serviceKey) {
  const serviceCards = document.querySelectorAll('.service-option-card');
  serviceCards.forEach(card => {
    if (card.getAttribute('data-service') === serviceKey) {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
  });
}

/* ==========================================================================
   6. MODAL QUICK APPOINTMENT SYSTEM
   ========================================================================== */
function initModalSystem() {
  const modalOverlay = document.getElementById('booking-modal-overlay');
  const closeBtn = document.getElementById('close-modal-btn');
  const modalTriggers = document.querySelectorAll('.open-booking-modal');
  const quickForm = document.getElementById('modal-quick-form');
  const treatmentSelect = document.getElementById('modal-treatment-select');

  if (!modalOverlay) return;

  function openModal(prefService) {
    modalOverlay.classList.add('open');
    if (prefService && treatmentSelect) {
      for (let i = 0; i < treatmentSelect.options.length; i++) {
        if (treatmentSelect.options[i].value.toLowerCase().includes(prefService.toLowerCase())) {
          treatmentSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pref = btn.getAttribute('data-pref') || '';
      openModal(pref);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value || 'Paciente';
      closeModal();
      showToast(`¡Solicitud recibida! Te llamaremos en menos de 15 min, ${name}.`);
      quickForm.reset();
    });
  }
}

/* ==========================================================================
   7. TREATMENT CARDS QUICK ACTION BUTTONS
   ========================================================================== */
function initTreatmentButtons() {
  const treatmentBtns = document.querySelectorAll('.treatment-link-btn');
  treatmentBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pref = btn.getAttribute('data-pref');
      if (pref) {
        selectServiceInBookingForm(pref);
      }
    });
  });
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. TOAST NOTIFICATIONS & SOCIAL PROOF SYSTEM
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span style="color: var(--accent-teal); font-size: 1.2rem;">✓</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function initSocialProofToasts() {
  const notifications = [
    'Marta R. de Madrid acaba de reservar su 1ª Cita Gratuita hace 4 min',
    'Carlos G. solicitó estudio 3D para Implantes Dentales hace 12 min',
    'Lucía V. reservó cita para Ortodoncia Invisible Invisalign hace 18 min',
    'Javier M. confirmó su revisión diagnóstica gratuita sin dolor hace 25 min'
  ];

  let index = 0;

  // First toast after 7 seconds
  setTimeout(() => {
    showToast(notifications[index]);
    index = (index + 1) % notifications.length;

    // Recurring toasts every 30 seconds
    setInterval(() => {
      showToast(notifications[index]);
      index = (index + 1) % notifications.length;
    }, 30000);
  }, 7000);
}

/* ==========================================================================
   10. SPOTS REMAINING COUNTER
   ========================================================================== */
function initSpotsCounter() {
  const counterEl = document.getElementById('spots-counter-text');
  if (!counterEl) return;

  // Realistic dynamic number between 5 and 7
  let spots = 6;
  setInterval(() => {
    if (Math.random() > 0.7 && spots > 3) {
      spots--;
      counterEl.textContent = `Quedan ${spots} plazas disponibles esta semana`;
    }
  }, 45000);
}
