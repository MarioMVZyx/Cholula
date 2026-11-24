const slides = [...document.querySelectorAll(".slide")];
const dots = document.querySelector("#dots");
const counter = document.querySelector("#counter");
const progressBar = document.querySelector("#progressBar");
let current = 0;
let programmaticNavigation = false;
let navigationTimer;

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir a la diapositiva ${index + 1}`);
  dot.addEventListener("click", () => goTo(index));
  dots.append(dot);
});

function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  programmaticNavigation = true;
  window.clearTimeout(navigationTimer);
  slides[current].scrollIntoView({ behavior: "smooth", block: "start" });
  updateProgress();
  navigationTimer = window.setTimeout(() => { programmaticNavigation = false; }, 1600);
}

function updateProgress() {
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
  if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select, video, [contenteditable='true']")) return;
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
  if (programmaticNavigation) return;
  const visibleSlide = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visibleSlide) return;
  current = Number(visibleSlide.target.dataset.slide);
  updateProgress();
}, { threshold: 0.58 });
slides.forEach((slide) => observer.observe(slide));

const missionStages = [
  {
    type: "REGISTRO FOTOGRÁFICO",
    image: "assets/escalera-piramide.jpg",
    alt: "Escalinata y niveles de la pirámide de Cholula",
    caption: "Observa la escalinata y las plataformas: ¿qué te dicen sobre la construcción?",
    title: "¿Qué revela la forma escalonada?",
    prompt: "Elige la interpretación que mejor coincide con la evidencia.",
    options: [
      { text: "La pirámide tuvo distintas etapas de construcción.", correct: true, feedback: "Exacto. Las ampliaciones sucesivas formaron el gran basamento que vemos hoy." },
      { text: "Toda la estructura se hizo en una sola etapa.", correct: false, feedback: "La imagen muestra una estructura compleja; la pirámide se amplió en distintas etapas." },
      { text: "La forma actual es solo una montaña natural.", correct: false, feedback: "El nombre alude a un cerro, pero el basamento es una obra construida y ampliada por personas." }
    ]
  },
  {
    type: "DETALLE ARQUEOLÓGICO",
    image: "assets/arqueologia-cabeza-serpiente.jpg",
    alt: "Piezas de piedra tallada dentro de la zona arqueológica",
    caption: "La fotografía registra piezas talladas resguardadas dentro del sitio.",
    title: "¿Qué podemos afirmar con seguridad?",
    prompt: "Practica observar antes de interpretar: elige una conclusión responsable.",
    options: [
      { text: "Son piezas de piedra tallada; la foto sola no confirma su nombre ni significado.", correct: true, feedback: "Muy bien. Describir lo visible y reconocer lo que falta verificar evita inventar una historia." },
      { text: "La pieza representa con certeza a una deidad específica.", correct: false, feedback: "No podemos confirmar la identidad solo con esta fotografía; hace falta una fuente arqueológica." },
      { text: "Es una escultura moderna sin relación con el sitio.", correct: false, feedback: "La imagen la muestra dentro del conjunto arqueológico. Evitemos afirmar algo que la evidencia no respalda." }
    ]
  },
  {
    type: "EXPERIENCIA SONORA · VIDEO PROPIO",
    video: true,
    caption: "En el video, una palmada produce una respuesta sonora que recuerda al graznido de un pato.",
    title: "¿Cuál es la conclusión más cuidadosa?",
    prompt: "Mira y escucha la grabación antes de responder.",
    options: [
      { text: "El efecto se escucha; para explicar su causa exacta necesitamos investigar más.", correct: true, feedback: "¡Expediente completo! Registraste el efecto sin confundir una observación con una explicación ya comprobada." },
      { text: "El sonido demuestra que el sitio fue construido para imitar patos.", correct: false, feedback: "El video muestra un efecto sonoro, pero no demuestra la intención histórica ni el diseño acústico." },
      { text: "La grabación prueba que hay un pato escondido.", correct: false, feedback: "En el video no vemos un pato: oímos una respuesta acústica parecida a su graznido." }
    ]
  }
];
let missionIndex = 0;
let evidenceScore = 0;
let answered = false;

const missionCount = document.querySelector("#missionCount");
const missionTitle = document.querySelector("#missionTitle");
const missionPrompt = document.querySelector("#missionPrompt");
const missionStep = document.querySelector("#missionStep");
const answerOptions = document.querySelector("#answerOptions");
const missionFeedback = document.querySelector("#missionFeedback");
const missionReset = document.querySelector("#missionReset");
const missionNext = document.querySelector("#missionNext");
const missionPoints = document.querySelector("#missionPoints");
const missionProgressText = document.querySelector("#missionProgressText");
const evidenceType = document.querySelector("#evidenceType");
const evidenceImage = document.querySelector("#evidenceImage");
const evidenceVideo = document.querySelector("#evidenceVideo");
const viewerCaption = document.querySelector("#viewerCaption");
const scanLabel = document.querySelector("#scanLabel");
const scanTarget = document.querySelector(".scan-target");

function renderMission() {
  const stage = missionStages[missionIndex];
  answered = false;
  missionCount.textContent = `EVIDENCIA ${String(missionIndex + 1).padStart(2, "0")} / 03`;
  missionPoints.textContent = `ARCHIVO ${evidenceScore} / 3`;
  missionProgressText.textContent = `${missionIndex} de 3 evidencias analizadas`;
  missionStep.textContent = `RETO 0${missionIndex + 1} · ${missionIndex === 2 ? "ESCUCHA" : "OBSERVA"}`;
  missionTitle.textContent = stage.title;
  missionPrompt.textContent = stage.prompt;
  evidenceType.textContent = stage.type;
  viewerCaption.textContent = stage.caption;
  missionFeedback.textContent = "";
  missionNext.classList.add("hidden");
  evidenceVideo.pause();
  evidenceVideo.currentTime = 0;
  evidenceVideo.hidden = !stage.video;
  evidenceImage.hidden = Boolean(stage.video);
  scanTarget.hidden = Boolean(stage.video);
  scanLabel.hidden = Boolean(stage.video);
  if (!stage.video) {
    evidenceImage.src = stage.image;
    evidenceImage.alt = stage.alt;
    scanLabel.textContent = missionIndex === 0 ? "NIVELES CONSTRUCTIVOS DETECTADOS" : "PIEZAS TALLADAS DETECTADAS";
  }
  answerOptions.innerHTML = "";
  stage.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>${option.text}`;
    button.addEventListener("click", () => answerMission(option, button));
    answerOptions.append(button);
  });
}

function answerMission(option, selectedButton) {
  if (answered) return;
  if (option.correct) {
    answered = true;
    evidenceScore += 1;
    selectedButton.classList.add("correct");
    missionFeedback.textContent = option.feedback;
    missionPoints.textContent = `ARCHIVO ${evidenceScore} / 3`;
    missionProgressText.textContent = `${missionIndex + 1} de 3 evidencias analizadas`;
    missionNext.textContent = missionIndex === missionStages.length - 1 ? "Revisar expediente ↻" : "Siguiente evidencia →";
    missionNext.classList.remove("hidden");
    answerOptions.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  } else {
    selectedButton.classList.add("incorrect");
    missionFeedback.textContent = `${option.feedback} Prueba otra respuesta.`;
    window.setTimeout(() => selectedButton.classList.remove("incorrect"), 700);
  }
}

missionNext.addEventListener("click", () => {
  if (missionIndex === missionStages.length - 1) {
    missionIndex = 0;
    evidenceScore = 0;
  } else {
    missionIndex += 1;
  }
  renderMission();
});
missionReset.addEventListener("click", () => {
  missionIndex = 0;
  evidenceScore = 0;
  renderMission();
});

goTo(0);
renderMission();
