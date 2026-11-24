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
}, { threshold: 0.58 });
slides.forEach((slide) => observer.observe(slide));

const missionStages = [
  {
    title: "Reconoce las evidencias",
    hint: "Forma el recorrido colocando cada elemento en el orden en que se aprende.",
    cards: [
      { id: "lugar", code: "A", name: "Zona arqueológica" },
      { id: "historia", code: "B", name: "Construcción por etapas" },
      { id: "proteccion", code: "C", name: "Acciones de conservación" }
    ],
    answer: ["lugar", "historia", "proteccion"]
  },
  {
    title: "Explica qué observaste",
    hint: "Ordena los resultados de la visita: espacio, detalle y experiencia.",
    cards: [
      { id: "detalle", code: "A", name: "Cabeza tallada" },
      { id: "espacio", code: "B", name: "Patios y estructuras" },
      { id: "sonido", code: "C", name: "Palmadas y resonancia" }
    ],
    answer: ["espacio", "detalle", "sonido"]
  },
  {
    title: "Defiende el patrimonio",
    hint: "Selecciona primero la acción responsable y luego las consecuencias.",
    cards: [
      { id: "consecuencia", code: "A", name: "Protege para futuras visitas" },
      { id: "accion", code: "B", name: "Respetar rutas y indicaciones" },
      { id: "comprension", code: "C", name: "Conocer antes de opinar" }
    ],
    answer: ["comprension", "accion", "consecuencia"]
  }
];
let missionIndex = 0;
let selected = [];

const missionCount = document.querySelector("#missionCount");
const missionTitle = document.querySelector("#missionTitle");
const missionHint = document.querySelector("#missionHint");
const missionSteps = document.querySelector("#missionSteps");
const cardBank = document.querySelector("#cardBank");
const dropZone = document.querySelector("#dropZone");
const missionFeedback = document.querySelector("#missionFeedback");
const missionReset = document.querySelector("#missionReset");

function renderMission() {
  const stage = missionStages[missionIndex];
  selected = [];
  missionCount.textContent = `SECUENCIA ${String(missionIndex + 1).padStart(2, "0")} / 03`;
  missionTitle.textContent = stage.title;
  missionHint.textContent = stage.hint;
  missionFeedback.textContent = "";
  dropZone.innerHTML = "<span>Arrastra aquí una tarjeta</span>";
  [...missionSteps.children].forEach((step, index) => {
    step.className = index === missionIndex ? "active" : index < missionIndex ? "done" : "";
  });
  cardBank.innerHTML = "";
  stage.cards.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.draggable = true;
    button.dataset.id = card.id;
    button.innerHTML = `<span>${card.code} / TARJETA</span>${card.name}`;
    button.addEventListener("click", () => addCard(card.id));
    button.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", card.id));
    cardBank.append(button);
  });
}

function addCard(id) {
  if (selected.includes(id)) return;
  selected.push(id);
  const stage = missionStages[missionIndex];
  const card = stage.cards.find((item) => item.id === id);
  const bankCard = cardBank.querySelector(`[data-id="${id}"]`);
  if (bankCard) bankCard.classList.add("used");
  if (dropZone.querySelector(":scope > span")) dropZone.innerHTML = "";
  const selectedCard = document.createElement("button");
  selectedCard.type = "button";
  selectedCard.dataset.id = id;
  selectedCard.textContent = card.name;
  selectedCard.addEventListener("click", () => removeCard(id));
  dropZone.append(selectedCard);
  if (selected.length === stage.answer.length) validateMission();
}

function removeCard(id) {
  selected = selected.filter((item) => item !== id);
  const zoneCard = dropZone.querySelector(`[data-id="${id}"]`);
  if (zoneCard) zoneCard.remove();
  const bankCard = cardBank.querySelector(`[data-id="${id}"]`);
  if (bankCard) bankCard.classList.remove("used");
  if (!selected.length) dropZone.innerHTML = "<span>Arrastra aquí una tarjeta</span>";
  missionFeedback.textContent = "";
}

function validateMission() {
  const stage = missionStages[missionIndex];
  const correct = stage.answer.every((id, index) => selected[index] === id);
  if (!correct) {
    missionFeedback.textContent = "Secuencia incompleta. Cambia el orden tocando las tarjetas seleccionadas.";
    selected.forEach((id) => {
      const bankCard = cardBank.querySelector(`[data-id="${id}"]`);
      if (bankCard) bankCard.classList.remove("used");
    });
    [...dropZone.querySelectorAll("button")].forEach((button) => button.remove());
    selected = [];
    return;
  }
  missionFeedback.textContent = missionIndex === missionStages.length - 1
    ? "Misión completa: observaste, explicaste y defendiste el patrimonio."
    : "Secuencia correcta. Avanza a la siguiente misión.";
  if (missionIndex < missionStages.length - 1) {
    window.setTimeout(() => {
      missionIndex += 1;
      renderMission();
    }, 1150);
  } else {
    missionSteps.querySelectorAll("i").forEach((step) => step.className = "done");
  }
}

dropZone.addEventListener("dragover", (event) => event.preventDefault());
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  addCard(event.dataTransfer.getData("text/plain"));
});
missionReset.addEventListener("click", () => {
  missionIndex = 0;
  renderMission();
});

document.querySelectorAll(".chat-options button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#chatAnswer").textContent = button.dataset.answer;
  });
});

goTo(0);
renderMission();
