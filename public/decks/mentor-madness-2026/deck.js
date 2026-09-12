(() => {
  "use strict";
  const slides = [...document.querySelectorAll(".slide")];
  const controls = document.querySelector("#controls");
  const dialog = document.querySelector("#notes-dialog");
  let current = Math.min(
    4,
    Math.max(0, (Number(location.hash.match(/slide-(\d+)/)?.[1]) || 1) - 1),
  );
  let language = "en";
  let notes = null;
  let notesError = false;
  const printing = new URLSearchParams(location.search).has("print");
  document.body.classList.add("enhanced");
  if (!printing && matchMedia("(max-width:700px)").matches) document.body.classList.add("reading");
  const reading = () => document.body.classList.contains("reading");
  const reducedMotion = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
  function scale() {
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(innerWidth / 1920, (innerHeight - controls.offsetHeight) / 1080),
    );
  }
  function renderNotes() {
    const note = notes?.[language]?.[current];
    document.querySelector("#notes-title").textContent = note?.title || "Speaker notes";
    document.querySelector("#notes-counter").textContent = `${current + 1} / 5`;
    document.querySelector("#notes-prev").disabled = current === 0;
    document.querySelector("#notes-next").disabled = current === 4;
    document.querySelector("#notes-body").lang = language === "zh" ? "zh-Hant" : "en";
    document.querySelector("#notes-body").replaceChildren();
    const paragraphs = note?.paragraphs || [
      notesError
        ? "The notes could not load. Please use the script download above."
        : "Loading speaker notes…",
    ];
    for (const text of paragraphs) {
      const p = document.createElement("p");
      p.textContent = text;
      if (/^[\[［]/.test(text)) p.className = "stage";
      document.querySelector("#notes-body").append(p);
    }
    document.querySelector("#script-download").href = `speech-${language}-v2.md`;
    document.querySelector("#notes-en").setAttribute("aria-pressed", language === "en");
    document.querySelector("#notes-zh").setAttribute("aria-pressed", language === "zh");
  }
  function show(index, scroll = true) {
    current = Math.min(slides.length - 1, Math.max(0, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute(
        "aria-hidden",
        !reading() && !printing && i !== current ? "true" : "false",
      );
      slide.inert = !reading() && !printing && i !== current;
    });
    document.querySelector("#counter").textContent = `${current + 1} / 5`;
    document.querySelector("#previous").disabled = current === 0;
    document.querySelector("#next").disabled = current === 4;
    document.querySelector("#reading-button").setAttribute("aria-pressed", reading());
    history.replaceState(null, "", `${location.pathname}${location.search}#slide-${current + 1}`);
    document.title = `${current + 1}/5 · A Good Excuse · mashbean`;
    renderNotes();
    if (reading() && scroll)
      slides[current].scrollIntoView({
        behavior: reducedMotion() ? "instant" : "smooth",
        block: "start",
      });
  }
  function toggleReading() {
    document.body.classList.toggle("reading");
    scale();
    show(current);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* The browser may disallow fullscreen; the deck remains usable. */
    }
  }
  document.querySelector("#previous").onclick = () => show(current - 1);
  document.querySelector("#next").onclick = () => show(current + 1);
  document.querySelector("#notes-prev").onclick = () => show(current - 1);
  document.querySelector("#notes-next").onclick = () => show(current + 1);
  document.querySelector("#reading-button").onclick = toggleReading;
  document.querySelector("#fullscreen-button").onclick = fullscreen;
  document.querySelector("#notes-button").onclick = () => {
    renderNotes();
    dialog.showModal();
  };
  document.querySelector("#close-notes").onclick = () => dialog.close();
  document.querySelector("#notes-en").onclick = () => {
    language = "en";
    renderNotes();
  };
  document.querySelector("#notes-zh").onclick = () => {
    language = "zh";
    renderNotes();
  };
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName))
      return;
    if (dialog.open) return;
    const handled = [
      "ArrowRight",
      "PageDown",
      "ArrowLeft",
      "PageUp",
      "Home",
      "End",
      "n",
      "N",
      "f",
      "F",
      "r",
      "R",
    ];
    if (!handled.includes(e.key)) return;
    e.preventDefault();
    if (["ArrowRight", "PageDown"].includes(e.key)) show(current + 1);
    if (["ArrowLeft", "PageUp"].includes(e.key)) show(current - 1);
    if (e.key === "Home") show(0);
    if (e.key === "End") show(4);
    if (e.key.toLowerCase() === "n") dialog.showModal();
    if (e.key.toLowerCase() === "f") fullscreen();
    if (e.key.toLowerCase() === "r") toggleReading();
  });
  window.addEventListener("resize", scale);
  window.addEventListener("hashchange", () =>
    show((Number(location.hash.match(/slide-(\d+)/)?.[1]) || 1) - 1),
  );
  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!reading() || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        const index = slides.findIndex((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= innerHeight * 0.4 && r.bottom > innerHeight * 0.4;
        });
        if (index >= 0 && index !== current) show(index, false);
      });
    },
    { passive: true },
  );
  window.addEventListener("beforeprint", () => {
    document.body.classList.remove("reading");
    slides.forEach((s) => {
      s.inert = false;
      s.setAttribute("aria-hidden", "false");
    });
  });
  window.addEventListener("afterprint", () => show(current, false));
  scale();
  show(current, false);
  fetch("notes.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((data) => {
      notes = data;
      renderNotes();
    })
    .catch(() => {
      notesError = true;
      renderNotes();
    });
})();
