/**
 * CLÍNICA DENTAL SONRISA SANA - LÓGICA INTERACTIVA EDUCATIVA
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect & Reading Progress Bar
  initScrollEffects();

  // 2. Mobile Navigation Toggle
  initMobileMenu();

  // 3. Tooth Stages Tabs (El Mito del Dolor)
  initToothStagesTabs();

  // 4. Interactive Dental Health Quiz
  initDentalQuiz();

  // 5. Interactive Savings Calculator Slider
  initSavingsCalculator();

  // 6. Myths vs Realities Accordion
  initMythsAccordion();

  // 7. Booking Form Validation & Success Modal
  initBookingForm();
});

/* ==========================================================================
   1. SCROLL EFFECTS & READING PROGRESS
   ========================================================================== */
function initScrollEffects() {
  const header = document.getElementById('mainHeader');
  const progressBar = document.getElementById('readingProgress');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header sticky shadow
    if (header) {
      if (scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Progress bar width
    if (progressBar && docHeight > 0) {
      const progressPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Active navigation item on scroll
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-item');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-open');
  });

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. TOOTH STAGES TABS (EL MITO DEL DOLOR)
   ========================================================================== */
function initToothStagesTabs() {
  const tabs = document.querySelectorAll('.stage-tab-btn');
  const panels = document.querySelectorAll('.stage-card');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetStage = tab.getAttribute('data-stage');

      // Update Tab Buttons
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panels
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      const activePanel = document.getElementById(`stage-panel-${targetStage}`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.hidden = false;
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE DENTAL HEALTH QUIZ
   ========================================================================== */
function initDentalQuiz() {
  const questionCards = document.querySelectorAll('.quiz-question');
  const stepIndicator = document.getElementById('quizStepIndicator');
  const progressBar = document.getElementById('quizProgressBar');
  const resultArea = document.getElementById('quizResultArea');
  const questionsArea = document.getElementById('quizQuestionsArea');
  const restartBtn = document.getElementById('btnRestartQuiz');

  const resultIcon = document.getElementById('resultIcon');
  const resultTag = document.getElementById('resultTag');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultTipsList = document.getElementById('resultTipsList');

  if (!questionCards.length) return;

  let currentQuestion = 0;
  let totalPoints = 0;
  const userAnswers = [];

  // Handle Option Clicks
  const optionButtons = document.querySelectorAll('.quiz-opt-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const points = parseInt(button.getAttribute('data-points') || '0', 10);
      const answerText = button.getAttribute('data-answer') || '';

      totalPoints += points;
      userAnswers.push({
        question: currentQuestion + 1,
        answer: answerText,
        points: points
      });

      // Advance or show results
      if (currentQuestion < questionCards.length - 1) {
        questionCards[currentQuestion].classList.remove('active');
        currentQuestion++;
        questionCards[currentQuestion].classList.add('active');

        // Update progress UI
        const currentStepNum = currentQuestion + 1;
        const totalSteps = questionCards.length;
        if (stepIndicator) {
          stepIndicator.textContent = `Pregunta ${currentStepNum} de ${totalSteps}`;
        }
        if (progressBar) {
          progressBar.style.width = `${(currentStepNum / totalSteps) * 100}%`;
        }
      } else {
        // Show Final Results
        showQuizResults(totalPoints);
      }
    });
  });

  function showQuizResults(score) {
    if (questionsArea) questionsArea.style.display = 'none';
    if (resultArea) {
      resultArea.hidden = false;
      resultArea.style.display = 'block';
    }
    if (stepIndicator) stepIndicator.textContent = 'Resultado Completado';
    if (progressBar) progressBar.style.width = '100%';

    let icon = '🎉';
    let tag = 'Salud Óptima Preventiva';
    let title = '¡Enhorabuena! Tienes una base bucal excelente';
    let desc = 'Tus hábitos parecen buenos. Una revisión rutinaria cada 6-12 meses es el método infalible para asegurar que no haya ninguna micro-caries oculta y mantener tus encías perfectas.';
    let tips = [
      'Mantén el cepillado de 2 minutos 2 veces al día (¡la noche es clave!).',
      'Usa hilo dental a diario para limpiar el 40% de superficie invisible.',
      'Programa tu revisión de control rutinario para asegurar tu tranquilidad.'
    ];

    if (score >= 3 && score <= 6) {
      icon = '🔍';
      tag = 'Atención Recomendada';
      title = 'Es un momento ideal para un chequeo preventivo';
      desc = 'Has indicado algunas señales leves (tiempo sin acudir, ligera sensibilidad o sangrado puntual). La buena noticia es que estás en la fase más fácil y económica de solucionar.';
      tips = [
        'Una limpieza profesional retirará el sarro calcificado que causa el sangrado.',
        'La revisión descartará micro-caries en el esmalte antes de que toquen la dentina.',
        'Pide tu cita preventiva este mes para evitar que avance a tratamientos mayores.'
      ];
    } else if (score > 6) {
      icon = '🛡️';
      tag = 'Revisión Prioritaria Aconsejada';
      title = 'Tu boca te está pidiendo un poco de cuidado profesional';
      desc = 'El sangrado frecuente, el dolor o llevar más de 2 años sin acudir son alertas claras de que puede haber procesos activos. Ven con total tranquilidad: estamos para ayudarte sin juzgarte.';
      tips = [
        'Un diagnóstico digital valorará el estado del hueso y las encías.',
        'Tratar una molestia a tiempo previene endodoncias de urgencia o extracciones.',
        'Te explicaremos todo paso a paso con máxima delicadeza y cero dolor.'
      ];
    }

    if (resultIcon) resultIcon.textContent = icon;
    if (resultTag) resultTag.textContent = tag;
    if (resultTitle) resultTitle.textContent = title;
    if (resultDesc) resultDesc.textContent = desc;

    if (resultTipsList) {
      resultTipsList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');
    }
  }

  // Restart Quiz
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentQuestion = 0;
      totalPoints = 0;
      userAnswers.length = 0;

      questionCards.forEach((q, idx) => {
        if (idx === 0) {
          q.classList.add('active');
        } else {
          q.classList.remove('active');
        }
      });

      if (questionsArea) questionsArea.style.display = 'block';
      if (resultArea) {
        resultArea.hidden = true;
        resultArea.style.display = 'none';
      }
      if (stepIndicator) stepIndicator.textContent = `Pregunta 1 de ${questionCards.length}`;
      if (progressBar) progressBar.style.width = '25%';
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE SAVINGS CALCULATOR SLIDER
   ========================================================================== */
function initSavingsCalculator() {
  const slider = document.getElementById('yearsSlider');
  const yearsVal = document.getElementById('yearsVal');
  const moneySavedVal = document.getElementById('moneySavedVal');
  const timeSavedVal = document.getElementById('timeSavedVal');

  if (!slider) return;

  const updateCalculations = () => {
    const years = parseInt(slider.value, 10);
    if (yearsVal) {
      yearsVal.textContent = years >= 5 ? '5+' : years;
    }

    // Realistic economic & time approximations
    // 1 year without checkup: ~280€ saved vs potential cavity repair / ~3 hours saved
    // 2 years: ~650€ / ~5 hours
    // 3 years: ~980€ / ~7 hours
    // 4 years: ~1350€ / ~9 hours
    // 5 years: ~1800€ / ~12 hours
    const savingsData = {
      1: { money: 'Ahorras ~320 €', time: 'Te evitas ~3 horas de visitas' },
      2: { money: 'Ahorras ~650 €', time: 'Te evitas ~5 horas de visitas' },
      3: { money: 'Ahorras ~980 €', time: 'Te evitas ~7 horas de visitas' },
      4: { money: 'Ahorras ~1.350 €', time: 'Te evitas ~9 horas de visitas' },
      5: { money: 'Ahorras ~1.850 €', time: 'Te evitas ~12 horas de visitas' }
    };

    const currentData = savingsData[years] || savingsData[2];

    if (moneySavedVal) moneySavedVal.textContent = currentData.money;
    if (timeSavedVal) timeSavedVal.textContent = currentData.time;
  };

  slider.addEventListener('input', updateCalculations);
}

/* ==========================================================================
   6. MYTHS VS REALITIES ACCORDION
   ========================================================================== */
function initMythsAccordion() {
  const accordionItems = document.querySelectorAll('#mythsAccordion .accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for clean single accordion view
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherTrigger = otherItem.querySelector('.accordion-trigger');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        if (otherContent) otherContent.hidden = true;
      });

      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });
}

