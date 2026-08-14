import { difficultyLabels, renderDifficultyChart } from "../difficulty.js";

const apiBase = "/clinical-ai-0814/api";
const pollsRoot = document.querySelector("#dashboard-polls");
const questionsRoot = document.querySelector("#dashboard-questions");
const tabButtons = [...document.querySelectorAll("[data-dashboard-tab]")];
const tabPanels = [...document.querySelectorAll("[data-dashboard-panel]")];
const lensLabels = {
  clarify: "幫我釐清",
  chorus: "我也遇到了",
  bridge: "一起拆兩難",
  keeper: "別漏掉這點",
};

function render(state) {
  renderDifficultyChart(document.querySelector(".dashboard-difficulty"), state.difficulty);
  document.querySelector("[data-poll-total]").textContent = `${state.polls.length} 題`;
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
              return `<div class="dashboard-result-row"><span>${escapeHtml(option)}</span><div><i style="--pct:${percent}%"></i></div><b>${poll.counts[optionIndex]} 票</b></div>`;
            })
            .join("")}
        </article>`,
    )
    .join("");

  document.querySelector("[data-question-count]").textContent = `${state.questions.length} 題`;
  const latestQuestions = [...state.questions].sort(
    (first, second) => Number(second.createdAt) - Number(first.createdAt),
  );
  questionsRoot.innerHTML = latestQuestions.length
    ? latestQuestions
        .map(
          (question, index) => `
            <article>
              <div class="dashboard-question-head"><b>${index === 0 ? "NEW" : String(index + 1).padStart(2, "0")}</b><span><time>${formatTime(question.createdAt)}</time> · 我也想問 ${question.upvotes}</span></div>
              <div class="question-tags"><span class="question-lens">${escapeHtml(lensLabels[question.lens] || lensLabels.clarify)}</span><span class="question-difficulty difficulty-${question.difficulty}">${question.difficulty} · ${escapeHtml(difficultyLabels[question.difficulty - 1] || difficultyLabels[2])}</span></div>
              <p>${escapeHtml(question.text)}</p>
              <small>${escapeHtml(question.nickname)}</small>
            </article>`,
        )
        .join("")
    : `<div class="empty">等待第一個問題</div>`;
}

function setDashboardTab(name) {
  const next = name === "polls" ? "polls" : "live";
  tabButtons.forEach((button) => {
    const active = button.dataset.dashboardTab === next;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.dashboardPanel !== next;
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const next = button.dataset.dashboardTab;
    setDashboardTab(next);
    history.replaceState(null, "", next === "polls" ? "#polls" : "#live");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

function formatTime(value) {
  const date = new Date(Number(value));
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date)
    : "剛剛";
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char],
  );
}

window.addEventListener("keydown", (event) => {
  if (
    event.target instanceof HTMLElement &&
    event.target.closest("button, a, input, select, textarea")
  ) {
    return;
  }
  if (["ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
    event.preventDefault();
    window.parent.postMessage({ type: "clinical-ai-deck-key", key: event.key }, location.origin);
  }
});

fetch(`${apiBase}/state`)
  .then((response) => {
    if (!response.ok) throw new Error("activity archive unavailable");
    return response.json();
  })
  .then(render)
  .catch(() => {});
setDashboardTab(location.hash === "#polls" ? "polls" : "live");
