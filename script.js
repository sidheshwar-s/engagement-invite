/* ============================================================
   Event details — edit this object to update the invitation.
   Leave a value as "" to show a "to be announced" placeholder
   (or to hide it, for the Tamil lines).
   ============================================================ */
const EVENT = {
  groom: "Sidheshwar S",
  bride: "Oviya B",
  groomTa: "ச. சித்தேஷ்வர்",  // initial from father's name, Saravanan
  brideTa: "பா. ஓவியா",       // initial from father's name, Bala
  groomDegree: "M.Tech.",      // shown small after the name; "" to hide
  brideDegree: "M.Tech.",
  // Titles are joined to names with non-breaking spaces so they never split
  // across lines; a "\n" inside a value starts a new line.
  groomParents: "Son of Mr. Saravanan & Mrs. Jothimalar",
  groomParentsTa: "திரு. சரவணன் – திருமதி. ஜோதிமலர்\nஅவர்களின் அன்பு மகன்",
  brideParents: "Daughter of Mr. Balasubramanian & Mrs. Lalithambal",
  brideParentsTa: "திரு. பாலசுப்ரமணியன் – திருமதி. லலிதாம்பாள்\nஅவர்களின் அன்பு மகள்",

  date: "Sunday, 13 December 2026",
  dateTa: "13 டிசம்பர் 2026, ஞாயிற்றுக்கிழமை",
  time: "11:00 AM – 12:00 PM",
  timeTa: "காலை 11:00 – மதியம் 12:00",
  start: "2026-12-13T11:00:00+05:30", // countdown target, Indian Standard Time
  end: "2026-12-13T13:00:00+05:30",

  venueName: "Darling Residency",
  venueHall: "Mana Priya Hall",     // hall inside the venue; "" to hide
  venueHallTa: "மனப்ரியா அரங்கம்",
  venueAddress: "11/8, Anna Salai, Kosapet, Vellore, Tamil Nadu 632001",
  venueAddressTa: "11/8, அண்ணா சாலை, கொசப்பேட்டை, வேலூர், தமிழ்நாடு 632001",
  mapsName: "", // only needed if Google Maps lists the venue under a different name than venueName

  schedule: [        // each item: { time, title, titleTa, note (optional) }
    { time: "11:00 AM", title: "Welcome & Arrival", titleTa: "வரவேற்பு" },
    { time: "11:30 AM", title: "Ring Ceremony", titleTa: "மோதிரம் மாற்றும் விழா" },
    { time: "12:00 PM", title: "Lunch & Celebration", titleTa: "மதிய விருந்து" },
  ],
};

const FALLBACK = {
  date: "Date to be announced",
  venueName: "Venue to be announced",
  time: "Time to be announced",
};

const COUNTDOWN_MESSAGES = {
  during: ["The celebration is happening now", "விழா தற்போது நடைபெறுகிறது"],
  after: ["Thank you for celebrating with us", "எங்களுடன் கொண்டாடியதற்கு நன்றி"],
};

const firstWord = (text) => text.trim().split(/\s+/)[0];
const lastWord = (text) => text.trim().split(/\s+/).pop();

function fillFields() {
  const values = {
    groom: EVENT.groom,
    bride: EVENT.bride,
    groomFirst: firstWord(EVENT.groom),
    brideFirst: firstWord(EVENT.bride),
    groomTa: EVENT.groomTa,
    brideTa: EVENT.brideTa,
    groomDegree: EVENT.groomDegree,
    brideDegree: EVENT.brideDegree,
    groomParents: EVENT.groomParents,
    groomParentsTa: EVENT.groomParentsTa,
    brideParents: EVENT.brideParents,
    brideParentsTa: EVENT.brideParentsTa,
    groomFirstTa: lastWord(EVENT.groomTa), // Tamil puts the initial first
    brideFirstTa: lastWord(EVENT.brideTa),
    monogram: `${EVENT.groom.trim()[0]} ♥ ${EVENT.bride.trim()[0]}`,
    date: EVENT.date || FALLBACK.date,
    dateTa: EVENT.dateTa,
    time: EVENT.time,
    timeTa: EVENT.timeTa,
    venueName: EVENT.venueName || FALLBACK.venueName,
    venueHall: EVENT.venueHall,
    venueHallTa: EVENT.venueHallTa,
    venueAddress: EVENT.venueAddress,
    venueAddressTa: EVENT.venueAddressTa,
  };

  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = values[el.dataset.field];
    if (value === undefined) return;
    el.textContent = value;
    el.hidden = value === "";
  });
}