/* ==========================================================================
   7. BOOKING FORM VALIDATION & CONFIRMATION MODAL
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('btnCloseModal');
  const modalSummary = document.getElementById('modalSummary');

  if (!form) return;

  const nameInput = document.getElementById('userName');
  const phoneInput = document.getElementById('userPhone');
  const privacyCheckbox = document.getElementById('privacyConsent');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setError(nameInput);
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Phone (Spanish 9-digit or general phone pattern)
    const phoneVal = phoneInput.value.trim().replace(/\s+/g, '');
    const phonePattern = /^[0-9+]{8,15}$/;
    if (!phoneVal || !phonePattern.test(phoneVal)) {
      setError(phoneInput);
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    // Validate Privacy
    if (!privacyCheckbox.checked) {
      setError(privacyCheckbox);
      isValid = false;
    } else {
      clearError(privacyCheckbox);
    }

    if (isValid) {
      const reasonSelect = document.getElementById('userReason');
      const reasonText = reasonSelect ? reasonSelect.options[reasonSelect.selectedIndex].text : 'Revisión General';
      const shiftSelected = document.querySelector('input[name="shift"]:checked');
      const shiftText = shiftSelected && shiftSelected.value === 'mananas' ? 'Mañanas (09:00 - 14:00)' : 'Tardes (15:00 - 20:30)';

      if (modalSummary) {
        modalSummary.innerHTML = `
          <strong>Paciente:</strong> ${escapeHtml(nameInput.value.trim())}<br>
          <strong>Teléfono:</strong> ${escapeHtml(phoneVal)}<br>
          <strong>Motivo:</strong> ${escapeHtml(reasonText)}<br>
          <strong>Preferencia horaria:</strong> ${shiftText}
        `;
      }

      // Open modal
      if (modal) {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
      }

      // Reset form
      form.reset();
    }
  });

  // Real-time input clearing
  [nameInput, phoneInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearError(input);
    });
  });

  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', () => {
      clearError(privacyCheckbox);
    });
  }

  // Close modal listeners
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function setError(element) {
    const group = element.closest('.form-group');
    if (group) group.classList.add('has-error');
  }

  function clearError(element) {
    const group = element.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
}
