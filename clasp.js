// ==========================================
// CLASP — Combined JavaScript
// ==========================================

// ── Contact form ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var contactForm = document.getElementById('contact-form');
  var formStatus  = document.getElementById('form-status');
  var submitBtn   = document.getElementById('submit-btn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending…';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    formStatus.style.display = 'none';

    try {
      var response = await fetch('contact.php', {
        method: 'POST',
        body: new FormData(contactForm)
      });
      var result = await response.json();

      if (response.ok && result.success) {
        formStatus.style.display = 'block';
        formStatus.style.backgroundColor = '#d1fae5';
        formStatus.style.color = '#065f46';
        formStatus.innerText = "Message sent! We\u2019ll be in touch within one business day.";
        contactForm.reset();
      } else {
        throw new Error(result.error || 'Send failed');
      }
    } catch (err) {
      formStatus.style.display = 'block';
      formStatus.style.backgroundColor = '#fee2e2';
      formStatus.style.color = '#991b1b';
      formStatus.innerText = 'Something went wrong. Please try again or email info@clasp.co.za directly.';
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
    }
  });
});

// ── Homepage: restore assessment position from ?tier=X ────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var results = {
    1: {
      label: 'Position 1 — Starting out',
      pct: 10,
      text: 'You\'re not alone — most FSPs at your stage are in the same position. The good news is that starting structured work now, before a supervisory visit or incident, means you control the pace. A full compliance engagement is the right starting point. We\'ll get you to Position 5 in around six weeks.'
    },
    2: {
      label: 'Position 2 — In progress',
      pct: 30,
      text: 'You have the right instincts and some groundwork in place. What\'s missing is a JS2-specific framework approved by the governing body, and documentation that holds up to scrutiny. A full compliance engagement will close those gaps quickly, building on what you already have rather than starting over.'
    },
    3: {
      label: 'Position 3 — Documented but unverified',
      pct: 55,
      text: 'This is a common and underestimated risk position. Documentation that hasn\'t been independently reviewed or tested provides limited regulatory protection. Our review and verification engagement is designed exactly for this — we validate what works, close what doesn\'t, and give you defensible evidence.'
    },
    4: {
      label: 'Position 4 — Compliant but ageing',
      pct: 75,
      text: 'You\'ve done the hard work. What you need now is the annual review that JS2 §6.2.2 explicitly requires — plus a check that your documentation still reflects how you actually operate. Our review and verification engagement will get you current and re-establish the ongoing review cycle.'
    },
    5: {
      label: 'Position 5 — Actively maintained',
      pct: 100,
      text: 'Well done — you\'re where every FSP should be. If CLASP is already supporting you, we\'ll keep you there. If you\'ve reached this position independently, an independent review confirms that your documentation and controls align with what the FSCA would expect to see.'
    }
  };

  function selectOption(el, num) {
    document.querySelectorAll('.assess-opt').forEach(function (o) {
      o.classList.remove('selected');
    });
    el.classList.add('selected');

    var r = results[num];

    var pw = document.getElementById('progress-wrap');
    if (pw) pw.style.display = 'block';

    var pf = document.getElementById('progress-fill');
    if (pf) pf.style.width = r.pct + '%';

    var rl = document.getElementById('result-label');
    if (rl) rl.textContent = r.label;

    var rt = document.getElementById('result-text');
    if (rt) rt.textContent = r.text;

    var res = document.getElementById('result');
    if (res) {
      res.classList.add('visible');
      setTimeout(function () {
        res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }
  }

  // Expose for onclick use
  window.selectOption = selectOption;

  // If coming back from the quiz with a ?tier=X param, pre-select that position
  var params = new URLSearchParams(window.location.search);
  var tier = parseInt(params.get('tier'), 10);
  if (!tier || tier < 1 || tier > 5) return;

  var opts = document.querySelectorAll('.assess-opt');
  var target = opts[tier - 1];
  if (!target) return;

  selectOption(target, tier);

  var section = document.getElementById('assessment');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── Assessment quiz (assessment.html) ─────────────────────────────────────────
var questions = [
  {
    title: "1. Governing body approval JS2 §6.2.1 / JS1 §5.2",
    question: "Has your board or governing body formally approved a cybersecurity framework or IT risk management framework?",
    options: [
      { text: "Yes, it's documented and board-signed", score: 2 },
      { text: "We have something but it hasn't been formally approved", score: 1 },
      { text: "No, nothing formal exists", score: 0 }
    ]
  },
  {
    title: "2. Asset inventory JS2 §7.1.1(d) / JS1 §7.3(e)",
    question: "Do you maintain an up-to-date inventory of your IT and information assets (devices, software, data, systems)?",
    options: [
      { text: "Yes, we have a maintained inventory with owners assigned", score: 2 },
      { text: "We have a partial list but it's not actively maintained", score: 1 },
      { text: "No inventory exists", score: 0 }
    ]
  },
  {
    title: "3. Incident response plan JS2 §7.5.1(a)",
    question: "Do you have a written cyber incident response and management plan that describes what to do when something goes wrong?",
    options: [
      { text: "Yes, it's documented, tested, and staff know their roles", score: 2 },
      { text: "Something exists on paper but it hasn't been tested", score: 1 },
      { text: "No plan exists", score: 0 }
    ]
  },
  {
    title: "4. MSP / third-party oversight JS2 §4.2.3 / JS1 §7.3(i)",
    question: "Is your IT provider or managed service provider (MSP) governed by a formal contract or SLA with defined security responsibilities?",
    options: [
      { text: "Yes, we have a formal SLA with security obligations and we review it", score: 2 },
      { text: "We have a contract but security responsibilities aren't clearly defined", score: 1 },
      { text: "No formal agreement is in place", score: 0 }
    ]
  },
  {
    title: "5. Annual framework review JS2 §6.2.2 / JS1 §7.2",
    question: "Has your cybersecurity or IT risk framework been reviewed in the last 12 months?",
    options: [
      { text: "Yes, reviewed within the past year, findings documented", score: 2 },
      { text: "A review is overdue or partially done", score: 1 },
      { text: "No review has ever taken place", score: 0 }
    ]
  },
  {
    title: "6. Independent testing of controls JS2 §7.7.1 / JS1 §14.1",
    question: "Have your security controls been independently reviewed, tested, or audited — either internally or by an external party?",
    options: [
      { text: "Yes, controls have been tested and results reported to the board", score: 2 },
      { text: "Some controls have been looked at informally but nothing structured", score: 1 },
      { text: "Controls have never been independently tested", score: 0 }
    ]
  },
  {
    title: "7. Multi-factor authentication JS2 §8.3",
    question: "Is multi-factor authentication (MFA) in place for remote access, privileged accounts, and systems containing sensitive information?",
    options: [
      { text: "Yes, MFA is enforced across all critical access points", score: 2 },
      { text: "MFA is partially in place on some but not all systems", score: 1 },
      { text: "MFA is not implemented", score: 0 }
    ]
  },
  {
    title: "8. Staff cybersecurity training JS2 §7.2.7",
    question: "Have all staff (including the board) received cybersecurity awareness training in the past 12 months?",
    options: [
      { text: "Yes, formal training conducted and refreshed annually", score: 2 },
      { text: "Ad hoc awareness exists but no structured programme", score: 1 },
      { text: "No cybersecurity training has been conducted", score: 0 }
    ]
  },
  {
    title: "9. Regulatory incident reporting JS2 §9.1 / JS1 §15.1",
    question: "Do you have a defined process to identify and report material cyber or IT incidents to your responsible authority (FSCA or PA)?",
    options: [
      { text: "Yes, we have a process, know the thresholds, and know how to notify", score: 2 },
      { text: "We're aware of the obligation but the process isn't formally defined", score: 1 },
      { text: "We are not aware of or do not have a reporting process", score: 0 }
    ]
  },
  {
    title: "10. Vulnerability and penetration testing JS2 §7.7.2 / JS2 §7.7.3",
    question: "Are vulnerability assessments or penetration tests carried out on your critical systems on a regular basis?",
    options: [
      { text: "Yes, scheduled assessments are conducted and findings tracked to remediation", score: 2 },
      { text: "We've had a test done before but it's not on a regular schedule", score: 1 },
      { text: "No vulnerability assessments or pen tests have been conducted", score: 0 }
    ]
  }
];

var currentQuestionIndex = 0;
var answers = new Array(questions.length).fill(null);

document.addEventListener('DOMContentLoaded', function () {
  var totalEl = document.getElementById('question-total');
  if (totalEl) totalEl.innerText = questions.length;

  if (document.getElementById('question-container')) renderQuestion();
});

function renderQuestion() {
  var container = document.getElementById('question-container');
  var progressBar = document.getElementById('progress-bar');
  var numberEl = document.getElementById('question-number');
  var nextBtn = document.getElementById('btn-next');

  if (!container || !progressBar) return;

  if (numberEl) numberEl.innerText = currentQuestionIndex + 1;

  progressBar.style.width = ((currentQuestionIndex / questions.length) * 100) + '%';

  var q = questions[currentQuestionIndex];
  var html = '';
  if (q.title) html += '<div class="question-title">' + q.title + '</div>';
  html += '<h2 class="question-text">' + q.question + '</h2>';
  html += '<div class="options-grid">';

  q.options.forEach(function (opt, index) {
    var isSelected = answers[currentQuestionIndex] === opt.score;
    html += '<button class="option-btn' + (isSelected ? ' selected' : '') + '" onclick="selectAnswer(' + opt.score + ', ' + index + ')">' + opt.text + '</button>';
  });

  html += '</div>';
  container.innerHTML = html;

  if (nextBtn) {
    nextBtn.disabled = answers[currentQuestionIndex] === null;
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
  }
}

function selectAnswer(score, optionIndex) {
  answers[currentQuestionIndex] = score;

  var container = document.getElementById('question-container');
  var nextBtn = document.getElementById('btn-next');

  if (container) {
    container.querySelectorAll('.option-btn').forEach(function (btn, idx) {
      btn.classList.toggle('selected', idx === optionIndex);
    });
  }

  if (nextBtn) nextBtn.disabled = false;
}

function nextQuestion() {
  if (answers[currentQuestionIndex] === null) return;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQuestionIndex === 0) return;
  currentQuestionIndex--;
  renderQuestion();
}

function showResults() {
  var finalScore = answers.reduce(function (sum, v) { return sum + (v || 0); }, 0);

  var band;
  if (finalScore <= 4)       band = 1;
  else if (finalScore <= 9)  band = 2;
  else if (finalScore <= 13) band = 3;
  else if (finalScore <= 16) band = 4;
  else                       band = 5;

  window.location.href = 'index.html?tier=' + band + '#assessment';
}
