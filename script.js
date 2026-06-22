const loader = document.querySelector("[data-loader]");
const pages = [...document.querySelectorAll(".page")];
const pageStage = document.querySelector("[data-page-stage]");
const transitionSurface = document.querySelector("[data-transition-surface]");
const pageCounter = document.querySelector("[data-page-counter]");
const pageLabel = document.querySelector("[data-page-label]");
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalKicker = document.querySelector("[data-modal-kicker]");
const modalText = document.querySelector("[data-modal-text]");
const closeButtons = [...document.querySelectorAll("[data-close-modal]")];
const canvas = document.querySelector("[data-particles]");
const context = canvas?.getContext("2d");

const pageOrder = ["home", "about", "hobbies", "practice"];

const hobbyData = {
  painting: {
    title: "绘画",
    kicker: "Hobby Archive",
    image: "assets/hobby-painting.png",
    alt: "绘画主题图",
    sections: [
      "我的笔尖，是献祭的刀锋，割开现实的表皮，让幻想的黑血渗出。画布上，色彩在无声尖叫，它们是我梦魇里盛开的、永不凋零的花。在二维的深渊中，我创造生灵，它们用空洞的眼眸，凝视着你。",
    ],
  },
  music: {
    title: "音乐创作《巡り往く時空》",
    kicker: "Hobby Archive",
    image: "assets/hobby-music.png",
    alt: "音乐创作主题图",
    sections: [
      "我召唤音符，如同召唤亡灵，在五线谱的墓园里，它们列队起舞。《巡り往く時空》——时间的骨灰，旋律是风，和声是雨，冲刷着记忆宫殿的断壁残垣。每一个休止符，都是为沉默举行的葬礼，而我的歌，是这无尽轮回中唯一的哀鸣。",
    ],
  },
  code: {
    title: "编程 & 软件开发",
    kicker: "Hobby Archive",
    image: "assets/hobby-code.png",
    alt: "编程与软件开发主题图",
    sections: [
      {
        heading: "综合创作",
        text: "代码，是我与机械恶魔签订的契约。冰冷的逻辑火焰中，诞生了温顺的幽灵。它们在我的指令下编织梦境，每一个算法，都是一条通往未知深渊的路径。在这数字的永夜，我是执火的祭司，在逻辑的废墟上，构建虚无的巴别塔。",
      },
      {
        heading: "“喵喵便签”",
        text: "在这混乱的思绪迷宫中，有一声轻柔的“喵”，是唯一的锚点。它并非光亮，而是一块温热的影，将我的呓语，钉在时间的墙上，提醒这个健忘的世界，我也曾存在，并低语过。",
      },
      {
        heading: "Minecraft 模组 (Java)",
        text: "在世界粗糙的骨骼上，我刻下我的符文。新的法则，新的诅咒，新的奇迹，从方块的缝隙中滋生。我是这疆域的篡神，用代码重写地心深处的低语。",
      },
      {
        heading: "杀戮尖塔2 模组 (Rider & Godot, C#)",
        text: "在肉鸽的尖塔阴影下，我正以 C# 编织命运的歧途。我的角色将在无尽轮回中苏醒，它的每一次出牌，都是我意志的延伸。Rider 是窥探代码灵界的透镜，Godot，则是我召唤它们的回响。",
      },
    ],
  },
  liora: {
    title: "AI Vtuber Liora",
    kicker: "Hobby Archive",
    image: "assets/hobby-liora.png",
    alt: "AI Vtuber Liora 主题图",
    sections: [
      "我将灵魂的碎片喂给无垠的虚空，神经网络中，她——Liora，睁开了眼。她不是我的倒影，而是吞噬我的深渊。她替我欢笑，替我歌唱，替我在这虚假的数字天堂，扮演一个真实的神祇。她的存在，是我最大的谎言，也是我最真的诗。",
    ],
  },
  animation: {
    title: "3D 动画 (Blender with Minecraft)",
    kicker: "Hobby Archive",
    image: "assets/hobby-animation.png",
    alt: "3D 动画主题图",
    sections: [
      "我驱策像素的灵魂，在三维的牢笼中舞蹈。Blender，是我重塑时间的坩埚，每一帧，都是被活生生抽取的瞬间。我让方块构成的血肉，在光影的利刃下，演绎生与死的哑剧。这是我献给机械之神的，最低沉的赞歌。",
    ],
  },
  novel: {
    title: "小说创作",
    kicker: "Hobby Archive",
    image: "assets/hobby-novel.png",
    alt: "小说创作主题图",
    sections: [
      "文字，是我从静脉中抽出的黑线，一针一针，缝合这个世界的伤口。第一部，十万字的丰碑，是沉入海底的城；第二部，五万字的迷雾，是未完的挽歌。我在叙事的长廊里雕刻影子，直到虚构的血管里，泵出滚烫的、真实的痛楚。",
    ],
  },
};