function renderSchedule() {
  const list = document.getElementById("timeline");

  EVENT.schedule.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "timeline__item reveal";
    li.style.setProperty("--i", i);

    const card = document.createElement("div");
    card.className = "timeline__card";

    const time = document.createElement("p");
    time.className = "timeline__time";
    time.textContent = item.time || FALLBACK.time;

    const title = document.createElement("h3");
    title.className = "timeline__title";
    title.textContent = item.title;

    card.append(time, title);

    if (item.titleTa) {
      const titleTa = document.createElement("p");
      titleTa.className = "timeline__title-ta ta";
      titleTa.lang = "ta";
      titleTa.textContent = item.titleTa;
      card.append(titleTa);
    }

    if (item.note) {
      const note = document.createElement("p");
      note.className = "timeline__note";
      note.textContent = item.note;
      card.append(note);
    }

    li.append(card);
    list.append(li);
  });
}

function renderVenue() {
  if (!EVENT.venueAddress) return; // keep the "coming soon" placeholder

  const query = encodeURIComponent(
    [EVENT.mapsName || EVENT.venueName, EVENT.venueAddress].filter(Boolean).join(", ")
  );

  const iframe = document.createElement("iframe");
  iframe.src = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  iframe.title = `Map showing ${EVENT.venueName || "the venue"}`;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.allowFullscreen = true;
  document.getElementById("venue-map").replaceChildren(iframe);

  const directions = document.getElementById("directions");
  directions.href = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  directions.hidden = false;
}

function startCountdown() {
  const box = document.getElementById("countdown");
  const message = document.getElementById("countdown-message");
  const start = Date.parse(EVENT.start);
  const end = Date.parse(EVENT.end) || start;

  if (Number.isNaN(start)) {
    box.hidden = true;
    return;
  }

  const units = [["days", 86400000], ["hours", 3600000], ["minutes", 60000], ["seconds", 1000]];
  const valueEls = Object.fromEntries(
    [...box.querySelectorAll("[data-unit]")].map((el) => [el.dataset.unit, el])
  );
  let timer;

  function showMessage(state) {
    if (message.dataset.state === state) return;
    const [en, ta] = COUNTDOWN_MESSAGES[state];
    const taLine = document.createElement("span");
    taLine.className = "ta";
    taLine.lang = "ta";
    taLine.textContent = ta;
    message.replaceChildren(en, document.createElement("br"), taLine);
    message.dataset.state = state;
    message.hidden = false;
    box.hidden = true;
  }

  // Returns false once the event is over and the timer can stop.
  function tick() {
    const now = Date.now();

    if (now >= end) {
      showMessage("after");
      clearInterval(timer);
      return false;
    }

    if (now >= start) {
      showMessage("during");
      return true;
    }

    let remaining = start - now;
    units.forEach(([unit, ms]) => {
      const value = Math.floor(remaining / ms);
      remaining -= value * ms;

      const el = valueEls[unit];
      const text = String(value).padStart(2, "0");
      if (el.textContent === text) return;

      el.textContent = text;
      el.classList.remove("is-ticking");
      void el.offsetWidth; // restart the tick animation
      el.classList.add("is-ticking");
    });
    return true;
  }

  if (tick()) timer = setInterval(tick, 1000);
}

const SVG_NS = "http://www.w3.org/2000/svg";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function svgUse(symbolId, className) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#${symbolId}`);
  svg.append(use);
  return svg;
}

