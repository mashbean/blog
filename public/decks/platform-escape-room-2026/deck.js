(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const currentEl = document.getElementById("current-slide");
  const progressEl = document.getElementById("progress-fill");
  const notesPanel = document.getElementById("notes-panel");
  const notesBody = document.getElementById("notes-body");
  const clueModal = document.getElementById("clue-modal");
  const roomTransition = document.getElementById("room-transition");
  const escapeHud = document.getElementById("escape-hud");
  const timelines = new Map();
  const collectedKeys = new Set();
  let currentIndex = 0;
  let transition = null;
  let roomWipe = null;
  let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let touchStartX = 0;

  const clamp = (n) => Math.max(0, Math.min(slides.length - 1, n));

  function requestedIndex() {
    const query = new URLSearchParams(location.search).get("slide");
    const hash = location.hash.match(/^#slide-(\d+)$/);
    return clamp((Number.parseInt(query || hash?.[1] || "1", 10) || 1) - 1);
  }

  function updateScale() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    document.documentElement.style.setProperty("--scale", scale.toFixed(6));
  }

  function primePaths(slide) {
    slide.querySelectorAll("[data-draw]").forEach((path) => {
      let length = 1000;
      try {
        length = path.getTotalLength();
      } catch {}
      path.dataset.length = length;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
  }

  function buildTimeline(slide) {
    primePaths(slide);
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.5 } });
    const header = slide.querySelector("header");
    const reveals = [...slide.querySelectorAll(".reveal")];
    const paths = [...slide.querySelectorAll("[data-draw]")];
    if (header) tl.fromTo(header, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0 }, 0);
    if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 0.95, stagger: 0.07 }, 0.12);
    if (reveals.length)
      tl.fromTo(
        reveals,
        { autoAlpha: 0, y: 26, rotate: -1 },
        { autoAlpha: 1, y: 0, rotate: 0, stagger: 0.07 },
        0.16,
      );
    if (slide.classList.contains("cover")) {
      tl.fromTo(
        ".hero-image",
        { scale: 1.08, x: 24 },
        { scale: 1, x: 0, duration: 1.25 },
        0,
      ).fromTo(
        ".price-sticker",
        { scale: 0, rotate: -28 },
        { scale: 1, rotate: 8, duration: 0.6, ease: "back.out(1.8)" },
        0.65,
      );
    }
    timelines.set(slide, tl);
  }

  function renderNotes() {
    notesBody.replaceChildren();
    const tpl = slides[currentIndex].querySelector(".speaker-notes");
    if (tpl) notesBody.append(tpl.content.cloneNode(true));
  }

  function updateChrome() {
    currentEl.textContent = String(currentIndex + 1);
    progressEl.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    history.replaceState(null, "", `#slide-${currentIndex + 1}`);
    document.title = `${currentIndex + 1}/30 · 社群平台密室逃脫`;
    escapeHud.dataset.visible = currentIndex >= 20 ? "1" : "";
    renderNotes();
  }

  function updateHud() {
    document.querySelectorAll("[data-key-slot]").forEach((slot) => {
      slot.classList.toggle("collected", collectedKeys.has(slot.dataset.keySlot));
    });
    document.getElementById("hud-count").textContent = `${collectedKeys.size} / 5`;
  }

  function awardKey(name, trigger) {
    if (!name) return;
    const isNew = !collectedKeys.has(name);
    collectedKeys.add(name);
    updateHud();
    const slot = document.querySelector(`[data-key-slot="${name}"]`);
    if (trigger) trigger.classList.add("collected");
    if (slot && isNew)
      gsap.fromTo(
        slot,
        { scale: 0.2, rotate: -160 },
        { scale: 1, rotate: 0, duration: reducedMotion ? 0 : 0.65, ease: "back.out(2.4)" },
      );
  }

  function closeClue() {
    clueModal.setAttribute("aria-hidden", "true");
    gsap.to(clueModal, {
      autoAlpha: 0,
      x: 28,
      duration: reducedMotion ? 0 : 0.2,
      onComplete: () => {
        clueModal.style.visibility = "hidden";
      },
    });
  }

  function openClue(trigger) {
    document.getElementById("clue-title").textContent = trigger.dataset.clueTitle || "線索";
    document.getElementById("clue-body").textContent = trigger.dataset.clueBody || "";
    document.getElementById("clue-source").textContent = trigger.dataset.clueSource || "";
    clueModal.setAttribute("aria-hidden", "false");
    clueModal.style.visibility = "visible";
    gsap.fromTo(
      clueModal,
      { autoAlpha: 0, x: 34, rotate: 2.5 },
      {
        autoAlpha: 1,
        x: 0,
        rotate: 0.8,
        duration: reducedMotion ? 0 : 0.34,
        ease: "back.out(1.7)",
      },
    );
  }

  function playRoomWipe(room, direction) {
    if (reducedMotion) return;
    if (roomWipe) roomWipe.progress(1).kill();
    document.getElementById("transition-room").textContent = room;
    const left = roomTransition.querySelector(".left");
    const right = roomTransition.querySelector(".right");
    const stamp = roomTransition.querySelector(".transition-stamp");
    roomWipe = gsap
      .timeline()
      .set(roomTransition, { autoAlpha: 1, visibility: "visible" })
      .fromTo(
        left,
        { xPercent: direction > 0 ? -105 : 0 },
        { xPercent: 0, duration: 0.34, ease: "power3.in" },
      )
      .fromTo(
        right,
        { xPercent: direction > 0 ? 105 : 0 },
        { xPercent: 0, duration: 0.34, ease: "power3.in" },
        "<",
      )
      .fromTo(
        stamp,
        { scale: 1.8, autoAlpha: 0, rotate: -9 },
        { scale: 1, autoAlpha: 1, rotate: -2, duration: 0.3, ease: "back.out(2)" },
        ">-0.02",
      )
      .to(stamp, { autoAlpha: 0, scale: 0.9, duration: 0.2, delay: 0.18 })
      .to(
        left,
        { xPercent: direction > 0 ? -105 : 105, duration: 0.42, ease: "power3.inOut" },
        ">-0.02",
      )
      .to(
        right,
        { xPercent: direction > 0 ? 105 : -105, duration: 0.42, ease: "power3.inOut" },
        "<",
      )
      .set(roomTransition, { autoAlpha: 0, visibility: "hidden" })
      .eventCallback("onComplete", () => {
        roomWipe = null;
      });
  }

  function closePops(except) {
    document.querySelectorAll(".note-pop").forEach((pop) => {
      if (pop === except) return;
      pop.dataset.open = "";
      gsap.to(pop, { autoAlpha: 0, y: 12, scale: 0.97, duration: reducedMotion ? 0 : 0.2 });
    });
  }

  function playAmbient(slide) {
    const packet = slide.querySelector(".packet");
    const conveyor = slide.querySelector(".conveyor");
    if (reducedMotion) return;
    if (packet) {
      gsap.to(packet, {
        keyframes: [
          { x: 490, y: 0 },
          { x: 250, y: 300 },
          { x: 0, y: 0 },
        ],
        duration: 5.5,
        repeat: -1,
        ease: "none",
      });
    }
    if (conveyor) {
      gsap.delayedCall(0.8, () => {
        if (!slide.classList.contains("is-active")) return;
        gsap.killTweensOf(conveyor);
        gsap.set(conveyor, { autoAlpha: 1, x: 0, y: 0, rotate: 0 });
        gsap.to(conveyor, {
          x: -120,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }
  }

  function setActive(index, direction = 1) {
    const next = clamp(index);
    if (next === currentIndex && slides[currentIndex].classList.contains("is-active")) return;
    if (transition) transition.progress(1).kill();
    closePops();
    const oldSlide = slides[currentIndex];
    const newSlide = slides[next];
    gsap.killTweensOf(oldSlide.querySelectorAll(".packet, .conveyor"));
    if (oldSlide.dataset.room !== newSlide.dataset.room)
      playRoomWipe(newSlide.dataset.room, direction);
    currentIndex = next;
    slides.forEach((slide) => {
      if (slide !== oldSlide && slide !== newSlide) {
        slide.classList.remove("is-active");
        gsap.set(slide, { display: "none", autoAlpha: 0, x: 0 });
      }
    });
    newSlide.classList.add("is-active");
    gsap.set(newSlide, {
      display: "block",
      autoAlpha: reducedMotion ? 1 : 0,
      x: reducedMotion ? 0 : direction * 55,
    });
    const pageTl = timelines.get(newSlide);
    primePaths(newSlide);
    if (reducedMotion) {
      oldSlide.classList.remove("is-active");
      gsap.set(oldSlide, { display: "none", autoAlpha: 0, x: 0 });
      pageTl?.progress(1).pause();
    } else {
      pageTl?.pause(0);
      transition = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(oldSlide, { autoAlpha: 0, x: direction * -42, duration: 0.24 }, 0)
        .to(newSlide, { autoAlpha: 1, x: 0, duration: 0.38 }, 0.08)
        .add(() => {
          oldSlide.classList.remove("is-active");
          gsap.set(oldSlide, { display: "none", x: 0 });
          pageTl?.restart();
          playAmbient(newSlide);
        }, 0.18)
        .eventCallback("onComplete", () => {
          transition = null;
        });
    }
    updateChrome();
  }

  function go(delta) {
    const next = clamp(currentIndex + delta);
    if (next !== currentIndex) setActive(next, delta > 0 ? 1 : -1);
  }

  function toggleNotes(force) {
    const open =
      typeof force === "boolean" ? force : notesPanel.getAttribute("aria-hidden") === "true";
    notesPanel.setAttribute("aria-hidden", String(!open));
    gsap.to(notesPanel, {
      autoAlpha: open ? 1 : 0,
      x: open ? 0 : 22,
      duration: reducedMotion ? 0 : 0.26,
    });
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }

  function bindInteractions() {
    document.addEventListener("click", (event) => {
      const clueTrigger = event.target.closest("[data-clue-title]");
      if (clueTrigger) {
        openClue(clueTrigger);
        return;
      }
      const noteTrigger = event.target.closest("[data-note]");
      if (noteTrigger) {
        const pop = document.getElementById(noteTrigger.dataset.note);
        if (!pop) return;
        const opening = !pop.dataset.open;
        closePops(opening ? pop : undefined);
        if (opening) {
          pop.dataset.open = "1";
          gsap.fromTo(
            pop,
            { autoAlpha: 0, y: 20, scale: 0.95 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: reducedMotion ? 0 : 0.3,
              ease: "back.out(1.5)",
            },
          );
        }
        return;
      }
      if (event.target.closest(".note-pop>button")) {
        closePops();
        return;
      }
      if (!event.target.closest(".note-pop")) closePops();
      if (!event.target.closest(".clue-modal")) closeClue();
    });

    document.getElementById("clue-close")?.addEventListener("click", closeClue);

    document.querySelector('[data-action="print-receipt"]')?.addEventListener("click", () => {
      gsap.to("#platform-receipt", {
        autoAlpha: 1,
        y: 0,
        rotate: 1,
        duration: reducedMotion ? 0 : 0.9,
        ease: "power3.out",
      });
    });

    document.querySelector('[data-action="inventory"]')?.addEventListener("click", (event) => {
      const card = event.target.closest(".inventory-card");
      if (!card) return;
      card.classList.toggle("gone");
      const gone = document.querySelectorAll(".inventory-card.gone").length;
      document.getElementById("inventory-result").textContent = gone
        ? `已移除 ${gone} 項。共同生活少了一塊，平台的退出成本浮現了。`
        : "平台保存的同時，也取得了刪除、降權、改價與改規則的能力。";
      gsap.fromTo("#inventory-result", { scale: 0.98 }, { scale: 1, duration: 0.25 });
    });

    document.querySelector('[data-action="rule-cards"]')?.addEventListener("click", (event) => {
      const card = event.target.closest(".rule");
      if (!card) return;
      card.parentElement
        .querySelectorAll(".rule")
        .forEach((item) => item.classList.toggle("selected", item === card));
      document.getElementById("rule-result").textContent = card.dataset.result;
      gsap.fromTo(
        card,
        { y: 0, rotate: 0 },
        { y: -12, rotate: -0.5, duration: reducedMotion ? 0 : 0.35, ease: "back.out(1.8)" },
      );
    });

    document.querySelector('[data-action="fake-exits"]')?.addEventListener("click", (event) => {
      const door = event.target.closest("button");
      if (!door) return;
      const messages = {
        "刪除 App": "你休息了，關係仍留在原地。",
        換一個平台: "新房間更漂亮，社交圖譜仍由房東保管。",
        買會員: "帳單改善服務，治理權尚未出現。",
        全部上鏈: "資料分散了，組織與維護還沒完成。",
        "交給 AI 管理": "處置變快了，申訴與責任仍要有人承擔。",
      };
      document.getElementById("door-message").textContent = messages[door.textContent.trim()];
      gsap.fromTo(
        door,
        { x: -8 },
        { x: 8, repeat: reducedMotion ? 0 : 5, yoyo: true, duration: 0.06, clearProps: "x" },
      );
    });

    document.querySelector('[data-action="role-switch"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      button.parentElement
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b === button));
    });

    document.querySelector('[data-action="quadrants"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      gsap.fromTo(
        button,
        { scale: 0.94, rotate: -1 },
        { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(1.8)" },
      );
      button.querySelector("small").textContent = "還要看另外三格";
    });

    document.querySelector(".case-console .five-questions")?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const details = {
        規則: "範圍先鎖定色情與濫用廣告。明確類型讓志工知道哪裡可以出手，爭議內容留在原程序。",
        證據: "每次打掃都指向原留言、操作者與時間。四個帳號產生七成違規內容，重複樣態也能被檢查。",
        權限: "隊員取得隱藏垃圾留言的有限權限，沒有同時取得凍結帳號或改寫規則的能力。",
        申訴: "被處置者保有申訴與復原路徑。這一週零申訴是觀察結果，還不能當成永遠正確的證明。",
        稽核: "公開布告欄讓社群看見誰處理了什麼。304 次高度集中因而浮現，可以討論輪替、負荷與誤判。",
      };
      document.getElementById("answer-screen").textContent = details[button.dataset.answer];
      button.classList.add("checked");
      const count = document.querySelectorAll(".case-console .five-questions .checked").length;
      document.getElementById("case-verdict").textContent =
        count === 5
          ? "5 / 5　程序、邊界與救濟都能被追查"
          : `${count} / 5　案件仍有 ${5 - count} 處黑箱`;
      gsap.fromTo(
        "#answer-screen",
        { rotateX: 80, transformOrigin: "50% 0" },
        { rotateX: 0, duration: 0.35 },
      );
    });

    document.getElementById("balance-range")?.addEventListener("input", (event) => {
      const angle = (Number(event.target.value) - 50) / 5;
      gsap.to(".balance-arm", { rotate: angle, duration: 0.22, transformOrigin: "50% 50%" });
    });

    document
      .querySelector('[data-action="sustainability-cases"]')
      ?.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        const details = {
          Wikipedia:
            "捐款能支撐 25 年，前提是全球品牌、公眾信任與清楚的公共財定位同時存在。這條路很強，也很難複製。",
          Signal:
            "加密通訊創造巨大公共價值，近期財務仍靠既有資產與大額支持消耗。使命清楚，收入結構還在找出口。",
          Mozilla:
            "基金會加商業子公司提供規模，超過八成收入依賴 Google 搜尋合約，又形成新的單點風險。",
          Cohost:
            "工人所有、無廣告、每月 5 美元訂閱仍無法覆蓋每月成本。高度認同與奉獻沒能支付完整帳單。",
        };
        button.parentElement
          .querySelectorAll("button")
          .forEach((item) => item.classList.toggle("active", item === button));
        document.getElementById("funding-answer").textContent = details[button.dataset.case];
        gsap.fromTo(
          "#funding-answer",
          { y: 9, autoAlpha: 0.4 },
          { y: 0, autoAlpha: 1, duration: 0.28 },
        );
      });

    document.querySelector('[data-action="case-strip"]')?.addEventListener("click", (event) => {
      const card = event.target.closest("button");
      if (!card) return;
      gsap.fromTo(
        card,
        { rotateY: 0 },
        { rotateY: 360, duration: reducedMotion ? 0 : 0.7, transformPerspective: 800 },
      );
    });

    document.querySelector('[data-action="escape-map"]')?.addEventListener("click", (event) => {
      const key = event.target.closest("button");
      if (!key) return;
      key.classList.toggle("active");
      awardKey(key.dataset.key, key);
      gsap.fromTo(".exit-node", { scale: 0.92 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    });

    document.querySelector('[data-action="fediverse"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const details = {
        互通: "ActivityPub 把貼文、追蹤與回覆放進共享語言，不同站台因此能互相投遞。",
        治理: "每個節點保有自己的管理政策。房東不同，禁令、審核與社群文化也會不同。",
        遷移: "帳號與關係有較多出口，實際可攜程度仍取決於服務支援、資料格式與社群協調。",
        維護: "協議活著不等於節點免費。主機、審核、安全、備份與管理員接班每天都要有人處理。",
      };
      button.parentElement
        .querySelectorAll("button")
        .forEach((item) => item.classList.toggle("active", item === button));
      document.getElementById("fedi-answer").textContent = details[button.dataset.fedi];
      awardKey("協議", button);
      gsap.fromTo(
        button,
        { scale: 0.86 },
        { scale: 1, duration: 0.38, ease: "elastic.out(1,.45)" },
      );
    });

    document.querySelectorAll("[data-key-pickup]").forEach((button) => {
      button.addEventListener("click", () => {
        awardKey(button.dataset.keyPickup, button);
        button.textContent = `已取得「${button.dataset.keyPickup}」`;
      });
    });

    document.querySelector('[data-action="admin-locks"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-lock]");
      if (!button) return;
      const details = {
        規則: "公開一份有版本的規則。誰能修改、何時生效、舊規則去哪裡，都有地址可查。",
        處置: "高風險權限拆開，設定期限與最小範圍。每一次出手都進公開紀錄。",
        申訴: "受影響者有另一個窗口，能補充上下文、要求重審，也能在誤判後復原。",
        交接: "網域、主機、金庫與管理權各自有替補角色。接班演練完成後，社群不用等英雄回來。",
      };
      button.classList.add("unlocked");
      document.getElementById("admin-answer").textContent = details[button.dataset.lock];
      const count = document.querySelectorAll(".admin-locks .unlocked").length;
      gsap.to("#admin-fill", { width: `${count * 25}%`, duration: reducedMotion ? 0 : 0.38 });
      document.getElementById("admin-label").textContent =
        count === 4 ? "4 / 4　第八天照常開門" : `${count} / 4　還有 ${4 - count} 扇門上鎖`;
      if (count === 4) awardKey("治理", button);
    });

    document.querySelector('[data-action="money-ring"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      button.classList.add("active");
      const count = document.querySelectorAll(".money-ring button.active").length;
      document.getElementById("money-status").textContent =
        count >= 2
          ? `${count} / 2　替代收入已接通，金流鑰匙入袋`
          : `${count} / 2　再接一條收入，解除單點斷炊`;
      if (count >= 2) awardKey("金流", button);
      gsap.fromTo(button, { scale: 1.15 }, { scale: 1, duration: 0.6, ease: "back.out(2)" });
      gsap.fromTo(
        ".money-ring div",
        { scale: 0.9 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" },
      );
    });

    ["defense-stack", "stack-layers"].forEach((name) => {
      document.querySelector(`[data-action="${name}"]`)?.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        button.classList.toggle("active");
        if (name === "defense-stack") awardKey("抗審查", button);
        gsap.fromTo(button, { x: -15 }, { x: 0, duration: 0.28 });
      });
    });

    document
      .querySelector('[data-action="experiment-grid"]')
      ?.addEventListener("click", (event) => {
        const card = event.target.closest("figure[data-experiment]");
        if (!card) return;
        card.parentElement
          .querySelectorAll("figure")
          .forEach((item) => item.classList.toggle("active", item === card));
        document.getElementById("experiment-answer").textContent = card.dataset.experiment;
        gsap.fromTo(
          card,
          { y: 0 },
          { y: -13, duration: reducedMotion ? 0 : 0.32, ease: "back.out(1.7)" },
        );
      });

    document.querySelector('[data-action="escape-checklist"]')?.addEventListener("change", () => {
      const count = document.querySelectorAll(".escape-checklist input:checked").length;
      gsap.to("#lock-fill", {
        width: `${count * 20}%`,
        duration: reducedMotion ? 0 : 0.4,
        ease: "power2.out",
      });
      document.getElementById("lock-label").textContent =
        count === 5 ? "5 / 5　出口已解鎖" : `${count} / 5　出口上鎖`;
      if (count === 5)
        gsap.fromTo(
          ".lock-meter",
          { rotate: -1 },
          {
            rotate: 1,
            repeat: reducedMotion ? 0 : 5,
            yoyo: true,
            duration: 0.08,
            clearProps: "rotate",
          },
        );
    });

    document.querySelector('[data-action="final-keys"]')?.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      button.parentElement
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b === button));
      document.getElementById("final-choice").textContent =
        `你帶走了「${button.textContent}」這把鑰匙 · 工具袋已有 ${collectedKeys.size} / 5`;
      gsap.fromTo(
        ".tear-hole",
        { scale: 0.72, rotate: -5 },
        { scale: 1, rotate: 0, duration: reducedMotion ? 0 : 0.7, ease: "elastic.out(1,.5)" },
      );
    });
  }

  function diagnostics() {
    return slides.map((slide, i) => {
      const bounds = slide.getBoundingClientRect();
      const overflows = [...slide.querySelectorAll("h1,h2,h3,p,img,figure,button,.sourcebar")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.right > bounds.right + 2 ||
            r.bottom > bounds.bottom + 2 ||
            r.left < bounds.left - 2 ||
            r.top < bounds.top - 2
          );
        })
        .map((el) => ({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.trim().slice(0, 40),
        }));
      return { slide: i + 1, overflows };
    });
  }

  function bindNavigation() {
    document.getElementById("prev").addEventListener("click", () => go(-1));
    document.getElementById("next").addEventListener("click", () => go(1));
    document.getElementById("notes-toggle").addEventListener("click", () => toggleNotes());
    document.getElementById("notes-close").addEventListener("click", () => toggleNotes(false));
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
    addEventListener("keydown", (event) => {
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActive(0, -1);
      } else if (event.key === "End") {
        event.preventDefault();
        setActive(slides.length - 1, 1);
      } else if (event.key.toLowerCase() === "n") toggleNotes();
      else if (event.key.toLowerCase() === "f") toggleFullscreen();
      else if (event.key === "Escape") {
        toggleNotes(false);
        closePops();
        closeClue();
      }
    });
    addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true },
    );
    addEventListener(
      "touchend",
      (event) => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 70) go(delta < 0 ? 1 : -1);
      },
      { passive: true },
    );
    let frame = 0;
    addEventListener("resize", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    });
  }

  function bindSceneParallax() {
    document
      .querySelectorAll(".case-file img, .fedi-visual img, .admin-visual img, .stack-visual img")
      .forEach((image) => {
        const frame = image.parentElement;
        frame.addEventListener("pointermove", (event) => {
          if (reducedMotion) return;
          const rect = frame.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
          gsap.to(image, {
            x,
            y,
            scale: 1.025,
            duration: 0.45,
            ease: "power2.out",
            overwrite: true,
          });
        });
        frame.addEventListener("pointerleave", () => {
          gsap.to(image, {
            x: 0,
            y: 0,
            scale: 1,
            duration: reducedMotion ? 0 : 0.55,
            ease: "power3.out",
            overwrite: true,
          });
        });
      });
    document.querySelectorAll('[tabindex="0"][data-experiment]').forEach((card) => {
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    });
  }

  async function init() {
    updateScale();
    if (document.fonts?.ready) await document.fonts.ready;
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        reducedMotion = Boolean(context.conditions.reduce);
        return () => {
          reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        };
      },
    );
    slides.forEach(buildTimeline);
    bindNavigation();
    bindInteractions();
    bindSceneParallax();
    updateHud();
    currentIndex = requestedIndex();
    slides.forEach((slide, i) => {
      const active = i === currentIndex;
      slide.classList.toggle("is-active", active);
      gsap.set(slide, { display: active ? "block" : "none", autoAlpha: active ? 1 : 0 });
    });
    const active = slides[currentIndex];
    if (reducedMotion || new URLSearchParams(location.search).has("static"))
      timelines.get(active)?.progress(1).pause();
    else {
      timelines.get(active)?.restart();
      playAmbient(active);
    }
    updateChrome();
    window.goToSlide = (number) => setActive(clamp(Number(number) - 1), 1);
    window.getDeckDiagnostics = diagnostics;
    window.__deckReady = true;
    dispatchEvent(new CustomEvent("deckready"));
  }

  init().catch((error) => {
    console.error("Deck initialization failed", error);
    slides[0].classList.add("is-active");
  });
})();
