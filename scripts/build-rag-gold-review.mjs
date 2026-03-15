import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const LAB_ROOT = path.resolve(ROOT, "..", "rag-lab");
const OUTPUT_DIR = LAB_ROOT;
const OUTPUT_FILE = path.join(OUTPUT_DIR, "gold-review.html");
const GOLD_CANDIDATES_FILE = path.join(OUTPUT_DIR, "data", "gold-set-candidates.json");
const EMBEDDED_REVIEW_STORAGE_KEY = "mashbean.ragLab.goldReview";
async function main() {
  const candidates = JSON.parse(await fs.readFile(GOLD_CANDIDATES_FILE, "utf8"));

  const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gold Set Review</title>
    <style>
      :root {
        --bg: #fffdf7;
        --ink: #152631;
        --muted: #5b6d77;
        --line: #d8e3df;
        --panel: rgba(255,255,255,0.93);
        --accent: #0b7d6d;
        --keep: #e9f8ef;
        --drop: #fff1f1;
        --hold: #fff8e8;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Noto Sans TC", "PingFang TC", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at 12% 0%, rgba(217, 244, 238, 0.95), transparent 32%),
          radial-gradient(circle at 92% 10%, rgba(255, 236, 190, 0.8), transparent 28%),
          var(--bg);
      }
      h1, h2, h3 { font-family: "Noto Serif TC", "PingFang TC", serif; margin: 0; }
      .shell {
        width: min(1320px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 48px;
        display: grid;
        gap: 20px;
      }
      .hero, .panel, .candidate {
        border: 1px solid var(--line);
        border-radius: 20px;
        background: var(--panel);
        box-shadow: 0 24px 50px rgba(19, 36, 47, 0.06);
      }
      .hero, .panel { padding: 20px; }
      .eyebrow {
        margin: 0 0 6px;
        color: #0b7d6d;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .muted { color: var(--muted); }
      .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 14px;
      }
      .stats > div {
        padding: 12px 14px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: #fff;
      }
      .stats dt { color: var(--muted); font-size: 13px; }
      .stats dd { margin: 4px 0 0; font-size: 24px; font-family: "JetBrains Mono", monospace; }
      .actions, .pills, .decision-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      button, select, textarea, input {
        font: inherit;
      }
      button {
        cursor: pointer;
        border-radius: 999px;
        border: 1px solid #b9cec6;
        padding: 10px 16px;
        background: #f8fcfb;
        color: var(--ink);
      }
      button.primary {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
      }
      .grid {
        display: grid;
        gap: 18px;
      }
      .category-section {
        display: grid;
        gap: 14px;
      }
      .candidate {
        padding: 16px;
        display: grid;
        gap: 12px;
      }
      .candidate.keep { background: color-mix(in oklab, #fff 85%, var(--keep) 15%); }
      .candidate.drop { background: color-mix(in oklab, #fff 85%, var(--drop) 15%); }
      .candidate.hold { background: color-mix(in oklab, #fff 85%, var(--hold) 15%); }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        padding: 4px 10px;
        background: #edf6f3;
        font-size: 12px;
      }
      .candidate textarea {
        width: 100%;
        min-height: 82px;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid #ccd9d4;
        resize: vertical;
        background: #fff;
      }
      .decision {
        position: relative;
        cursor: pointer;
      }
      .decision input {
        position: absolute;
        inset: 0;
        opacity: 0;
      }
      .decision span {
        display: inline-flex;
        align-items: center;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: #f2f6f4;
      }
      .decision input:checked + span {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }
      .candidate-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: start;
      }
      .why-list {
        margin: 0;
        padding-left: 1.2rem;
        color: var(--muted);
      }
      .status-line {
        font-size: 14px;
        color: var(--muted);
      }
      @media (max-width: 860px) {
        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .candidate-head {
          flex-direction: column;
        }
      }
      @media (max-width: 560px) {
        .stats {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">Local Only Review</p>
        <h1>Gold Set Review</h1>
        <p class="muted">這個頁面只做一件事：讓你判斷哪篇候選文章要留下來當 gold / anchor，哪篇不要。資料只寫到本機 JSON，不進部落格。</p>
        <div class="stats">
          <div><dt>候選總數</dt><dd id="stat-total">-</dd></div>
          <div><dt>保留</dt><dd id="stat-keep">-</dd></div>
          <div><dt>排除</dt><dd id="stat-drop">-</dd></div>
          <div><dt>待定</dt><dd id="stat-hold">-</dd></div>
        </div>
      </section>

      <section class="panel">
        <div class="actions">
          <button class="primary" type="button" id="save-review">儲存 review</button>
          <button type="button" id="export-review">匯出 review JSON</button>
          <button type="button" id="apply-review">依目前判斷產生 final gold set</button>
          <span id="review-status" class="status-line">尚未儲存。</span>
        </div>
      </section>

      <div id="review-root" class="grid"></div>
    </main>

    <script>
      const EMBEDDED_REVIEW_STORAGE_KEY = ${JSON.stringify(EMBEDDED_REVIEW_STORAGE_KEY)};
      const embeddedCandidates = ${JSON.stringify(candidates)};
      const state = { candidates: embeddedCandidates, review: { decisions: {} }, apiAvailable: false };
      const categories = ["style_anchor", "worldview_anchor", "humor_anchor", "argument_anchor"];
      const byId = (id) => document.getElementById(id);
      const escapeHTML = (text) => String(text).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

      async function apiJSON(url, options) {
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          ...options
        });
        if (!response.ok) throw new Error("API " + response.status + " " + url);
        return response.json();
      }

      function readLocalReview() {
        try {
          return JSON.parse(localStorage.getItem(EMBEDDED_REVIEW_STORAGE_KEY) || '{"decisions":{}}');
        } catch {
          return { decisions: {} };
        }
      }

      function writeLocalReview(payload) {
        localStorage.setItem(EMBEDDED_REVIEW_STORAGE_KEY, JSON.stringify(payload));
      }

      function getDecision(id, anchorType) {
        return state.review.decisions[id] ?? { anchorType, decision: "hold", notes: "" };
      }

      function renderStats() {
        const decisions = Object.values(state.review.decisions);
        const keep = decisions.filter((item) => item.decision === "keep").length;
        const drop = decisions.filter((item) => item.decision === "drop").length;
        const hold = decisions.filter((item) => item.decision === "hold").length;
        const total = Object.keys(state.review.decisions).length;
        byId("stat-total").textContent = String(total);
        byId("stat-keep").textContent = String(keep);
        byId("stat-drop").textContent = String(drop);
        byId("stat-hold").textContent = String(hold);
      }

      function candidateCard(item, anchorType) {
        const review = getDecision(item.id, anchorType);
        return (
          '<article class="candidate ' + review.decision + '" data-id="' + escapeHTML(item.id) + '">' +
            '<div class="candidate-head">' +
              '<div>' +
                '<h3>' + escapeHTML(item.title) + '</h3>' +
                '<div class="pills">' +
                  '<span class="pill">' + escapeHTML(anchorType) + '</span>' +
                  '<span class="pill">' + escapeHTML(item.collection) + '</span>' +
                  '<span class="pill">' + escapeHTML(item.contentType) + '</span>' +
                  '<span class="pill">' + escapeHTML(item.era) + '</span>' +
                  '<span class="pill">score ' + escapeHTML(item.score ?? "-") + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="status-line">' + escapeHTML(item.filepath) + '</div>' +
            '</div>' +
            '<div class="pills">' +
              (item.tags || []).map((tag) => '<span class="pill">' + escapeHTML(tag) + '</span>').join("") +
            '</div>' +
            '<ul class="why-list">' +
              (item.why || item.rationale || []).map((why) => '<li>' + escapeHTML(why) + '</li>').join("") +
            '</ul>' +
            '<div class="decision-group">' +
              '<label class="decision">' +
                '<input type="radio" name="decision-' + escapeHTML(item.id) + '" value="keep" ' + (review.decision === "keep" ? "checked" : "") + ' />' +
                '<span>保留</span>' +
              '</label>' +
              '<label class="decision">' +
                '<input type="radio" name="decision-' + escapeHTML(item.id) + '" value="drop" ' + (review.decision === "drop" ? "checked" : "") + ' />' +
                '<span>不要</span>' +
              '</label>' +
              '<label class="decision">' +
                '<input type="radio" name="decision-' + escapeHTML(item.id) + '" value="hold" ' + (review.decision === "hold" ? "checked" : "") + ' />' +
                '<span>待定</span>' +
              '</label>' +
            '</div>' +
            '<textarea placeholder="備註：例如為什麼像 / 為什麼不像 / 之後可替換哪篇">' + escapeHTML(review.notes || "") + '</textarea>' +
          '</article>'
        );
      }

      function render() {
        const root = byId("review-root");
        root.innerHTML = categories.map((anchorType) => {
          const items = state.candidates.candidates[anchorType] || [];
          return (
            '<section class="panel category-section">' +
              '<div>' +
                '<p class="eyebrow">' + escapeHTML(anchorType) + '</p>' +
                '<h2>' + escapeHTML(anchorType) + '</h2>' +
              '</div>' +
              items.map((item) => candidateCard(item, anchorType)).join("") +
            '</section>'
          );
        }).join("");

        root.querySelectorAll(".candidate").forEach((card) => {
          const id = card.dataset.id;
          const radios = card.querySelectorAll('input[name="decision-' + CSS.escape(id) + '"]');
          const textarea = card.querySelector("textarea");
          radios.forEach((radio) => {
            radio.addEventListener("change", () => {
              const current = state.review.decisions[id];
              state.review.decisions[id] = {
                ...current,
                decision: radio.value
              };
              renderStats();
              card.classList.remove("keep", "drop", "hold");
              card.classList.add(radio.value);
            });
          });
          textarea.addEventListener("input", () => {
            const current = state.review.decisions[id];
            state.review.decisions[id] = {
              ...current,
              notes: textarea.value
            };
          });
        });

        renderStats();
      }

      function buildPayload() {
        return {
          updatedAt: new Date().toISOString(),
          sourcePolicy: state.candidates.sourcePolicy,
          decisions: state.review.decisions
        };
      }

      async function saveReview() {
        const payload = buildPayload();
        writeLocalReview(payload);
        if (state.apiAvailable) {
          await apiJSON("./api/gold-review", {
            method: "POST",
            body: JSON.stringify(payload)
          });
          byId("review-status").textContent = "已儲存 review 到本機 JSON 與瀏覽器。";
          return;
        }
        byId("review-status").textContent = "已儲存 review 到瀏覽器本地儲存。若要落檔到 JSON，請用 npm run rag:serve 開啟。";
      }

      function exportReview() {
        const payload = buildPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "gold-set-review.json";
        link.click();
        URL.revokeObjectURL(url);
      }

      async function applyReview() {
        const payload = buildPayload();
        writeLocalReview(payload);
        if (!state.apiAvailable) {
          byId("review-status").textContent = "目前沒有連到本機 API，所以只能先存在瀏覽器。若要產生 final gold set JSON，請用 npm run rag:serve 開啟此頁。";
          return;
        }
        const result = await apiJSON("./api/gold-review/apply", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        byId("review-status").textContent = "已依 review 產生 final gold set：" + result.output;
      }

      async function boot() {
        const localReview = readLocalReview();
        let remoteReview = { decisions: {} };
        try {
          remoteReview = await apiJSON("./api/gold-review");
          state.apiAvailable = true;
        } catch {
          state.apiAvailable = false;
        }
        state.review = {
          decisions: {}
        };

        categories.forEach((anchorType) => {
          (state.candidates.candidates[anchorType] || []).forEach((item) => {
            state.review.decisions[item.id] = remoteReview.decisions?.[item.id] ?? localReview.decisions?.[item.id] ?? {
              anchorType,
              decision: "hold",
              notes: ""
            };
          });
        });

        render();
        if (state.apiAvailable) {
          byId("review-status").textContent = "已連到本機 API，review 可同步到 JSON。";
        } else if (window.location.protocol === "file:") {
          byId("review-status").textContent = "目前是直接開檔案，review 只會先存瀏覽器。若要同步 JSON，請用 npm run rag:serve 後打開 http://127.0.0.1:4173/gold-review.html";
        } else {
          byId("review-status").textContent = "本機 API 未連線，review 只會先存瀏覽器。";
        }
      }

      byId("save-review").addEventListener("click", () => saveReview().catch((error) => {
        byId("review-status").textContent = "儲存失敗：" + error;
      }));
      byId("export-review").addEventListener("click", exportReview);
      byId("apply-review").addEventListener("click", () => applyReview().catch((error) => {
        byId("review-status").textContent = "套用失敗：" + error;
      }));

      boot().catch((error) => {
        byId("review-status").textContent = "初始化失敗：" + error;
      });
    </script>
  </body>
</html>
`;

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, html, "utf8");
  console.log(`[rag:build-gold-review] wrote ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main().catch((error) => {
  console.error("[rag:build-gold-review] failed:", error);
  process.exitCode = 1;
});