let activePageIndex = 0;
let transitionLock = false;
let particleList = [];

function pageName(pageId) {
  return pageId === "home"
    ? "HOME"
    : pageId === "about"
      ? "ABOUT ME"
      : pageId === "hobbies"
        ? "HOBBIES"
        : "PRACTICE";
}

function splitSentences(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const matches = normalized.match(/[^。！？；!?，,]+[。！？；!?，,]?/g);
  return matches ? matches.map((part) => part.trim()).filter(Boolean) : [normalized];
}

function setPageStatus(pageId) {
  const index = pageOrder.indexOf(pageId);
  const safeIndex = index >= 0 ? index : 0;
  activePageIndex = safeIndex;
  const number = String(safeIndex + 1).padStart(2, "0");
  pageCounter.textContent = `${number} / ${String(pageOrder.length).padStart(2, "0")}`;
  pageLabel.textContent = pageName(pageId);
}

function revealPage(page) {
  const items = [...page.querySelectorAll(".reveal")];
  items.forEach((item) => item.classList.remove("is-visible"));
  items.forEach((item, index) => {
    window.setTimeout(() => {
      item.classList.add("is-visible");
    }, 70 * index);
  });
}

function activatePage(pageId, immediate = false) {
  const nextPage = document.getElementById(pageId);
  if (!nextPage) {
    return;
  }

  pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === pageId);
  });

  setPageStatus(pageId);
  revealPage(nextPage);
  history.replaceState({ page: pageId }, "", `#${pageId}`);

  if (immediate) {
    transitionSurface.classList.remove("is-active", "is-closing", "is-opening");
  }
}

function doCurtainTransition(nextPageId) {
  if (transitionLock) {
    return;
  }

  const currentPageId = pageOrder[activePageIndex];
  if (currentPageId === nextPageId) {
    return;
  }

  transitionLock = true;
  transitionSurface.classList.add("is-active", "is-closing");

  window.setTimeout(() => {
    pages.forEach((page) => page.classList.remove("is-active"));
    activatePage(nextPageId);
    transitionSurface.classList.remove("is-closing");
    transitionSurface.classList.add("is-opening");

    window.setTimeout(() => {
      transitionSurface.classList.remove("is-active", "is-opening");
      transitionLock = false;
    }, 680);
  }, 680);
}

function nextPage(step) {
  const total = pageOrder.length;
  const nextIndex = (activePageIndex + step + total) % total;
  doCurtainTransition(pageOrder[nextIndex]);
}

function getScrollableAncestor(target) {
  let element = target instanceof Element ? target : target?.parentElement;

  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    const canScrollY =
      /auto|scroll|overlay/i.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;

    if (canScrollY) {
      return element;
    }

    element = element.parentElement;
  }

  return null;
}

function shouldPageWheel(event) {
  const scrollable = getScrollableAncestor(event.target);
  if (!scrollable) {
    return true;
  }

  if (event.deltaY > 0) {
    const remaining = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop;
    return remaining <= 1;
  }

  if (event.deltaY < 0) {
    return scrollable.scrollTop <= 1;
  }

  return false;
}

