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

const missionSteps = [
  {
    title: "¿Qué elemento estás observando?",
    options: ["Un patio ceremonial", "Un edificio moderno", "Una carretera"],
    answer: 0,
    note: "Correcto. Los patios ayudaban a organizar reuniones, rituales y actividades comunitarias."
  },
  {
    title: "¿Qué nos dice la pirámide?",
    options: ["Que se construyó en un solo año", "Que fue ampliada por distintas generaciones", "Que siempre estuvo cubierta de pasto"],
    answer: 1,
    note: "Exacto. Sus capas muestran que varias generaciones construyeron sobre el mismo espacio."
  },
  {
    title: "¿Cuál es la mejor forma de cuidar el sitio?",
    options: ["Tocar los muros para sentir su antigüedad", "Caminar fuera de las rutas", "Seguir las indicaciones y no dejar basura"],
    answer: 2,
    note: "¡Muy bien! Cuidar las rutas, los muros y el entorno protege la historia para futuras visitas."
  }
];
let missionIndex = 0;
const missionStep = document.querySelector("#missionStep");
const missionTitle = document.querySelector("#missionTitle");
const missionOptions = document.querySelector("#missionOptions");
const missionFeedback = document.querySelector("#missionFeedback");
const missionNext = document.querySelector("#missionNext");

function renderMission() {
  const item = missionSteps[missionIndex];
  missionStep.textContent = `Paso ${missionIndex + 1} de ${missionSteps.length} · Elige una pista`;
  missionTitle.textContent = item.title;
  missionFeedback.textContent = "";
  missionNext.classList.add("hidden");
  missionOptions.innerHTML = "";
  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => answerMission(index));
    missionOptions.append(button);
  });
}
function answerMission(selected) {
  const item = missionSteps[missionIndex];
  const buttons = [...missionOptions.children];
  buttons.forEach((button) => { button.disabled = true; });
  buttons[item.answer].classList.add("correct");
  if (selected !== item.answer) buttons[selected].classList.add("wrong");
  missionFeedback.textContent = selected === item.answer ? item.note : `Observa de nuevo la imagen. ${item.note}`;
  missionNext.textContent = missionIndex === missionSteps.length - 1 ? "Repetir misión ↻" : "Siguiente pista →";
  missionNext.classList.remove("hidden");
}
missionNext.addEventListener("click", () => {
  missionIndex = missionIndex === missionSteps.length - 1 ? 0 : missionIndex + 1;
  renderMission();
});

goTo(0);
renderMission();
