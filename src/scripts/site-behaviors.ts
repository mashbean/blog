const body = document.body;
const isArticle = body.dataset.isArticle === "1";
const searchPath = body.dataset.searchPath || "/search/";

const initMermaid = async () => {
  const preBlocks = Array.from(
    document.querySelectorAll(
      "pre[data-language='mermaid'], pre.language-mermaid, pre.mermaid"
    )
  ).filter((node): node is HTMLElement => node instanceof HTMLElement);
  if (preBlocks.length === 0) return;

  try {
    const mermaidUrl = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
    const mod = (await import(/* @vite-ignore */ mermaidUrl)) as {
      default?: {
        initialize: (options: Record<string, unknown>) => void;
        render: (id: string, code: string) => Promise<{ svg: string }>;
      };
    };
    const mermaid = mod.default;
    if (!mermaid) return;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      fontFamily: "Noto Sans TC, sans-serif",
      themeVariables: {
        primaryColor: "#e4f3ef",
        primaryTextColor: "#1b303a",
        primaryBorderColor: "#7fa79f",
        lineColor: "#6c8f88",
        secondaryColor: "#f3f8f6",
        tertiaryColor: "#fffdf6"
      }
    });

    for (let index = 0; index < preBlocks.length; index += 1) {
      const preNode = preBlocks[index];
      const codeNode = preNode.querySelector("code");
      const source = (codeNode?.textContent ?? preNode.textContent ?? "").trim();
      if (!source) continue;

      const mount = document.createElement("figure");
      mount.className = "mermaid-diagram";
      preNode.insertAdjacentElement("beforebegin", mount);

      try {
        const { svg } = await mermaid.render(`mb-mermaid-${Date.now()}-${index}`, source);
        mount.innerHTML = svg;
        preNode.classList.add("mermaid-source-hidden");
      } catch {
        mount.classList.add("mermaid-diagram-error");
        mount.textContent = "Mermaid 圖表渲染失敗，已保留原始程式碼。";
      }
    }
  } catch {
    // Keep code blocks as-is when Mermaid module fails to load.
  }
};

void initMermaid();

const track = (name: string, props: Record<string, unknown> = {}) => {
  const fn = (window as { mbTrack?: (event: string, payload?: Record<string, unknown>) => void }).mbTrack;
  if (typeof fn === "function") fn(name, props);
};

(window as { mbTrack?: (event: string, payload?: Record<string, unknown>) => void }).mbTrack = (
  name: string,
  props: Record<string, unknown> = {}
) => {
  const plausible = (window as { plausible?: (event: string, payload?: Record<string, unknown>) => void }).plausible;
  if (typeof plausible !== "function") return;
  plausible(name, { props });
};

const isEditableElement = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return el.isContentEditable || tag === "input" || tag === "textarea" || tag === "select";
};

document.addEventListener("keydown", (event) => {
  const isMac = /(mac|iphone|ipad)/i.test(navigator.userAgent);
  const mod = isMac ? event.metaKey : event.ctrlKey;
  if (!mod || event.key.toLowerCase() !== "k" || isEditableElement(event.target)) return;
  event.preventDefault();
  track("Search Shortcut Used", { source: "global_hotkey" });
  window.location.href = searchPath;
});

const header = document.querySelector(".site-header");
if (header instanceof HTMLElement) {
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  let lastY = window.scrollY;
  let ticking = false;

  const updateHeaderVisibility = () => {
    const y = window.scrollY;
    if (!mobileQuery.matches) {
      header.classList.remove("site-header-hidden");
      lastY = y;
      ticking = false;
      return;
    }
    if (body.classList.contains("nav-drawer-open")) {
      header.classList.remove("site-header-hidden");
      lastY = y;
      ticking = false;
      return;
    }
    const delta = y - lastY;
    if (y <= 28 || delta <= -7) header.classList.remove("site-header-hidden");
    else if (delta >= 9) header.classList.add("site-header-hidden");
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    },
    { passive: true }
  );
  window.addEventListener("resize", updateHeaderVisibility);
  mobileQuery.addEventListener?.("change", updateHeaderVisibility);
  updateHeaderVisibility();
}