// `order` sets when the flame lights (see --d in styles.css).
function createFlame(order, extraClass = "") {
  const flame = document.createElement("span");
  flame.className = `flame ${extraClass}`.trim();
  flame.style.setProperty("--d", order);
  const glow = document.createElement("span");
  glow.className = "flame__glow";
  flame.append(glow, svgUse("flame-shape", "flame__fire"));
  return flame;
}

function renderLamps() {
  // Hero: diyas either side of the scroll cue, lit from the centre outwards.
  // The outermost pair only shows on wider screens.
  document.querySelectorAll(".hero__lamp-group").forEach((group) => {
    const isLeft = group.dataset.side === "left";
    for (let order = 0; order < 3; order++) {
      const diya = document.createElement("span");
      diya.className = order === 2 ? "diya diya--outer" : "diya";
      diya.append(createFlame(order), svgUse("diya", "diya__bowl"));
      if (isLeft) group.prepend(diya);
      else group.append(diya);
    }
  });

  // Footer: two kuthuvilakku, wick by wick (front, left tip, right tip).
  document.querySelectorAll(".kuthu").forEach((lamp, i) => {
    lamp.append(svgUse("kuthuvilakku", "kuthu__body"));
    ["center", "left", "right"].forEach((position, j) => {
      lamp.append(createFlame(i * 3 + j, `flame--${position}`));
    });
  });
}

// Faint embers drifting up from the hero diyas once they are lit.
function startEmbers() {
  const canvas = document.querySelector(".hero__embers");
  if (!canvas || prefersReducedMotion) return;

  const hero = canvas.closest(".hero");
  const ctx = canvas.getContext("2d");
  const embers = [];
  let sources = [];
  let width = 0;
  let height = 0;
  let heroVisible = true;
  let running = false;
  let lastTime = 0;
  let spawnTimer = 0;

  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sources = [...hero.querySelectorAll(".diya .flame")]
      .filter((flame) => flame.offsetParent !== null) // skip hidden outer diyas
      .map((flame) => {
        const r = flame.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top - box.top };
      });
  }

  function spawn() {
    const source = sources[Math.floor(Math.random() * sources.length)];
    if (!source) return;
    embers.push({
      x: source.x + (Math.random() - 0.5) * 6,
      y: source.y,
      vx: (Math.random() - 0.5) * 8,
      vy: -(14 + Math.random() * 20),
      size: 0.7 + Math.random() * 1.4,
      life: 0,
      maxLife: 3.5 + Math.random() * 3.5,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function frame(time) {
    if (!running) return;
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;

    spawnTimer += dt;
    if (spawnTimer > 0.28 && embers.length < 45) {
      spawnTimer = 0;
      spawn();
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.life += dt;
      if (e.life >= e.maxLife) {
        embers.splice(i, 1);
        continue;
      }
      e.x += e.vx * dt + Math.sin(e.life * 1.6 + e.phase) * 0.3;
      e.y += e.vy * dt;

      const alpha = Math.sin(Math.PI * (e.life / e.maxLife)) * 0.85;
      ctx.fillStyle = `rgba(255, 200, 120, ${alpha * 0.18})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 222, 160, ${alpha})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  // Only animate while the hero is on screen and the tab is visible.
  function update() {
    const shouldRun = heroVisible && !document.hidden;
    if (shouldRun && !running) {
      running = true;
      lastTime = performance.now();
      requestAnimationFrame(frame);
    } else if (!shouldRun) {
      running = false;
    }
  }

  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    update();
  }).observe(hero);
  document.addEventListener("visibilitychange", update);
  window.addEventListener("resize", measure);

  // Begin once the diyas have lit (matches the ignite delays in styles.css).
  setTimeout(() => {
    measure();
    update();
  }, 2600);
}

function setupReveal() {
  // Children of a reveal group fade in one after another.
  document.querySelectorAll(".reveal-group").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const targets = document.querySelectorAll(".reveal, .reveal-group");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // Trigger as soon as an element's top passes the lower 12% of the screen.
    // (A visibility ratio would fire far too late for the tall invitation block.)
    { threshold: 0, rootMargin: "0px 0px -12% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

fillFields();
renderSchedule();
renderVenue();
startCountdown();
renderLamps();
setupReveal();
startEmbers();
