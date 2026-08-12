import { difficultyLabels, renderDifficultyChart } from "../difficulty.js";

const apiBase = "/api";
const pollsRoot = document.querySelector("#dashboard-polls");
const questionsRoot = document.querySelector("#dashboard-questions");
const statusEl = document.querySelector("[data-status]");
const lensLabels = {
  clarify: "幫我釐清",
  chorus: "我也遇到了",
  bridge: "一起拆兩難",
  keeper: "別漏掉這點",
};

function render(state) {
  renderDifficultyChart(document.querySelector(".dashboard-difficulty"), state.difficulty);
  pollsRoot.innerHTML = state.polls
    .map(
      (poll, index) => `
        <article class="dashboard-poll">
          <div class="dashboard-poll-head"><b>${String(index + 1).padStart(2, "0")}</b><span>${poll.total} 票</span></div>
          <h3>${escapeHtml(poll.question)}</h3>
          ${poll.options
            .map((option, optionIndex) => {
              const percent = poll.total
                ? Math.round((poll.counts[optionIndex] / poll.total) * 100)
                : 0;
              return `<div class="dashboard-result-row"><span>${escapeHtml(option)}</span><div><i style="--pct:${percent}%"></i></div><b>${percent}%</b></div>`;
            })
            .join("")}
        </article>`,
    )
    .join("");

  document.querySelector("[data-question-count]").textContent = `${state.questions.length} 題`;
  questionsRoot.innerHTML = state.questions.length
    ? state.questions
        .map(
          (question, index) => `
            <article>
              <div class="dashboard-question-head"><b>${String(index + 1).padStart(2, "0")}</b><span>我也想問 ${question.upvotes}</span></div>
              <div class="question-tags"><span class="question-lens">${escapeHtml(lensLabels[question.lens] || lensLabels.clarify)}</span><span class="question-difficulty difficulty-${question.difficulty}">${question.difficulty} · ${escapeHtml(difficultyLabels[question.difficulty - 1] || difficultyLabels[2])}</span></div>
              <p>${escapeHtml(question.text)}</p>
              <small>${escapeHtml(question.nickname)}</small>
            </article>`,
        )
        .join("")
    : `<div class="empty">等待第一個問題</div>`;
}

function connect() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}${apiBase}/live`);
  socket.addEventListener("open", () => setStatus(true));
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "snapshot") render(message.data);
  });
  socket.addEventListener("close", () => {
    setStatus(false);
    setTimeout(connect, 1500);
  });
}

function setStatus(online) {
  statusEl.classList.toggle("online", online);
  statusEl.lastChild.textContent = online ? "即時連線" : "重新連線中";
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char],
  );
}

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
    event.preventDefault();
    window.parent.postMessage({ type: "clinical-ai-deck-key", key: event.key }, location.origin);
  }
});

fetch(`${apiBase}/state`)
  .then((response) => response.json())
  .then(render)
  .catch(() => {});
connect();
