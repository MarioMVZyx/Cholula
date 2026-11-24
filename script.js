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

const preservationCases = [
  {
    type: "VISITA",
    instruction: "PROTOCOLO 01 · PREVENIR",
    title: "Un visitante se acerca para tocar un muro antiguo.",
    description: "Elige una acción que cuide la estructura y mantenga la visita segura.",
    options: [
      { text: "Cruzar la cuerda para tocar la piedra.", correct: false, feedback: "Tocar o salir del sendero puede desgastar superficies y acercar al visitante a un área restringida." },
      { text: "Mantener la distancia y avisar al personal si hace falta.", correct: true, feedback: "Buena decisión. Respetar límites ayuda a prevenir daños accidentales y mantiene el recorrido seguro." },
      { text: "Marcar la piedra para recordar el lugar.", correct: false, feedback: "Las marcas alteran el patrimonio. Es mejor observar, fotografiar desde la zona permitida y pedir orientación." }
    ]
  },
  {
    type: "HALLAZGO",
    instruction: "PROTOCOLO 02 · DOCUMENTAR",
    title: "Encuentras un fragmento de piedra sin identificación.",
    description: "Es una situación hipotética. ¿Qué harías para no perder información ni dañar el objeto?",
    options: [
      { text: "Levantarlo y guardarlo como recuerdo.", correct: false, feedback: "Mover un objeto de su contexto puede dañarlo y hacer que se pierda información sobre dónde estaba." },
      { text: "Adivinar su antigüedad y publicarla como un hecho.", correct: false, feedback: "Sin análisis, la fecha y el uso serían especulaciones. No presentes una suposición como dato comprobado." },
      { text: "No moverlo; avisar al personal del sitio.", correct: true, feedback: "Correcto. Dejarlo en su lugar y avisar permite que personal capacitado evalúe el hallazgo." }
    ]
  },
  {
    type: "INTERPRETACIÓN",
    instruction: "PROTOCOLO 03 · DISTINGUIR",
    title: "Una palmada produce un sonido parecido a un pato.",
    description: "¿Qué puedes comunicar responsablemente a otras personas?",
    options: [
      { text: "El sonido se escucha; su causa exacta requiere investigarse.", correct: true, feedback: "¡Misión cumplida! Separaste lo que se observa de una explicación que aún necesita comprobarse." },
      { text: "El sitio fue construido para imitar el sonido de un pato.", correct: false, feedback: "La grabación no demuestra la intención de quienes construyeron el sitio." },
      { text: "Hay un pato oculto en la zona.", correct: false, feedback: "El sonido se parece a un graznido, pero eso no demuestra que haya un pato." }
    ]
  }
];

let caseIndex = 0;
let siteIntegrity = 100;
let caseResolved = false;
let gameFinished = false;

const caseCount = document.querySelector("#caseCount");
const siteScore = document.querySelector("#siteScore");
const caseType = document.querySelector("#caseType");
const caseIndexLabel = document.querySelector("#caseIndex");
const caseTitle = document.querySelector("#caseTitle");
const caseDescription = document.querySelector("#caseDescription");
const decisionOptions = document.querySelector("#decisionOptions");
const decisionFeedback = document.querySelector("#decisionFeedback");
const caseNext = document.querySelector("#caseNext");
const integrityBar = document.querySelector("#integrityBar");
const gameStatus = document.querySelector("#gameStatus");
const gameReset = document.querySelector("#gameReset");
const mapMarkers = [
  document.querySelector("#markerOne"),
  document.querySelector("#markerTwo"),
  document.querySelector("#markerThree")
];

function updateIntegrity() {
  siteScore.textContent = `INTEGRIDAD DEL SITIO · ${siteIntegrity}%`;
  integrityBar.style.width = `${siteIntegrity}%`;
  integrityBar.classList.toggle("warning", siteIntegrity <= 70);
}

function renderCase() {
  const activeCase = preservationCases[caseIndex];
  caseResolved = false;
  gameFinished = false;
  caseCount.textContent = `CASO ${String(caseIndex + 1).padStart(2, "0")} / 03`;
  caseType.textContent = activeCase.type;
  caseIndexLabel.textContent = activeCase.instruction;
  caseTitle.textContent = activeCase.title;
  caseDescription.textContent = activeCase.description;
  decisionFeedback.textContent = "";
  caseNext.classList.add("hidden");
  mapMarkers.forEach((marker, index) => {
    marker.classList.toggle("active", index === caseIndex);
    marker.classList.toggle("resolved", index < caseIndex);
  });
  decisionOptions.innerHTML = "";
  activeCase.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>${option.text}`;
    button.addEventListener("click", () => chooseAction(option, button));
    decisionOptions.append(button);
  });
  updateIntegrity();
}

function chooseAction(option, selectedButton) {
  if (caseResolved || gameFinished) return;
  if (!option.correct) {
    siteIntegrity = Math.max(40, siteIntegrity - 10);
    selectedButton.classList.add("incorrect");
    decisionFeedback.textContent = `${option.feedback} Reconsidera la decisión.`;
    updateIntegrity();
    window.setTimeout(() => selectedButton.classList.remove("incorrect"), 650);
    return;
  }

  caseResolved = true;
  selectedButton.classList.add("correct");
  decisionOptions.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  decisionFeedback.textContent = option.feedback;
  caseNext.textContent = caseIndex === preservationCases.length - 1 ? "Ver resultado ↗" : "Siguiente decisión →";
  caseNext.classList.remove("hidden");
  gameStatus.textContent = `${caseIndex + 1} de 3 decisiones resueltas`;
}

function showGameResult() {
  gameFinished = true;
  caseCount.textContent = "MISIÓN COMPLETADA";
  caseType.textContent = "RESULTADO";
  caseIndexLabel.textContent = "PROTOCOLO DE CONSERVACIÓN · CERRADO";
  caseTitle.textContent = siteIntegrity >= 80 ? "Buen criterio, guardián del patrimonio." : "Aprender también es parte de conservar.";
  caseDescription.textContent = `Terminaste con ${siteIntegrity}% de integridad en el simulador. Cada decisión responsable ayuda a proteger el sitio.`;
  decisionOptions.innerHTML = "";
  decisionFeedback.textContent = "Recuerda: observa, no muevas los hallazgos y consulta al personal capacitado.";
  mapMarkers.forEach((marker) => marker.classList.add("resolved"));
  gameStatus.textContent = "SIMULACIÓN COMPLETADA · VUELVE A JUGAR PARA MEJORAR TU RESULTADO";
  caseNext.textContent = "Jugar de nuevo ↻";
  caseNext.classList.remove("hidden");
}

function resetGame() {
  caseIndex = 0;
  siteIntegrity = 100;
  gameStatus.textContent = "3 decisiones · una misión de conservación";
  renderCase();
}

caseNext.addEventListener("click", () => {
  if (gameFinished) {
    resetGame();
  } else if (caseIndex === preservationCases.length - 1) {
    showGameResult();
  } else {
    caseIndex += 1;
    renderCase();
  }
});
gameReset.addEventListener("click", resetGame);

goTo(0);
renderCase();
