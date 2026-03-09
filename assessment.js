// ==========================================
// CLASP - FSCA Assessment Logic
// ==========================================

const questions = [
  {
    question: "1. Governing Body Oversight",
    options: [
      { text: "Approved and reviewed annually", score: 10 },
      { text: "Approved but reviewed less than annually", score: 5 },
      { text: "Informally discussed, not formally approved", score: 2 },
      { text: "No formal involvement", score: 0 }
    ]
  },
  {
    question: "2. Multi-Factor Authentication (MFA)",
    options: [
      { text: "Fully implemented on all privileged accounts and internet-facing systems", score: 10 },
      { text: "Partially implemented", score: 5 },
      { text: "Not implemented", score: 0 }
    ]
  },
  {
    question: "3. Critical Patch Turnaround Time",
    options: [
      { text: "1–7 days", score: 10 },
      { text: "8–14 days", score: 7 },
      { text: "15–30 days", score: 2 }, 
      { text: "31+ days", score: 0 }
    ]
  },
  {
    question: "4. Incident Response Plan",
    options: [
      { text: "Documented, tested, updated at least annually", score: 10 },
      { text: "Documented but not regularly tested", score: 5 },
      { text: "Informal process, nothing written", score: 2 },
      { text: "No plan in place", score: 0 }
    ]
  },
  {
    question: "5. IT Asset Inventory",
    options: [
      { text: "Complete inventory maintained and reviewed regularly", score: 10 },
      { text: "Inventory exists but not kept current", score: 5 },
      { text: "No formal inventory", score: 0 }
    ]
  },
  {
    question: "6. Penetration Testing",
    options: [
      { text: "At least annually by a qualified tester", score: 10 },
      { text: "Conducted but less than annually", score: 5 },
      { text: "Vulnerability scans only, no full pen test", score: 2 },
      { text: "No testing at all", score: 0 }
    ]
  },
  {
    question: "7. Cybersecurity Awareness Training",
    options: [
      { text: "Annual training for all relevant users including contractors", score: 10 },
      { text: "Some staff trained, not all", score: 5 },
      { text: "No formal training programme", score: 0 }
    ]
  },
  {
    question: "8. Backup & Recovery with RTO/RPO",
    options: [
      { text: "Documented with defined RTO/RPO targets, tested annually", score: 10 },
      { text: "Backups exist but no formal RTO/RPO or testing", score: 5 },
      { text: "No formal backup/recovery process", score: 0 }
    ]
  },
  {
    question: "9. Threat Intelligence",
    options: [
      { text: "Active process plus participation in sharing arrangements", score: 10 },
      { text: "Regular monitoring of threat feeds or advisor briefings", score: 4 }, 
      { text: "Ad hoc — only reviewed after an incident", score: 2 },
      { text: "No formal process", score: 0 }
    ]
  },
  {
    question: "10. Regulatory Notification Process",
    options: [
      { text: "Documented process, staff are aware of it", score: 10 },
      { text: "Would notify but process is not formalised", score: 4 },
      { text: "No formal notification process", score: 0 }
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

  // Build the question HTML
  let html = `<h2 class="question-text">${q.question}</h2>`;
  html += `<div class="options-grid">`;

  q.options.forEach((opt, index) => {
    html += `<button class="option-btn${answers[currentQuestionIndex] === opt.score ? ' selected' : ''}" onclick="selectAnswer(${opt.score}, ${index})">${opt.text}</button>`;
  });

  html += `</div>`;
  container.innerHTML = html;

  // After re-render, reapply selected state if any
  if (answers[currentQuestionIndex] !== null) {
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
      const opt = q.options[i];
      if (opt && opt.score === answers[currentQuestionIndex]) {
        btn.classList.add('selected');
      }
    });
  }

  // Enable/disable Next button based on whether an answer is selected
  if (nextBtn) {
    nextBtn.disabled = answers[currentQuestionIndex] === null;
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
  }

  updateNavButtons();
}

function selectAnswer(score, index) {
  answers[currentQuestionIndex] = score;

  const container = document.getElementById("question-container");
  const buttons = container ? container.querySelectorAll('.option-btn') : [];

  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  const nextBtn = document.getElementById("btn-next");
  if (nextBtn) nextBtn.disabled = false;
}

function updateNavButtons() {
  const prevBtn = document.getElementById("btn-prev");
  if (prevBtn) {
    prevBtn.disabled = currentQuestionIndex === 0;
  }
}

function nextQuestion() {
  // Don't advance if nothing is selected
  if (answers[currentQuestionIndex] === null) return;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    // Smooth scroll back to top of card for next question
    const card = document.querySelector('.quiz-card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    renderQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (currentQuestionIndex === 0) return;
  currentQuestionIndex--;
  const card = document.querySelector('.quiz-card');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  renderQuestion();
}

function calculateTotalScore() {
  return answers.reduce((sum, value) => sum + (value || 0), 0);
}

function showResults() {
  // Calculate final score from all stored answers
  const finalScore = calculateTotalScore();

  // Hide Quiz UI, Show Results UI
  document.getElementById("question-container").classList.add("hidden");
  document.getElementById("progress-container").classList.add("hidden");
  document.getElementById("quiz-header").classList.add("hidden");
  document.getElementById("question-counter").classList.add("hidden");
  document.getElementById("quiz-navigation").classList.add("hidden");
  
  const resultContainer = document.getElementById("result-container");
  resultContainer.classList.remove("hidden");

  // Get the new Number Line elements
  const marker = document.getElementById("user-score-marker");
  const tooltip = document.getElementById("user-score-tooltip");
  const titleDisplay = document.getElementById("result-title");
  const descDisplay = document.getElementById("result-desc");

  // Animate the marker moving to the correct position (delay slightly for visual effect)
  setTimeout(() => {
    marker.style.left = `${finalScore}%`;
    tooltip.innerText = finalScore;
  }, 100);

  // Apply text, titles, and marker colors based on the 4-tier Result Bands
  if (finalScore >= 85) { 
    marker.style.borderColor = "#10B981"; // Green
    titleDisplay.innerText = "Rating: Strong";
    descDisplay.innerText = "Excellent. You have a robust IT governance and cybersecurity posture aligned with the FSCA Joint Standards. Engage our VISO team to maintain this baseline and streamline your regulatory reporting.";
  } else if (finalScore >= 65) { 
    marker.style.borderColor = "#3B82F6"; // Blue
    titleDisplay.innerText = "Rating: Developing";
    descDisplay.innerText = "You are making good progress, but there are specific gaps in your framework that require formalization to fully meet Joint Standards requirements. An IT Security Risk Assessment is recommended to close these gaps.";
  } else if (finalScore >= 40) { 
    marker.style.borderColor = "#F59E0B"; // Amber
    titleDisplay.innerText = "Rating: Emerging";
    descDisplay.innerText = "You have critical gaps in your security stack and oversight processes that expose you to regulatory risk. Immediate remediation planning and technology upgrades are strongly recommended.";
  } else { 
    marker.style.borderColor = "#EF4444"; // Red
    titleDisplay.innerText = "Rating: At Risk";
    descDisplay.innerText = "Your current infrastructure does not meet the basic mandates of the FSCA Joint Standards. Urgent remediation, formalized documentation, and technology implementation are required.";
  }
}