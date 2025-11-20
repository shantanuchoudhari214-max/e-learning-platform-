// ---------------- STUDY MATERIAL ----------------
const studyMaterial = [
    "<strong>HTML:</strong> Structures the webpage using elements.",
    "<strong>CSS:</strong> Styles the website—colors, layout, fonts.",
    "<strong>JavaScript:</strong> Adds interactivity, logic, and dynamic updates.",
];

// ---------------- QUIZ QUESTIONS ----------------
const questions = [
    {
        type: "TrueFalse",
        question: "HTML is used for structuring web content.",
        answer: true
    },
    {
        type: "MultipleChoice",
        question: "Which language controls webpage styling?",
        answers: [
            { text: "HTML", correct: false },
            { text: "CSS", correct: true },
            { text: "JavaScript", correct: false },
        ]
    },
    {
        type: "FillInBlank",
        question: "The programming language used for interactivity on websites is ____.",
        correctAnswer: "javascript"
    },
    {
        type: "MatchThePair",
        question: "Match the technology with its purpose:",
        pairs: [
            { a: "HTML", correctB: "Structure" },
            { a: "CSS", correctB: "Design" },
            { a: "JavaScript", correctB: "Interactivity" }
        ]
    }
];

// ---------------- DOM ELEMENTS ----------------
const views = {
    study: document.getElementById("study-view"),
    quiz: document.getElementById("quiz-view"),
    results: document.getElementById("results-view")
};
const navBtns = document.querySelectorAll(".nav-btn");
const studyContent = document.getElementById("study-content");
const questionText = document.getElementById("question-text");
const dynamicContent = document.getElementById("dynamic-content");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("results-summary");

let index = 0, score = 0;

// ---------------- VIEW CONTROL ----------------
function showView(name) {
    Object.values(views).forEach(v => v.classList.add("hidden"));
    navBtns.forEach(btn => btn.classList.remove("active"));
    views[name].classList.remove("hidden");
    document.getElementById(`nav-${name}`).classList.add("active");

    if (name === "study") renderStudy();
    if (name === "results") renderResults();
}
document.addEventListener("DOMContentLoaded", () => showView("study"));

// ---------------- STUDY PAGE ----------------
function renderStudy() {
    studyContent.innerHTML = studyMaterial
        .map(m => `<div class="material-point">${m}</div>`)
        .join("");
}

// ---------------- QUIZ FLOW ----------------
function startQuiz() {
    index = 0;
    score = 0;
    showView("quiz");
    showQuestion();
}

function showQuestion() {
    dynamicContent.innerHTML = "";
    submitBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");

    if (index >= questions.length) {
        showView("results");
        return;
    }

    const q = questions[index];
    questionText.innerHTML = q.question;

    if (q.type === "MultipleChoice" || q.type === "TrueFalse") renderMCQ(q);
    if (q.type === "FillInBlank") renderFill(q);
    if (q.type === "MatchThePair") renderMatch(q);
}

function renderMCQ(q) {
    const grid = document.createElement("div");
    grid.classList.add("btn-grid");

    q.answers = q.answers || [
        { text: "True", correct: q.answer === true },
        { text: "False", correct: q.answer === false }
    ];

    q.answers.forEach(ans => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.innerHTML = ans.text;

        btn.addEventListener("click", () => {
            if (ans.correct) score++;
            disableButtons(grid, ans.correct, btn);
            nextBtn.classList.remove("hidden");
        });

        grid.appendChild(btn);
    });

    dynamicContent.appendChild(grid);
}

function disableButtons(grid, correct, selectedBtn) {
    [...grid.children].forEach(btn => {
        if (btn === selectedBtn && !correct) btn.classList.add("incorrect");
        if (btn.innerHTML === selectedBtn.innerHTML && correct) btn.classList.add("correct");
        btn.disabled = true;
    });
}

function renderFill(q) {
    const input = document.createElement("input");
    input.placeholder = "Enter answer...";
    input.style.padding = "10px";
    dynamicContent.appendChild(input);

    submitBtn.classList.remove("hidden");

    submitBtn.onclick = () => {
        if (input.value.trim().toLowerCase() === q.correctAnswer.toLowerCase()) {
            score++;
            input.style.background = "#c8ffc8";
        } else {
            input.style.background = "#ffc8c8";
        }
        input.disabled = true;
        submitBtn.classList.add("hidden");
        nextBtn.classList.remove("hidden");
    };
}

function renderMatch(q) {
    const container = document.createElement("div");
    container.innerHTML = "<p>Match the left items with the correct right items:</p>";

    q.pairs.forEach(p => {
        const row = document.createElement("div");
        row.style.margin = "10px 0";

        row.innerHTML = `
            <strong>${p.a}</strong> → 
            <select>
                <option>Select</option>
                <option>Structure</option>
                <option>Design</option>
                <option>Interactivity</option>
            </select>
        `;

        container.appendChild(row);
    });

    dynamicContent.appendChild(container);
    submitBtn.classList.remove("hidden");

    submitBtn.onclick = () => {
        let correct = 0;
        const selects = container.querySelectorAll("select");

        q.pairs.forEach((pair, i) => {
            if (selects[i].value === pair.correctB) correct++;
        });

        if (correct === q.pairs.length) score++;

        nextBtn.classList.remove("hidden");
        submitBtn.classList.add("hidden");
        selects.forEach(s => (s.disabled = true));
    };
}

nextBtn.onclick = () => {
    index++;
    showQuestion();
};

// ---------------- RESULTS ----------------
function renderResults() {
    const total = questions.length;
    const percent = ((score / total) * 100).toFixed(0);

    resultBox.innerHTML = `
        <div class="final-score">${score}/${total}</div>
        <p><strong>Percentage:</strong> ${percent}%</p>
        <p>${percent >= 75 ? "Great job! 🎉" : "Keep practicing! 💪"}</p>
    `;
}

document.getElementById("retake-btn").onclick = startQuiz;

// NAVIGATION
navBtns.forEach(btn =>
    btn.addEventListener("click", () => {
        const view = btn.id.split("-")[1];
        if (view === "quiz") startQuiz();
        else showView(view);
    })
);
