const slides = [...document.querySelectorAll(".slide")];
const dots = document.querySelector("#dots");
const counter = document.querySelector("#counter");
const progressBar = document.querySelector("#progressBar");
let current = 0;

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir a la diapositiva ${index + 1}`);
  dot.addEventListener("click", () => goTo(index));
  dots.append(dot);
});

function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelectorAll(".dots button").forEach((dot, i) => dot.classList.toggle("active", i === current));
  counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
}

document.querySelector("#prev").addEventListener("click", () => goTo(current - 1));
document.querySelector("#next").addEventListener("click", () => goTo(current + 1));
document.querySelector("[data-next]").addEventListener("click", () => goTo(1));
document.querySelector("[data-restart]").addEventListener("click", () => goTo(0));
document.querySelector("#fullscreen").addEventListener("click", async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    goTo(current + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goTo(current - 1);
  }
  if (event.key.toLowerCase() === "f") document.querySelector("#fullscreen").click();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) goTo(Number(entry.target.dataset.slide));
  });
}, { threshold: 0.6 });
slides.forEach((slide) => observer.observe(slide));

const questions = [
  { text: "¿Cuál es el nombre náhuatl de la Gran Pirámide de Cholula?", options: ["Teotihuacan", "Tlachihualtépetl", "Tenochtitlan", "Xochicalco"], answer: 1, note: "Tlachihualtépetl significa “cerro hecho a mano”." },
  { text: "¿Qué edificio está en la cima de la pirámide?", options: ["La Catedral de Puebla", "El Templo de Santo Domingo", "El Santuario de Nuestra Señora de los Remedios", "La Capilla Real"], answer: 2, note: "El santuario fue construido en el siglo XVI." },
  { text: "¿Por qué es famosa la pirámide a nivel mundial?", options: ["Por ser la más alta", "Por tener la mayor base", "Por ser la más reciente", "Por estar hecha de oro"], answer: 1, note: "Su base mide aproximadamente 400 metros por lado." }
];
let questionIndex = 0;
let score = 0;
const question = document.querySelector("#question");
const answers = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const nextQuestion = document.querySelector("#nextQuestion");
const questionCount = document.querySelector("#questionCount");
const scoreLabel = document.querySelector("#score");

function renderQuestion() {
  const item = questions[questionIndex];
  question.textContent = item.text;
  questionCount.textContent = `Pregunta ${questionIndex + 1} de ${questions.length}`;
  scoreLabel.textContent = `${score} ${score === 1 ? "acierto" : "aciertos"}`;
  feedback.textContent = "";
  nextQuestion.classList.add("hidden");
  answers.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => answerQuestion(index));
    answers.append(button);
  });
}
function answerQuestion(selected) {
  const item = questions[questionIndex];
  const buttons = [...answers.children];
  buttons.forEach((button) => { button.disabled = true; });
  buttons[item.answer].classList.add("correct");
  if (selected === item.answer) {
    score += 1;
    feedback.textContent = `¡Muy bien! ${item.note}`;
  } else {
    buttons[selected].classList.add("wrong");
    feedback.textContent = `Casi. ${item.note}`;
  }
  scoreLabel.textContent = `${score} ${score === 1 ? "acierto" : "aciertos"}`;
  nextQuestion.textContent = questionIndex === questions.length - 1 ? "Repetir reto ↻" : "Siguiente pregunta →";
  nextQuestion.classList.remove("hidden");
}
nextQuestion.addEventListener("click", () => {
  if (questionIndex === questions.length - 1) { questionIndex = 0; score = 0; }
  else questionIndex += 1;
  renderQuestion();
});

goTo(0);
renderQuestion();
