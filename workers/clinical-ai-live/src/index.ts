import { DurableObject } from "cloudflare:workers";

type Poll = {
  id: string;
  question: string;
  prompt: string;
  options: string[];
};

type PollResult = Poll & {
  counts: number[];
  total: number;
};

type AudienceQuestion = {
  id: string;
  text: string;
  nickname: string;
  lens: QuestionLens;
  difficulty: number;
  createdAt: number;
  upvotes: number;
};

type QuestionLens = "clarify" | "chorus" | "bridge" | "keeper";
type ReactionKind = "applause" | "insight" | "resonate" | "pause";

type SessionSnapshot = {
  closed: boolean;
  updatedAt: number;
  polls: PollResult[];
  difficulty: DifficultySnapshot;
  questions: AudienceQuestion[];
};

type DifficultySnapshot = {
  counts: number[];
  total: number;
  average: number | null;
};

type QuestionRow = {
  id: string;
  text: string;
  nickname: string;
  lens: QuestionLens;
  difficulty: number;
  created_at: number;
  upvotes: number;
};

const SESSION_NAME = "clinical-ai-2026-08-14";
const SESSION_CLOSED = true;
const MAX_BODY_BYTES = 4096;
const QUESTION_LENSES = new Set<QuestionLens>(["clarify", "chorus", "bridge", "keeper"]);
const REACTION_KINDS = new Set<ReactionKind>(["applause", "insight", "resonate", "pause"]);

const POLLS: Poll[] = [
  {
    id: "starting-point",
    question: "你現在把 AI 用到哪一層？",
    prompt: "開場暖身",
    options: ["偶爾聊天", "搜尋與整理", "交付完整任務", "已有固定工作流"],
  },
  {
    id: "pepper-salt",
    question: "胡椒鹽四類工作，哪一塊最耗你的時間？",
    prompt: "服務、教學、研究、公關",
    options: ["行政服務", "教學", "研究", "公關與溝通"],
  },
  {
    id: "agent-entry",
    question: "你願意先把哪一步交給 Agent？",
    prompt: "任務邊界",
    options: ["找資料與整理來源", "把素材排成結構", "產出可編輯初稿", "執行整套流程並回報"],
  },
  {
    id: "delivery-gate",
    question: "成果交付前，你最想先守住哪一關？",
    prompt: "驗收優先順序",
    options: ["來源找得到", "數字重算得出來", "內容符合現場脈絡", "最後有人簽核"],
  },
];

