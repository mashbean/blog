import { performance } from "node:perf_hooks";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const base = new URL(args.get("--base") || "http://localhost:8788/clinical-ai-0814/api");
const participants = positiveInteger(args.get("--participants"), 200);
const concurrency = positiveInteger(args.get("--concurrency"), 20);
const durationSeconds = nonNegativeInteger(args.get("--duration-seconds"), 0);
const eventIntervalMs = positiveInteger(args.get("--event-interval-ms"), 15_000);
const questionRate = boundedNumber(args.get("--question-rate"), durationSeconds ? 0.15 : 0.25, 0, 1);
const reactionRate = boundedNumber(args.get("--reaction-rate"), durationSeconds ? 0.45 : 0, 0, 1);
const difficultyRate = boundedNumber(args.get("--difficulty-rate"), durationSeconds ? 0.35 : 0, 0, 1);
const production = !["localhost", "127.0.0.1", "::1"].includes(base.hostname);

if (production && !args.has("--allow-production")) {
  throw new Error("production target requires --allow-production true");
}

const polls = ["starting-point", "pepper-salt", "agent-entry", "delivery-gate"];
const roles = ["住院醫師", "主治醫師", "護理師", "藥師", "醫院行政"];
const lenses = ["clarify", "chorus", "bridge", "keeper"];
const reactions = ["applause", "insight", "resonate", "pause"];
const questions = [
  "如果科內沒有資訊人員，第一個適合交給 Agent 的行政工作會是哪一項？",
  "研究資料來源很多時，怎麼設定一個真的做得到的查核順序？",
  "教學簡報每個月都要更新，哪些步驟最值得先做成固定流程？",
  "同事收到 Agent 產出的初稿後，最後驗收應該由誰負責？",
  "跨科溝通經常反覆改稿，有沒有適合保留版本與決策脈絡的方法？",
  "如果模型給了很完整的引用清單，最快的抽查方式是什麼？",
  "怎麼判斷工作流已經穩定，可以從一次性提示詞升級成 Agent？",
  "每週例行報表很花時間，導入自動化時最先要整理哪些欄位？",
  "對外說明稿需要多人簽核，Agent 應該停在哪一個步驟？",
  "工具拿掉之後，我要怎麼確認團隊真的留下了方法與判斷？",
];
const difficultyPattern = [1, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5];
const voterIds = Array.from({ length: participants }, () => crypto.randomUUID());
const latencies = [];
const errors = [];
const pathMetrics = new Map();
const realtime = { connected: false, snapshots: 0, reactions: 0, errors: [] };
let completedRequests = 0;

async function post(path, body) {
  const startedAt = performance.now();
  const metric = pathMetrics.get(path) || { requests: 0, errors: 0, latencies: [] };
  pathMetrics.set(path, metric);
  metric.requests += 1;
  try {
    const response = await fetch(new URL(`${base.pathname.replace(/\/$/, "")}/${path}`, base), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });
    const elapsed = performance.now() - startedAt;
    latencies.push(elapsed);
    metric.latencies.push(elapsed);
    completedRequests += 1;
    if (!response.ok) {
      metric.errors += 1;
      errors.push({ path, status: response.status, body: (await response.text()).slice(0, 300) });
      return false;
    }
    await response.arrayBuffer();
    return true;
  } catch (error) {
    const elapsed = performance.now() - startedAt;
    latencies.push(elapsed);
    metric.latencies.push(elapsed);
    metric.errors += 1;
    errors.push({ path, error: String(error) });
    return false;
  }
}

async function initializeParticipant(index) {
  const voterId = voterIds[index];
  const difficulty = difficultyPattern[index % difficultyPattern.length];
  await post("difficulty", { voterId, score: difficulty });
  for (let pollIndex = 0; pollIndex < polls.length; pollIndex += 1) {
    await post("vote", {
      voterId,
      pollId: polls[pollIndex],
      optionIndex: (index * (pollIndex * 2 + 1) + pollIndex) % 4,
    });
  }
  if (!durationSeconds && index / participants < questionRate) {
    await post("question", questionPayload(index, 0, difficulty));
  }
}

async function runInitializationPool() {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, participants) }, async () => {
      while (next < participants) {
        const index = next;
        next += 1;
        await initializeParticipant(index);
      }
    }),
  );
}

async function sustainParticipant(index, deadline) {
  const voterId = voterIds[index];
  const staggerMs = Math.floor((index / participants) * eventIntervalMs);
  await delay(staggerMs);
  let cycle = 0;
  while (Date.now() < deadline) {
    const cycleStartedAt = Date.now();
    const roll = deterministicUnit(index, cycle);
    if (roll < reactionRate) {
      await post("reaction", {
        voterId,
        kind: reactions[(index + cycle) % reactions.length],
      });
    } else if (roll < reactionRate + difficultyRate) {
      await post("difficulty", {
        voterId,
        score: ((index + cycle) % 5) + 1,
      });
    } else if (roll < reactionRate + difficultyRate + questionRate) {
      const difficulty = ((index + cycle) % 5) + 1;
      await post("question", questionPayload(index, cycle, difficulty));
    } else {
      const pollIndex = (index + cycle) % polls.length;
      await post("vote", {
        voterId,
        pollId: polls[pollIndex],
        optionIndex: (index + cycle * 3) % 4,
      });
    }
    cycle += 1;
    const remaining = eventIntervalMs - (Date.now() - cycleStartedAt);
    if (remaining > 0) await delay(remaining);
  }
}

