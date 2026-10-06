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
  // Titles are joined to names with non-breaking spaces so they never split
  // across lines; a "\n" inside a value starts a new line.
  groomParents: "Son of Mr. Saravanan & Mrs. Jothimalar",
  groomParentsTa: "திரு. சரவணன் – திருமதி. ஜோதிமலர்\nஅவர்களின் அன்பு மகன்",
  brideParents: "Daughter of Mr. Balasubramanian & Mrs. Lalithambal",
  brideParentsTa: "திரு. பாலசுப்ரமணியன் – திருமதி. லலிதாம்பாள்\nஅவர்களின் அன்பு மகள்",

  date: "Sunday, 13 December 2026",
  dateTa: "13 டிசம்பர் 2026, ஞாயிற்றுக்கிழமை",
  time: "11:00 AM – 1:00 PM",
  timeTa: "காலை 11:00 – மதியம் 1:00",
  start: "2026-12-13T11:00:00+05:30", // countdown target, Indian Standard Time
  end: "2026-12-13T13:00:00+05:30",

  venueName: "Darling Banquet Hall",
  venueAddress: "11/8, Anna Salai, Bishop David Nagar, Kosapet, Vellore, Tamil Nadu 632001",
  venueAddressTa: "11/8, அண்ணா சாலை, பிஷப் டேவிட் நகர், கொசப்பேட்டை, வேலூர், தமிழ்நாடு 632001",
  mapsName: "Darling Mahal", // the name Google Maps lists the venue under; used for the map + directions

  schedule: [        // each item: { time, title, titleTa, note (optional) }
    { time: "11:00 AM", title: "Welcome & Arrival", titleTa: "வரவேற்பு" },
    { time: "11:30 AM", title: "Ring Ceremony", titleTa: "மோதிரம் மாற்றும் விழா" },
    { time: "12:30 PM", title: "Lunch & Celebration", titleTa: "மதிய விருந்து" },
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
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

fillFields();
renderSchedule();
renderVenue();
startCountdown();
setupReveal();
