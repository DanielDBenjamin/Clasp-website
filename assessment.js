// ==========================================
// CLASP - FSCA Assessment Logic
// ==========================================

const questions = [
  {
    title: "1. Governing body approval JS2 §6.2.1 / JS1 §5.2",
    question: "Has your board or governing body formally approved a cybersecurity framework or IT risk management framework?",
    options: [
      { text: "Yes, it's documented and board-signed", score: 2 },
      { text: "We have something but it hasn't been formally approved ", score: 1 },
      { text: "No, nothing formal exists ", score: 0 },
    ]
  },
  {
    title: "2. Asset inventory JS2 §7.1.1(d) / JS1 §7.3(e)",
    question: "Do you maintain an up-to-date inventory of your IT and information assets (devices, software, data, systems)?",
    options: [
      { text: "Yes, we have a maintained inventory with owners assigned ", score: 2 },
      { text: "We have a partial list but it's not actively maintained", score: 1 },
      { text: "No inventory exists ", score: 0 }
    ]
  },
  {
    title: "3. Incident response plan JS2 §7.5.1(a)",
    question: "Do you have a written cyber incident response and management plan that describes what to do when something goes wrong?",
    options: [
      { text: "Yes, it's documented, tested, and staff know their roles ", score: 2 },
      { text: "Something exists on paper but it hasn't been tested", score: 1 },
      { text: "No plan exists ", score: 0 }, 
    ]
  },
  {
    title: "4. MSP / third-party oversight JS2 §4.2.3 / JS1 §7.3(i)",
    question: "Is your IT provider or managed service provider (MSP) governed by a formal contract or SLA with defined security responsibilities?",
    options: [
      { text: "Yes, we have a formal SLA with security obligations and we review it", score: 2 },
      { text: "We have a contract but security responsibilities aren't clearly defined ", score: 1 },
      { text: "No formal agreement is in place ", score: 0 },
    ]
  },
  {
    title:  "5. Annual framework review JS2 §6.2.2 / JS1 §7.2",
    question: "Has your cybersecurity or IT risk framework been reviewed in the last 12 months?",
    options: [
      { text: "Yes, reviewed within the past year, findings documented ", score: 2 },
      { text: "A review is overdue or partially done", score: 1 },
      { text: "No review has ever taken place", score: 0 }
    ]
  },
  {
    title: "6. Independent testing of controls JS2 §7.7.1 / JS1 §14.1",
    question: "Have your security controls been independently reviewed, tested, or audited — either internally or by an external party?",
    options: [
      { text: "Yes, controls have been tested and results reported to the board ", score: 2 },
      { text: "Some controls have been looked at informally but nothing structured", score: 1 },
      { text: "Controls have never been independently tested ", score: 0 },
    ]
  },
  {
    title: "7. Multi-factor authentication JS2 §8.3",
    question: "Is multi-factor authentication (MFA) in place for remote access, privileged accounts, and systems containing sensitive information?",
    options: [
      { text: "Yes, MFA is enforced across all critical access points ", score: 2 },
      { text: "MFA is partially in place on some but not all systems", score: 1 },
      { text: "MFA is not implemented", score: 0 }
    ]
  },
  {
    title: "8. Staff cybersecurity training JS2 §7.2.7",
    question: "Have all staff (including the board) received cybersecurity awareness training in the past 12 months?",
    options: [
      { text: "Yes, formal training conducted and refreshed annually ", score: 2 },
      { text: "Ad hoc awareness exists but no structured programme", score: 1 },
      { text: "No cybersecurity training has been conducted", score: 0 }
    ]
  },
  {
    title: "9. Regulatory incident reporting JS2 §9.1 / JS1 §15.1",
    question: "Do you have a defined process to identify and report material cyber or IT incidents to your responsible authority (FSCA or PA)?",
    options: [
      { text: "Yes, we have a process, know the thresholds, and know how to notify ", score: 2 },
      { text: "We're aware of the obligation but the process isn't formally defined ", score: 1 }, 
      { text: "We are not aware of or do not have a reporting process ", score: 0 },
    ]
  },
  {
    title:  "10. Vulnerability and penetration testing JS2 §7.7.2 / JS2 §7.7.3",
    question: "Are vulnerability assessments or penetration tests carried out on your critical systems on a regular basis?",
    options: [
      { text: "Yes, scheduled assessments are conducted and findings tracked to remediation", score: 2 },
      { text: "We've had a test done before but it's not on a regular schedule", score: 1 },
      { text: "No vulnerability assessments or pen tests have been conducted ", score: 0 }
    ]
  }
];

let currentQuestionIndex = 0;
let answers = new Array(questions.length).fill(null);

document.addEventListener("DOMContentLoaded", () => {
  // Set total question count in UI
  const totalEl = document.getElementById("question-total");
  if (totalEl) totalEl.innerText = questions.length;

  renderQuestion();
});

function renderQuestion() {
  const container = document.getElementById("question-container");
  const progressBar = document.getElementById("progress-bar");
  const numberEl = document.getElementById("question-number");
  const nextBtn = document.getElementById("btn-next");

  if (!container || !progressBar) return;

  // Update question counter
  if (numberEl) numberEl.innerText = currentQuestionIndex + 1;

  // Update Progress Bar (based on current question index)
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progressPercentage}%`;

  const q = questions[currentQuestionIndex];

  // Build the question HTML (optional title + question)
  let html = '';
  if (q.title) {
    html += `<div class="question-title">${q.title}</div>`;
  }
  html += `<h2 class="question-text">${q.question}</h2>`;
  html += `<div class="options-grid">`;

  q.options.forEach((opt, index) => {
    const isSelected = answers[currentQuestionIndex] === opt.score;
    html += `<button class="option-btn${isSelected ? ' selected' : ''}" onclick="selectAnswer(${opt.score}, ${index})">${opt.text}</button>`;
  });

  html += `</div>`;

  container.innerHTML = html;

  // Update next button state and label
  if (nextBtn) {
    nextBtn.disabled = answers[currentQuestionIndex] === null;
    nextBtn.textContent =
      currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
  }
}

function calculateTotalScore() {
  return answers.reduce((sum, value) => sum + (value || 0), 0);
}

function selectAnswer(score, optionIndex) {
  // Store score for the current question
  answers[currentQuestionIndex] = score;

  const container = document.getElementById("question-container");
  const nextBtn = document.getElementById("btn-next");

  if (container) {
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.classList.toggle('selected', idx === optionIndex);
    });
  }

  if (nextBtn) {
    nextBtn.disabled = false;
  }
}

function nextQuestion() {
  // Don't move on if nothing selected (defensive; button is normally disabled)
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
  const finalScore = calculateTotalScore();

  // Map 0–20 score to positions 1–5
  let band;
  if (finalScore <= 4) {
    band = 1;
  } else if (finalScore <= 9) {
    band = 2;
  } else if (finalScore <= 13) {
    band = 3;
  } else if (finalScore <= 16) {
    band = 4;
  } else {
    band = 5;
  }

  // Redirect back to homepage assessment section with tier encoded
  window.location.href = `index.html?tier=${band}#assessment`;
}