export class LiveSession extends DurableObject<Env> {
  private snapshotCache: SessionSnapshot | null = null;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.initializeCurrentSchema();
    });
  }

  private initializeCurrentSchema(): void {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS _sql_schema_migrations (
        id INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS votes (
        poll_id TEXT NOT NULL,
        voter_id TEXT NOT NULL,
        option_index INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (poll_id, voter_id)
      );
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        voter_id TEXT NOT NULL,
        text TEXT NOT NULL,
        nickname TEXT NOT NULL,
        lens TEXT NOT NULL DEFAULT 'clarify',
        difficulty INTEGER NOT NULL DEFAULT 3,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS difficulty_votes (
        voter_id TEXT PRIMARY KEY,
        score INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS question_votes (
        question_id TEXT NOT NULL,
        voter_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (question_id, voter_id),
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
      CREATE INDEX IF NOT EXISTS idx_questions_voter_id ON questions(voter_id);
      CREATE INDEX IF NOT EXISTS idx_question_votes_question_id ON question_votes(question_id);
    `);
  }

  async snapshot(): Promise<SessionSnapshot> {
    if (!SESSION_CLOSED && this.snapshotCache) return this.snapshotCache;

    if (SESSION_CLOSED) {
      for (const socket of this.ctx.getWebSockets()) {
        try {
          socket.close(1000, "event ended");
        } catch {
          // The socket may already be closed.
        }
      }
    }

    const polls = POLLS.map((poll) => {
      const counts = new Array<number>(poll.options.length).fill(0);
      const rows = this.ctx.storage.sql
        .exec<{
          option_index: number;
          count: number;
        }>(
          "SELECT option_index, COUNT(*) AS count FROM votes WHERE poll_id = ? GROUP BY option_index",
          poll.id,
        )
        .toArray();
      for (const row of rows) {
        if (row.option_index >= 0 && row.option_index < counts.length) {
          counts[row.option_index] = row.count;
        }
      }
      return { ...poll, counts, total: counts.reduce((sum, count) => sum + count, 0) };
    });

    const questions = this.ctx.storage.sql
      .exec<QuestionRow>(
        `
        SELECT
          q.id,
          q.text,
          q.nickname,
          q.lens,
          q.difficulty,
          q.created_at,
          COUNT(qv.question_id) AS upvotes
        FROM questions q
        LEFT JOIN question_votes qv ON qv.question_id = q.id
        GROUP BY q.id
        ORDER BY q.created_at DESC
        LIMIT 100
      `,
      )
      .toArray()
      .map((row) => ({
        id: row.id,
        text: row.text,
        nickname: row.nickname,
        lens: row.lens,
        difficulty: row.difficulty,
        createdAt: row.created_at,
        upvotes: row.upvotes,
      }));

    const difficultyCounts = new Array<number>(5).fill(0);
    const difficultyRows = this.ctx.storage.sql
      .exec<{
        score: number;
        count: number;
      }>("SELECT score, COUNT(*) AS count FROM difficulty_votes GROUP BY score")
      .toArray();
    for (const row of difficultyRows) {
      if (row.score >= 1 && row.score <= 5) difficultyCounts[row.score - 1] = row.count;
    }
    const difficultyTotal = difficultyCounts.reduce((sum, count) => sum + count, 0);
    const weightedDifficulty = difficultyCounts.reduce(
      (sum, count, index) => sum + count * (index + 1),
      0,
    );
    const difficulty: DifficultySnapshot = {
      counts: difficultyCounts,
      total: difficultyTotal,
      average: difficultyTotal
        ? Math.round((weightedDifficulty / difficultyTotal) * 10) / 10
        : null,
    };

    const snapshot = {
      closed: SESSION_CLOSED,
      updatedAt: Date.now(),
      polls,
      difficulty,
      questions,
    };
    if (!SESSION_CLOSED) this.snapshotCache = snapshot;
    return snapshot;
  }

  async vote(pollId: string, optionIndex: number, voterId: string): Promise<SessionSnapshot> {
    const poll = POLLS.find((candidate) => candidate.id === pollId);
    if (
      !poll ||
      !Number.isInteger(optionIndex) ||
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      throw new Error("invalid vote");
    }
    assertVoterId(voterId);
    const snapshot = await this.snapshot();
    const previous = this.ctx.storage.sql
      .exec<{
        option_index: number;
      }>("SELECT option_index FROM votes WHERE poll_id = ? AND voter_id = ?", pollId, voterId)
      .toArray()[0];
    this.ctx.storage.sql.exec(
      `INSERT INTO votes (poll_id, voter_id, option_index, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (poll_id, voter_id)
       DO UPDATE SET option_index = excluded.option_index, updated_at = excluded.updated_at`,
      pollId,
      voterId,
      optionIndex,
      Date.now(),
    );
    if (previous?.option_index !== optionIndex) {
      const result = snapshot.polls.find((candidate) => candidate.id === pollId);
      if (result) {
        if (previous) result.counts[previous.option_index] -= 1;
        else result.total += 1;
        result.counts[optionIndex] += 1;
      }
    }
    return this.broadcastSnapshot(this.touch(snapshot));
  }

  async ask(
    text: string,
    nickname: string,
    lens: QuestionLens,
    difficulty: number,
    voterId: string,
  ): Promise<SessionSnapshot> {
    const cleanedText = cleanText(text, 280);
    const cleanedNickname = cleanText(nickname || "匿名", 24);
    assertVoterId(voterId);
    if (cleanedText.length < 4) throw new Error("question too short");
    if (!QUESTION_LENSES.has(lens)) throw new Error("invalid question lens");
    assertDifficulty(difficulty);

    const snapshot = await this.snapshot();

    const prior = this.ctx.storage.sql
      .exec<{
        count: number;
      }>("SELECT COUNT(*) AS count FROM questions WHERE voter_id = ?", voterId)
      .one();
    if (prior.count >= 20) throw new Error("question limit reached");

    const previousDifficulty = this.ctx.storage.sql
      .exec<{ score: number }>("SELECT score FROM difficulty_votes WHERE voter_id = ?", voterId)
      .toArray()[0];

    this.ctx.storage.sql.exec(
      `INSERT INTO difficulty_votes (voter_id, score, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT (voter_id)
       DO UPDATE SET score = excluded.score, updated_at = excluded.updated_at`,
      voterId,
      difficulty,
      Date.now(),
    );
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    this.ctx.storage.sql.exec(
      "INSERT INTO questions (id, voter_id, text, nickname, lens, difficulty, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      id,
      voterId,
      cleanedText,
      cleanedNickname,
      lens,
      difficulty,
      createdAt,
    );
    this.ctx.storage.sql.exec(
      "INSERT INTO question_votes (question_id, voter_id, created_at) VALUES (?, ?, ?)",
      id,
      voterId,
      createdAt,
    );
    this.updateDifficultySnapshot(snapshot.difficulty, previousDifficulty?.score, difficulty);
    snapshot.questions.unshift({
      id,
      text: cleanedText,
      nickname: cleanedNickname,
      lens,
      difficulty,
      createdAt,
      upvotes: 1,
    });
    snapshot.questions = snapshot.questions.slice(0, 100);
    return this.broadcastSnapshot(this.touch(snapshot));
  }

  async setDifficulty(score: number, voterId: string): Promise<SessionSnapshot> {
    assertVoterId(voterId);
    assertDifficulty(score);
    const snapshot = await this.snapshot();
    const previous = this.ctx.storage.sql
      .exec<{ score: number }>("SELECT score FROM difficulty_votes WHERE voter_id = ?", voterId)
      .toArray()[0];
    this.ctx.storage.sql.exec(
      `INSERT INTO difficulty_votes (voter_id, score, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT (voter_id)
       DO UPDATE SET score = excluded.score, updated_at = excluded.updated_at`,
      voterId,
      score,
      Date.now(),
    );
    this.updateDifficultySnapshot(snapshot.difficulty, previous?.score, score);
    return this.broadcastSnapshot(this.touch(snapshot));
  }

  async upvote(questionId: string, voterId: string): Promise<SessionSnapshot> {
    assertVoterId(voterId);
    if (!isUuid(questionId)) throw new Error("invalid question");
    const snapshot = await this.snapshot();
    const exists = this.ctx.storage.sql
      .exec<{ count: number }>("SELECT COUNT(*) AS count FROM questions WHERE id = ?", questionId)
      .one();
    if (exists.count === 0) throw new Error("question not found");
    const priorVote = this.ctx.storage.sql
      .exec<{
        count: number;
      }>(
        "SELECT COUNT(*) AS count FROM question_votes WHERE question_id = ? AND voter_id = ?",
        questionId,
        voterId,
      )
      .one();
    this.ctx.storage.sql.exec(
      "INSERT OR IGNORE INTO question_votes (question_id, voter_id, created_at) VALUES (?, ?, ?)",
      questionId,
      voterId,
      Date.now(),
    );
    if (priorVote.count === 0) {
      const question = snapshot.questions.find((candidate) => candidate.id === questionId);
      if (question) question.upvotes += 1;
    }
    return this.broadcastSnapshot(this.touch(snapshot));
  }

  async react(kind: ReactionKind, voterId: string): Promise<{ ok: true }> {
    assertVoterId(voterId);
    if (!REACTION_KINDS.has(kind)) throw new Error("invalid reaction");
    const payload = JSON.stringify({
      type: "reaction",
      data: { id: crypto.randomUUID(), kind, createdAt: Date.now() },
    });
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(payload);
      } catch (error) {
        console.error(
          JSON.stringify({ message: "reaction broadcast failed", error: String(error) }),
        );
      }
    }
    return { ok: true };
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("expected websocket", { status: 426 });
    }
    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    pair[1].send(JSON.stringify({ type: "snapshot", data: await this.snapshot() }));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketMessage(socket: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (typeof message === "string" && message === "ping") socket.send("pong");
  }

  private touch(snapshot: SessionSnapshot): SessionSnapshot {
    snapshot.updatedAt = Date.now();
    this.snapshotCache = snapshot;
    return snapshot;
  }

  private updateDifficultySnapshot(
    snapshot: DifficultySnapshot,
    previousScore: number | undefined,
    nextScore: number,
  ): void {
    if (previousScore === nextScore) return;
    if (previousScore) snapshot.counts[previousScore - 1] -= 1;
    else snapshot.total += 1;
    snapshot.counts[nextScore - 1] += 1;
    const weighted = snapshot.counts.reduce((sum, count, index) => sum + count * (index + 1), 0);
    snapshot.average = snapshot.total ? Math.round((weighted / snapshot.total) * 10) / 10 : null;
  }

  private async broadcastSnapshot(snapshot?: SessionSnapshot): Promise<SessionSnapshot> {
    const currentSnapshot = snapshot ?? (await this.snapshot());
    const payload = JSON.stringify({ type: "snapshot", data: currentSnapshot });
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(payload);
      } catch (error) {
        console.error(
          JSON.stringify({ message: "websocket broadcast failed", error: String(error) }),
        );
      }
    }
    return currentSnapshot;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const requestId = crypto.randomUUID();
    try {
      if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }), request);
      if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

      const stub = env.SESSION.getByName(SESSION_NAME);
      if (url.pathname === "/api/live") {
        if (SESSION_CLOSED) return cors(jsonError("interaction closed", 410), request);
        return stub.fetch(request);
      }
      if (url.pathname === "/api/state" && request.method === "GET") {
        return cors(Response.json(await stub.snapshot()), request);
      }

      if (request.method !== "POST") return cors(jsonError("method not allowed", 405), request);
      if (SESSION_CLOSED) return cors(jsonError("interaction closed", 410), request);
      if (!isSmallJsonRequest(request)) return cors(jsonError("request too large", 413), request);
      const body: unknown = await request.json();
      if (!isRecord(body)) return cors(jsonError("invalid request", 400), request);

      if (url.pathname === "/api/vote") {
        if (
          typeof body.pollId !== "string" ||
          typeof body.optionIndex !== "number" ||
          typeof body.voterId !== "string"
        ) {
          return cors(jsonError("invalid vote", 400), request);
        }
        return cors(
          Response.json(await stub.vote(body.pollId, body.optionIndex, body.voterId)),
          request,
        );
      }

      if (url.pathname === "/api/question") {
        if (
          typeof body.text !== "string" ||
          typeof body.nickname !== "string" ||
          typeof body.lens !== "string" ||
          typeof body.difficulty !== "number" ||
          typeof body.voterId !== "string" ||
          !QUESTION_LENSES.has(body.lens as QuestionLens)
        ) {
          return cors(jsonError("invalid question", 400), request);
        }
        return cors(
          Response.json(
            await stub.ask(
              body.text,
              body.nickname,
              body.lens as QuestionLens,
              body.difficulty,
              body.voterId,
            ),
          ),
          request,
        );
      }

      if (url.pathname === "/api/difficulty") {
        if (typeof body.score !== "number" || typeof body.voterId !== "string") {
          return cors(jsonError("invalid difficulty", 400), request);
        }
        return cors(Response.json(await stub.setDifficulty(body.score, body.voterId)), request);
      }

      if (url.pathname === "/api/upvote") {
        if (typeof body.questionId !== "string" || typeof body.voterId !== "string") {
          return cors(jsonError("invalid upvote", 400), request);
        }
        return cors(Response.json(await stub.upvote(body.questionId, body.voterId)), request);
      }

      if (url.pathname === "/api/reaction") {
        if (
          typeof body.kind !== "string" ||
          typeof body.voterId !== "string" ||
          !REACTION_KINDS.has(body.kind as ReactionKind)
        ) {
          return cors(jsonError("invalid reaction", 400), request);
        }
        return cors(
          Response.json(await stub.react(body.kind as ReactionKind, body.voterId)),
          request,
        );
      }

      return cors(jsonError("not found", 404), request);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      const status = message.includes("limit") ? 429 : 400;
      console.error(
        JSON.stringify({
          message: "request failed",
          requestId,
          path: url.pathname,
          error: message,
        }),
      );
      return cors(jsonError(message, status), request);
    }
  },
} satisfies ExportedHandler<Env>;

function isSmallJsonRequest(request: Request): boolean {
  const length = Number(request.headers.get("content-length") ?? "0");
  return Number.isFinite(length) && length <= MAX_BODY_BYTES;
}

function cleanText(value: string, max: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function assertVoterId(voterId: string): void {
  if (!isUuid(voterId)) throw new Error("invalid voter");
}

function assertDifficulty(score: number): void {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("invalid difficulty");
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function jsonError(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

function cors(response: Response, request: Request): Response {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = origin === "https://mashbean.net" || origin.startsWith("http://localhost:");
  const headers = new Headers(response.headers);
  if (allowed) headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Vary", "Origin");
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
