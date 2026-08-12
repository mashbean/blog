const voterKey = "clinical-ai-live-voter";
const voterId = localStorage.getItem(voterKey) || crypto.randomUUID();
localStorage.setItem(voterKey, voterId);

const pollsRoot = document.querySelector("#polls");
const questionsRoot = document.querySelector("#questions");
const form = document.querySelector("#question-form");
const statusEl = document.querySelector("[data-status]");
const messageEl = document.querySelector("[data-form-message]");
let state = { polls: [], questions: [] };
let socket;
const lensLabels = {
  clarify: "想把問題講清楚",
  chorus: "我也有同樣困擾",
  bridge: "兩種立場都碰到了",
  keeper: "有一件事不能漏掉",
};

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-tab]")
      .forEach((item) => item.classList.toggle("active", item === button));
    document
      .querySelectorAll("[data-panel]")
      .forEach((panel) =>
        panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab),
      );
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  messageEl.textContent = "送出中";
  try {
    state = await post("/api/question", {
      text: String(data.get("question") || ""),
      nickname: String(data.get("nickname") || "匿名"),
      lens: String(data.get("lens") || "clarify"),
      voterId,
    });
    form.querySelector("textarea").value = "";
    messageEl.textContent = "已收進提問池";
    render();
  } catch (error) {
    messageEl.textContent = humanError(error);
  } finally {
    button.disabled = false;
  }
});

async function vote(pollId, optionIndex) {
  state = await post("/api/vote", { pollId, optionIndex, voterId });
  localStorage.setItem(`vote:${pollId}`, String(optionIndex));
  render();
}

async function upvote(questionId) {
  state = await post("/api/upvote", { questionId, voterId });
  localStorage.setItem(`upvote:${questionId}`, "1");
  render();
}

async function post(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "request failed");
  return data;
}

function render() {
  pollsRoot.innerHTML = state.polls
    .map((poll, index) => {
      const selected = Number(localStorage.getItem(`vote:${poll.id}`));
      const hasVote = Number.isInteger(selected) && selected >= 0;
      return `
      <article class="poll-card">
        <div class="poll-meta"><span>${escapeHtml(poll.prompt)}</span><span>${poll.total} 票</span></div>
        <h2><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(poll.question)}</h2>
        <div class="options">
          ${poll.options
            .map((option, optionIndex) => {
              const percent = poll.total
                ? Math.round((poll.counts[optionIndex] / poll.total) * 100)
                : 0;
              return `<button class="option ${hasVote && selected === optionIndex ? "selected" : ""}" data-poll="${poll.id}" data-option="${optionIndex}">
              <span class="bar" style="--pct:${percent}%"></span>
              <span class="option-copy"><b>${String.fromCharCode(65 + optionIndex)}</b>${escapeHtml(option)}</span>
              <span class="percent">${percent}%</span>
            </button>`;
            })
            .join("")}
        </div>
      </article>`;
    })
    .join("");

  pollsRoot.querySelectorAll("[data-poll]").forEach((button) => {
    button.addEventListener("click", () =>
      vote(button.dataset.poll, Number(button.dataset.option)).catch((error) =>
        alert(humanError(error)),
      ),
    );
  });

  document.querySelectorAll("[data-question-count]").forEach((el) => {
    el.textContent = `${state.questions.length} 題`;
  });
  questionsRoot.innerHTML = state.questions.length
    ? state.questions
        .map(
          (question, index) => `
    <article class="question-card">
      <div class="question-rank">${String(index + 1).padStart(2, "0")}</div>
      <div><span class="question-lens">${escapeHtml(lensLabels[question.lens] || lensLabels.clarify)}</span><p>${escapeHtml(question.text)}</p><span>${escapeHtml(question.nickname)}</span></div>
      <button class="upvote ${localStorage.getItem(`upvote:${question.id}`) ? "selected" : ""}" data-upvote="${question.id}" aria-label="我也想問這題">我也想問 <b>${question.upvotes}</b></button>
    </article>`,
        )
        .join("")
    : `<div class="empty">第一題會改變後面的 Q&A 路線</div>`;
  questionsRoot.querySelectorAll("[data-upvote]").forEach((button) => {
    button.addEventListener("click", () =>
      upvote(button.dataset.upvote).catch((error) => alert(humanError(error))),
    );
  });
}

function connect() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  socket = new WebSocket(`${protocol}//${location.host}/api/live`);
  socket.addEventListener("open", () => setStatus(true));
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "snapshot") {
      state = message.data;
      render();
    }
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

function humanError(error) {
  const message = String(error?.message || error);
  if (message.includes("limit")) return "每台裝置最多提出三題";
  return "送出失敗，請稍後再試";
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char],
  );
}

fetch("/api/state")
  .then((response) => response.json())
  .then((data) => {
    state = data;
    render();
  })
  .catch(() => {});
connect();
