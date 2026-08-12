import { performance } from "node:perf_hooks";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const base = new URL(args.get("--base") || "http://localhost:8788/clinical-ai-0814/api");
const participants = positiveInteger(args.get("--participants"), 200);
const concurrency = positiveInteger(args.get("--concurrency"), 20);
const questionRate = boundedNumber(args.get("--question-rate"), 0.25, 0, 1);
const production = !["localhost", "127.0.0.1", "::1"].includes(base.hostname);

if (production && !args.has("--allow-production")) {
  throw new Error("production target requires --allow-production true");
}

const polls = ["starting-point", "pepper-salt", "agent-entry", "delivery-gate"];
const roles = ["住院醫師", "主治醫師", "護理師", "藥師", "醫院行政"];
const lenses = ["clarify", "chorus", "bridge", "keeper"];
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
const latencies = [];
const errors = [];
let completedRequests = 0;

async function post(path, body) {
  const startedAt = performance.now();
  const response = await fetch(new URL(`${base.pathname.replace(/\/$/, "")}/${path}`, base), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const elapsed = performance.now() - startedAt;
  latencies.push(elapsed);
  completedRequests += 1;
  if (!response.ok) {
    errors.push({ path, status: response.status, body: await response.text() });
    return;
  }
  await response.arrayBuffer();
}

async function simulateParticipant(index) {
  const voterId = crypto.randomUUID();
  const difficulty = difficultyPattern[index % difficultyPattern.length];
  await post("difficulty", { voterId, score: difficulty });
  for (let pollIndex = 0; pollIndex < polls.length; pollIndex += 1) {
    await post("vote", {
      voterId,
      pollId: polls[pollIndex],
      optionIndex: (index * (pollIndex * 2 + 1) + pollIndex) % 4,
    });
  }
  if (index / participants < questionRate) {
    await post("question", {
      voterId,
      difficulty,
      lens: lenses[index % lenses.length],
      nickname: `${roles[index % roles.length]} ${String(index + 1).padStart(3, "0")}`,
      text: questions[index % questions.length],
    });
  }
}

async function runPool() {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, participants) }, async () => {
      while (next < participants) {
        const index = next;
        next += 1;
        try {
          await simulateParticipant(index);
        } catch (error) {
          errors.push({ participant: index + 1, error: String(error) });
        }
      }
    }),
  );
}

const startedAt = performance.now();
await runPool();
const elapsed = performance.now() - startedAt;
const stateResponse = await fetch(new URL(`${base.pathname.replace(/\/$/, "")}/state`, base), {
  signal: AbortSignal.timeout(20_000),
});
const state = await stateResponse.json();
latencies.sort((first, second) => first - second);

console.log(
  JSON.stringify(
    {
      target: `${base.origin}${base.pathname}`,
      participants,
      concurrency,
      questionRate,
      requests: completedRequests,
      errors: errors.slice(0, 10),
      elapsedMs: Math.round(elapsed),
      requestsPerSecond: Number((completedRequests / (elapsed / 1000)).toFixed(1)),
      latencyMs: {
        p50: percentile(latencies, 0.5),
        p95: percentile(latencies, 0.95),
        p99: percentile(latencies, 0.99),
        max: Math.round(latencies.at(-1) || 0),
      },
      resultingState: {
        difficulty: state.difficulty,
        polls: state.polls.map((poll) => ({ id: poll.id, total: poll.total })),
        visibleQuestions: state.questions.length,
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

function boundedNumber(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function percentile(values, ratio) {
  if (!values.length) return 0;
  return Math.round(values[Math.min(values.length - 1, Math.ceil(values.length * ratio) - 1)]);
}