if (isArticle) {
  const storagePrefix = "mashbean.blog";
  const fontDecButton = document.querySelector("#reading-font-dec");
  const fontIncButton = document.querySelector("#reading-font-inc");
  const focusButton = document.querySelector("#reading-focus-toggle");

  let fontScale = Number(localStorage.getItem(`${storagePrefix}.fontScale`) ?? "1");
  if (!Number.isFinite(fontScale)) fontScale = 1;
  fontScale = Math.min(1.2, Math.max(0.92, fontScale));
  body.style.setProperty("--article-font-scale", String(fontScale));

  const setFocusMode = (enabled: boolean) => {
    body.classList.toggle("focus-reading", enabled);
    if (focusButton instanceof HTMLButtonElement) {
      focusButton.textContent = enabled ? "結束聚焦" : "聚焦閱讀";
      focusButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    }
    localStorage.setItem(`${storagePrefix}.focusMode`, enabled ? "1" : "0");
  };

  setFocusMode(true);
  track("Article Focus Mode", { state: "enabled_default" });

  const updateFontScale = (delta: number) => {
    fontScale = Math.min(1.2, Math.max(0.92, Number((fontScale + delta).toFixed(2))));
    body.style.setProperty("--article-font-scale", String(fontScale));
    localStorage.setItem(`${storagePrefix}.fontScale`, String(fontScale));
  };

  fontDecButton?.addEventListener("click", () => updateFontScale(-0.05));
  fontIncButton?.addEventListener("click", () => updateFontScale(0.05));
  focusButton?.addEventListener("click", () => {
    const nextEnabled = !body.classList.contains("focus-reading");
    setFocusMode(nextEnabled);
    track("Article Focus Mode", { state: nextEnabled ? "enabled" : "disabled" });
  });

  document.addEventListener("keydown", (event) => {
    if (isEditableElement(event.target)) return;
    if (event.key.toLowerCase() !== "f") return;
    event.preventDefault();
    const nextEnabled = !body.classList.contains("focus-reading");
    setFocusMode(nextEnabled);
    track("Article Focus Mode", { state: nextEnabled ? "enabled_hotkey" : "disabled_hotkey" });
  });

  const bar = document.querySelector("#reading-progress-bar");
  const article = document.querySelector("main#main-content article.article-layout");
  const articleTitle = document.querySelector(".article-title")?.textContent?.trim() ?? "";
  const readingStateKey = `${storagePrefix}.lastReading`;
  const persistReadingState = (progress: number) => {
    try {
      const payload = {
        url: window.location.pathname,
        title: articleTitle || document.title || "文章",
        progress: Math.max(0, Math.min(100, Math.round(progress * 100))),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(readingStateKey, JSON.stringify(payload));
    } catch {
      // Ignore storage errors.
    }
  };

  if (bar instanceof HTMLElement) {
    let read50Tracked = false;
    let rafId = 0;
    let pollId = 0;
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
    const getScrollTop = () =>
      Math.max(
        window.scrollY ?? 0,
        window.pageYOffset ?? 0,
        document.documentElement?.scrollTop ?? 0,
        document.body?.scrollTop ?? 0
      );
    const getViewportHeight = () =>
      Math.max(1, window.visualViewport?.height ?? window.innerHeight ?? document.documentElement?.clientHeight ?? 1);
    const getScrollableHeight = () => {
      const doc = document.documentElement;
      const bodyEl = document.body;
      const scrollHeight = Math.max(
        doc?.scrollHeight ?? 0,
        bodyEl?.scrollHeight ?? 0,
        doc?.offsetHeight ?? 0,
        bodyEl?.offsetHeight ?? 0
      );
      return Math.max(1, scrollHeight - getViewportHeight());
    };
    const getReadingProgress = () => {
      const scrollTop = getScrollTop();
      if (article instanceof HTMLElement) {
        const rect = article.getBoundingClientRect();
        const articleTop = scrollTop + rect.top;
        const articleHeight = Math.max(rect.height, article.offsetHeight, article.scrollHeight, 1);
        const articleBottom = articleTop + articleHeight;
        const viewport = getViewportHeight();
        const start = Math.max(0, articleTop - viewport * 0.2);
        const end = Math.max(start + 1, articleBottom - viewport * 0.8);
        return clamp01((scrollTop - start) / (end - start));
      }
      return clamp01(scrollTop / getScrollableHeight());
    };

    const update = () => {
      const progress = getReadingProgress();
      bar.style.width = `${(progress * 100).toFixed(2)}%`;
      persistReadingState(progress);
      if (!read50Tracked && progress >= 0.5) {
        read50Tracked = true;
        track("Article Engaged", { signal: "scroll_50" });
      }
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    document.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });
    window.addEventListener("touchmove", scheduleUpdate, { passive: true });
    document.addEventListener("touchmove", scheduleUpdate, { passive: true, capture: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("scroll", scheduleUpdate);
    pollId = window.setInterval(scheduleUpdate, 250);
    window.addEventListener("pagehide", () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (pollId) window.clearInterval(pollId);
    });
  }

  window.addEventListener("beforeunload", () => {
    const barWidth = Number((bar instanceof HTMLElement ? bar.style.width : "0").replace("%", ""));
    const fallbackProgress = Number.isFinite(barWidth) ? barWidth / 100 : 0;
    persistReadingState(fallbackProgress);
  });
  window.setTimeout(() => {
    track("Article Engaged", { signal: "time_45s" });
  }, 45000);

  const tocLinks = Array.from(document.querySelectorAll(".toc-list a")).filter(
    (el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement
  );
  const observedHeadings = tocLinks
    .map((link) => {
      const id = decodeURIComponent(link.hash.replace(/^#/, ""));
      return document.getElementById(id);
    })
    .filter((el): el is HTMLElement => el instanceof HTMLElement);

  if (tocLinks.length > 0 && observedHeadings.length > 0) {
    const setActiveToc = (id: string) => {
      tocLinks.forEach((link) => {
        const active = decodeURIComponent(link.hash.replace(/^#/, "")) === id;
        link.classList.toggle("toc-link-active", active);
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      observedHeadings.forEach((heading) => {
        heading.classList.toggle("section-active", heading.id === id);
      });
    };

    const rootMargin = window.matchMedia("(max-width: 760px)").matches
      ? "-18% 0px -72% 0px"
      : window.matchMedia("(max-width: 1120px)").matches
        ? "-14% 0px -70% 0px"
        : "-12% 0px -68% 0px";

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]?.target?.id) setActiveToc(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 1] }
    );

    observedHeadings.forEach((heading) => observer.observe(heading));
    setActiveToc(observedHeadings[0].id);
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const prose = document.querySelector(".article-prose");
  if (prose) {
    const tables = prose.querySelectorAll("table");
    tables.forEach((table, index) => {
      if (table.closest(".article-table-region")) return;

      const isEnglish = Boolean(table.closest('[lang="en"]'));
      const region = document.createElement("div");
      region.className = "article-table-region";

      const hint = document.createElement("p");
      hint.className = "article-table-hint";
      hint.setAttribute("aria-hidden", "true");
      hint.textContent = isEnglish
        ? "Swipe horizontally to view all columns"
        : "左右滑動查看完整欄位";

      const scroller = document.createElement("div");
      scroller.className = "article-table-scroll";
      scroller.setAttribute("role", "region");
      scroller.setAttribute(
        "aria-label",
        isEnglish
          ? `Data table ${index + 1}, horizontally scrollable`
          : `資料表 ${index + 1}，可左右捲動`,
      );
      scroller.tabIndex = 0;

      table.insertAdjacentElement("beforebegin", region);
      region.appendChild(hint);
      region.appendChild(scroller);
      scroller.appendChild(table);
    });

    const headings = prose.querySelectorAll("h2[id], h3[id]");
    headings.forEach((heading) => {
      const id = heading.getAttribute("id");
      if (!id || heading.querySelector(".heading-anchor-btn")) return;
      const anchorBtn = document.createElement("button");
      anchorBtn.type = "button";
      anchorBtn.className = "heading-anchor-btn";
      anchorBtn.setAttribute("aria-label", "複製段落連結");
      anchorBtn.textContent = "#";
      anchorBtn.addEventListener("click", async () => {
        const permalink = `${window.location.origin}${window.location.pathname}#${id}`;
        const copied = await copyText(permalink);
        const old = anchorBtn.textContent;
        anchorBtn.textContent = copied ? "OK" : "X";
        if (!copied) window.prompt("請手動複製此段落連結", permalink);
        window.setTimeout(() => {
          anchorBtn.textContent = old ?? "#";
        }, 1200);
      });
      heading.appendChild(anchorBtn);
    });
  }
}
