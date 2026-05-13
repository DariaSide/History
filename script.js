const viewport = document.querySelector(".carousel-viewport");
const track = document.querySelector(".carousel-track");
const cards = Array.from(document.querySelectorAll(".achievement-card"));
const prevButton = document.querySelector(".carousel-btn-prev");
const nextButton = document.querySelector(".carousel-btn-next");
const dotsWrap = document.querySelector(".carousel-dots");

let activeIndex = 0;
let visibleCards = getVisibleCards();
let maxIndex = getMaxIndex();
let autoTimer;

function getVisibleCards() {
  if (window.matchMedia("(max-width: 720px)").matches) {
    return 1;
  }

  if (window.matchMedia("(max-width: 980px)").matches) {
    return 2;
  }

  return 3;
}

function getMaxIndex() {
  return Math.max(0, cards.length - visibleCards);
}

function getCardStep() {
  const firstCard = cards[0];
  const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || "0");
  return firstCard.getBoundingClientRect().width + gap;
}

function createDots() {
  dotsWrap.innerHTML = "";

  for (let i = 0; i <= maxIndex; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать группу достижений ${i + 1}`);
    dot.addEventListener("click", () => {
      setSlide(i);
      restartAuto();
    });
    dotsWrap.append(dot);
  }
}

function updateDots() {
  Array.from(dotsWrap.children).forEach((dot, index) => {
    dot.setAttribute("aria-current", String(index === activeIndex));
  });
}

function setSlide(index) {
  visibleCards = getVisibleCards();
  maxIndex = getMaxIndex();
  activeIndex = Math.min(Math.max(index, 0), maxIndex);

  if (window.matchMedia("(max-width: 720px)").matches) {
    track.style.transform = "none";
  } else {
    track.style.transform = `translateX(${-activeIndex * getCardStep()}px)`;
  }

  updateDots();
}

function nextSlide() {
  setSlide(activeIndex >= maxIndex ? 0 : activeIndex + 1);
}

function prevSlide() {
  setSlide(activeIndex <= 0 ? maxIndex : activeIndex - 1);
}

function startAuto() {
  stopAuto();

  if (
    window.matchMedia("(max-width: 720px)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  autoTimer = window.setInterval(nextSlide, 4600);
}

function stopAuto() {
  window.clearInterval(autoTimer);
}

function restartAuto() {
  stopAuto();
  startAuto();
}

prevButton.addEventListener("click", () => {
  prevSlide();
  restartAuto();
});

nextButton.addEventListener("click", () => {
  nextSlide();
  restartAuto();
});

viewport.addEventListener("mouseenter", stopAuto);
viewport.addEventListener("mouseleave", startAuto);

viewport.addEventListener("scroll", () => {
  if (!window.matchMedia("(max-width: 720px)").matches) {
    return;
  }

  const step = getCardStep();
  activeIndex = Math.round(viewport.scrollLeft / step);
});

window.addEventListener("resize", () => {
  const nextVisible = getVisibleCards();

  if (nextVisible !== visibleCards) {
    visibleCards = nextVisible;
    maxIndex = getMaxIndex();
    createDots();
  }

  setSlide(activeIndex);
  restartAuto();
});

createDots();
setSlide(0);

startAuto();