function questionPayload(index, cycle, difficulty) {
  return {
    voterId: voterIds[index],
    difficulty,
    lens: lenses[(index + cycle) % lenses.length],
    nickname: `壓測 ${roles[index % roles.length]} ${String(index + 1).padStart(3, "0")}`,
    text: `${questions[(index + cycle) % questions.length]}（壓測第 ${cycle + 1} 輪）`,
  };
}

async function openRealtimeObserver() {
  if (typeof WebSocket === "undefined") {
    realtime.errors.push("WebSocket unavailable in this Node runtime");
    return null;
  }
  const url = new URL(`${base.pathname.replace(/\/$/, "")}/live`, base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(url);
  await Promise.race([
    new Promise((resolve, reject) => {
      socket.addEventListener("open", () => {
        realtime.connected = true;
        resolve();
      });
      socket.addEventListener("error", () => reject(new Error("realtime observer failed")));
    }),
    delay(20_000).then(() => {
      throw new Error("realtime observer timeout");
    }),
  ]);
  socket.addEventListener("message", (event) => {
    try {
      const payload = JSON.parse(String(event.data));
      if (payload.type === "snapshot") realtime.snapshots += 1;
      if (payload.type === "reaction") realtime.reactions += 1;
    } catch (error) {
      realtime.errors.push(String(error));
    }
  });
  socket.addEventListener("close", () => {
    realtime.connected = false;
  });
  return socket;
}

const startedAt = performance.now();
const observer = durationSeconds ? await openRealtimeObserver() : null;
await runInitializationPool();
const initializedAt = performance.now();

let progressTimer;
if (durationSeconds) {
  const sustainedStartedAt = Date.now();
  const deadline = sustainedStartedAt + durationSeconds * 1000;
  progressTimer = setInterval(() => {
    console.log(
      JSON.stringify({
        type: "progress",
        elapsedSeconds: Math.min(durationSeconds, Math.round((Date.now() - sustainedStartedAt) / 1000)),
        requests: completedRequests,
        errors: errors.length,
        realtimeSnapshots: realtime.snapshots,
        realtimeReactions: realtime.reactions,
      }),
    );
  }, 60_000);
  await Promise.all(voterIds.map((_, index) => sustainParticipant(index, deadline)));
  clearInterval(progressTimer);
}

observer?.close();
const elapsed = performance.now() - startedAt;
const stateResponse = await fetch(new URL(`${base.pathname.replace(/\/$/, "")}/state`, base), {
  signal: AbortSignal.timeout(20_000),
});
if (!stateResponse.ok) throw new Error(`state request failed: ${stateResponse.status}`);
const state = await stateResponse.json();
latencies.sort((first, second) => first - second);

const pathSummary = Object.fromEntries(
  [...pathMetrics.entries()].map(([path, metric]) => {
    metric.latencies.sort((first, second) => first - second);
    return [
      path,
      {
        requests: metric.requests,
        errors: metric.errors,
        p50: percentile(metric.latencies, 0.5),
        p95: percentile(metric.latencies, 0.95),
        p99: percentile(metric.latencies, 0.99),
      },
    ];
  }),
);

console.log(
  JSON.stringify(
    {
      type: "final",
      target: `${base.origin}${base.pathname}`,
      participants,
      concurrency,
      durationSeconds,
      eventIntervalMs,
      rates: { reaction: reactionRate, difficulty: difficultyRate, question: questionRate },
      initializationMs: Math.round(initializedAt - startedAt),
      elapsedMs: Math.round(elapsed),
      requests: completedRequests,
      errors: errors.slice(0, 20),
      requestsPerSecond: Number((completedRequests / (elapsed / 1000)).toFixed(1)),
      latencyMs: {
        p50: percentile(latencies, 0.5),
        p95: percentile(latencies, 0.95),
        p99: percentile(latencies, 0.99),
        max: Math.round(latencies.at(-1) || 0),
      },
      byPath: pathSummary,
      realtime,
      resultingState: {
        difficulty: state.difficulty,
        polls: state.polls.map((poll) => ({ id: poll.id, total: poll.total })),
        visibleQuestions: state.questions.length,
        visibleQuestionUpvotes: state.questions.reduce((sum, question) => sum + question.upvotes, 0),
      },
    },
    null,
    2,
  ),
);

if (errors.length) process.exitCode = 1;

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function nonNegativeInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function boundedNumber(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function percentile(values, ratio) {
  if (!values.length) return 0;
  return Math.round(values[Math.min(values.length - 1, Math.ceil(values.length * ratio) - 1)]);
}

function deterministicUnit(index, cycle) {
  let value = (index + 1) * 0x9e3779b1 + (cycle + 1) * 0x85ebca6b;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  return (value >>> 0) / 0x1_0000_0000;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