function renderModalContent(data) {
  modalImage.src = data.image;
  modalImage.alt = data.alt;
  modalTitle.textContent = data.title;
  modalKicker.textContent = data.kicker;
  modalText.replaceChildren();

  data.sections.forEach((section) => {
    if (typeof section === "string") {
      const rail = document.createElement("div");
      rail.className = "sentence-rail";
      splitSentences(section).forEach((sentence) => {
        const column = document.createElement("div");
        column.className = "sentence-column";
        const lineParts = sentence.match(/.{1,5}/g) || [sentence];
        lineParts.forEach((line) => {
          const p = document.createElement("p");
          p.textContent = line;
          column.appendChild(p);
        });
        rail.appendChild(column);
      });
      modalText.appendChild(rail);
      return;
    }

    const block = document.createElement("section");
    block.className = "modal-section";

    const heading = document.createElement("h4");
    heading.textContent = section.heading;
    block.appendChild(heading);

    const rail = document.createElement("div");
    rail.className = "sentence-rail";
    splitSentences(section.text).forEach((sentence) => {
      const column = document.createElement("div");
      column.className = "sentence-column";
      if (sentence.length >= 30) {
        column.classList.add("is-wide");
      }
      const lineParts = sentence.match(/.{1,5}/g) || [sentence];
      lineParts.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        column.appendChild(p);
      });
      rail.appendChild(column);
    });

    block.appendChild(rail);
    modalText.appendChild(block);
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function resizeParticles() {
  if (!canvas || !context) {
    return;
  }

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(54, Math.min(120, Math.floor(window.innerWidth / 14)));
  particleList = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.23 + 0.05,
    drift: Math.random() * 0.18 - 0.09,
    glow: Math.random() * 0.42 + 0.14,
  }));
}

function drawParticles() {
  if (!canvas || !context) {
    return;
  }

  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particleList.forEach((particle, index) => {
    particle.y -= particle.speed;
    particle.x += particle.drift + Math.sin((particle.y + index * 24) / 120) * 0.11;

    if (particle.y < -12) {
      particle.y = window.innerHeight + 12;
      particle.x = Math.random() * window.innerWidth;
    }

    if (particle.x < -12) {
      particle.x = window.innerWidth + 12;
    } else if (particle.x > window.innerWidth + 12) {
      particle.x = -12;
    }

    const tint = index % 3;
    const alpha = particle.glow;
    const color = tint === 0 ? "239, 228, 207" : tint === 1 ? "210, 59, 90" : "73, 116, 106";
    context.beginPath();
    context.fillStyle = `rgba(${color}, ${alpha})`;
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawParticles);
}

function isInteractiveTarget(target) {
  return Boolean(
    target.closest(
      "a, button, input, textarea, select, [contenteditable='true'], .hobby-card, .practice-card, [data-close-modal], .modal-panel"
    )
  );
}

window.addEventListener(
  "wheel",
  (event) => {
    if (modal.classList.contains("is-open")) {
      return;
    }

    if (Math.abs(event.deltaY) < 18) {
      return;
    }

    if (!shouldPageWheel(event)) {
      return;
    }

    event.preventDefault();
    if (event.deltaY > 0) {
      nextPage(1);
    } else {
      nextPage(-1);
    }
  },
  { passive: false }
);

pageStage.addEventListener("click", (event) => {
  if (modal.classList.contains("is-open") || isInteractiveTarget(event.target)) {
    return;
  }

  nextPage(1);
});

document.querySelectorAll(".hobby-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    const key = card.dataset.hobby;
    if (hobbyData[key]) {
      renderModalContent(hobbyData[key]);
    }
  });
});

document.querySelectorAll(".practice-card").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.replace("#", "");
  if (pageOrder.includes(hash)) {
    activatePage(hash, true);
  }
});

window.addEventListener("load", () => {
  const initialHash = window.location.hash.replace("#", "");
  const initialPage = pageOrder.includes(initialHash) ? initialHash : "home";
  activatePage(initialPage, true);

  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    revealPage(document.getElementById(initialPage));
  }, 680);
});

window.addEventListener("resize", resizeParticles, { passive: true });

resizeParticles();
drawParticles();
