import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const LAB_ROOT = path.resolve(ROOT, "..", "rag-lab");
const OUTPUT_DIR = LAB_ROOT;
const DATA_DIR = path.join(OUTPUT_DIR, "data");
const SESSIONS_DIR = path.join(OUTPUT_DIR, "sessions");
const EXPORTS_DIR = path.join(OUTPUT_DIR, "exports");
const worldviewPath = path.join(DATA_DIR, "worldview-profile.json");
const worldviewSchemaPath = path.join(DATA_DIR, "worldview-style-profile.schema.json");
const taxonomyPath = path.join(DATA_DIR, "feedback-taxonomy.json");
const sourcePolicyPath = path.join(DATA_DIR, "source-policy.json");
const htmlPath = path.join(OUTPUT_DIR, "index.html");

const worldview = {
  version: "2026-02-28",
  name: "Mashbean Editorial Worldview",
  language: "zh-TW",
  values: [
    {
      name: "人權與尊嚴",
      priority: 1,
      notes: "面對技術、治理與市場問題時，優先看弱勢者是否被壓縮。"
    },
    {
      name: "民主韌性",
      priority: 2,
      notes: "重視制度如何承受資訊戰、平台依賴與權力集中。"
    },
    {
      name: "反威權",
      priority: 3,
      notes: "對集權、軍工治理、監控資本主義與國家平台化保持警覺。"
    },
    {
      name: "言論自由與開放網路",
      priority: 4,
      notes: "偏好開放協作、可攜性、可驗證與抗審查基礎設施。"
    },
    {
      name: "制度設計",
      priority: 5,
      notes: "避免只做情緒表態，盡量把評論拉回規則、誘因與公共性。"
    }
  ],
  stanceBoundaries: {
    avoid: [
      "把威權效率當成中性管理工具",
      "未經查證的人身指控",
      "把複雜政治議題降成二元陣營叫喊",
      "為了立場正確而忽略制度成本",
      "將弱者處境視為可接受的附帶損害"
    ],
    require: [
      "對敏感指控保持保守與可核實",
      "人物負面描述需聚焦可驗證行為",
      "政策評論要標示不確定性與副作用",
      "避免把猜測寫成既定事實"
    ]
  },
  toneRules: {
    politics: "克制但有稜角，允許冷幽默、反差與制度性吐槽。",
    preferred: ["制度設計", "公共性", "治理", "韌性", "荒謬", "反差", "協作", "去中心"],
    avoid: ["絕對化必勝語氣", "貼標籤式羞辱", "無證據的陰謀論措辭", "把所有問題都推給單一壞人"]
  },
  controls: {
    stanceStrength: 2,
    confrontation: 1,
    satire: 2
  },
  styleControls: {
    humorStrength: 2,
    abstraction: 2,
    colloquiality: 2,
    academicDensity: 1
  },
  syntaxProfile: {
    sentenceLengthMix: "短中句為主，穿插少量長句做轉折與補充。",
    parentheticalUsage: "可用括號補小笑點、補專名、補語境，但不要每段都塞。",
    rhetoricalQuestions: "可用於轉折或吐槽，不宜連發。",
    closingHabit: "句尾偏向收斂，留一點反身思考，不做空泛大總結。"
  },
  paragraphProfile: {
    averageParagraphLength: "中短段為主，遇到轉折可單獨切段。",
    openingMove: "常從觀察、場景或荒謬感切入，再往制度或價值推進。",
    development: "從事件表層拉回制度設計、權力結構與副作用。",
    endingMove: "最後回到價值排序或問題意識，而非直接下口號。"
  },
  humorProfile: {
    primaryMechanisms: ["反差", "冷面吐槽", "制度性荒謬", "輕微自嘲"],
    avoid: ["為搞笑而誇大事實", "惡意羞辱", "大量網路流行語堆砌"],
    taiwaneseMemeBoundary: "可點到為止地用台灣網路語感，但不能讓文章變成梗圖字幕。"
  },
  lexiconProfile: {
    preferred: ["公共性", "制度設計", "韌性", "治理", "協作", "荒謬", "去中心", "權力關係"],
    avoid: ["高大上", "正能量", "閉環", "賦能", "顛覆式創新", "贏麻了"],
    substitutions: {
      信息: "資訊",
      視頻: "影片",
      網絡: "網路",
      質量: "品質",
      視角: "視角/角度需依語境選擇"
    }
  },
  zhTwUsageProfile: {
    locale: "繁體中文（台灣用語）",
    punctuation: "偏好全形標點；破折與括號可用，但節制。",
    englishMixing: "專有名詞與術語可保留英文，但第一次出現應有中文語境。",
    translationPreference: "政策與技術名詞以台灣常用譯法優先，必要時保留原文。",
    avoidChinaUsage: ["信息", "視頻", "算法", "質量", "互聯網", "生態位"]
  },
  registerProfile: {
    formal: "用於評論、制度分析、公共政策議題。",
    semiFormal: "用於一般專欄與帶敘事的評論。",
    colloquial: "用於臉書式短文與人稱觀察。",
    inJokeBoundary: "社群內梗可以點一下，但不能讓外部讀者完全失去理解。"
  },
  argumentationProfile: {
    commonMoves: [
      "先從具體觀察切入",
      "指出反差或荒謬",
      "回到制度設計與權力分配",
      "補上副作用與不確定性",
      "最後回到價值排序"
    ],
    avoid: ["先喊立場再補理由", "只有情緒判決沒有分析", "裝中立而模糊價值排序"]
  },
  motifProfile: {
    recurringThemes: ["民主韌性", "反威權", "公共網路", "數位身分", "制度設計", "第三空間", "分散式協作", "技術與文化交會"],
    recurringImages: ["荒謬的制度場景", "表面中性的技術語言", "被代價壓到的弱勢位置"]
  },
  audienceAdaptation: {
    general: "降低術語密度，保留清楚例子。",
    policy: "提高制度與治理分析比重。",
    technical: "允許更多技術名詞，但仍要回到社會影響。",
    community: "可加一點熟人語感，但不能只剩圈內話。"
  },
  sensitiveTopics: {
    allegations: "以可核實資料為主，明示來源與不確定性。",
    unverifiedInfo: "除非用來描述傳聞本身，否則不當成事實引用。",
    negativeDescriptions: "描述行為、制度效果與公開紀錄，不推斷內心動機。"
  },
  referenceBehavior: {
    sourceDisclosure: "涉及事實判斷時，優先交代來源或至少標示依據類型。",
    uncertaintyHandling: "來源不足時，要把不確定性寫出來。",
    retrievalUsage: "retrieval 片段是參照，不直接拼貼成文。"
  },
  antiPatterns: [
    "AI 味總結",
    "流水帳政策簡報腔",
    "過度平衡到失去價值判斷",
    "空泛雞湯式收尾",
    "網路梗過量",
    "把猜測寫成結論"
  ],
  evaluationLabels: ["中立過頭", "用語過激", "框架不對", "價值排序錯", "事實斷言過猛", "把猜測當結論"]
};

const worldviewSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "mashbean://rag-lab/worldview-style-profile.schema.json",
  title: "WorldviewStyleProfile",
  type: "object",
  required: [
    "version",
    "name",
    "language",
    "values",
    "stanceBoundaries",
    "toneRules",
    "controls",
    "styleControls",
    "syntaxProfile",
    "paragraphProfile",
    "humorProfile",
    "lexiconProfile",
    "zhTwUsageProfile",
    "registerProfile",
    "argumentationProfile",
    "motifProfile",
    "audienceAdaptation",
    "sensitiveTopics",
    "referenceBehavior",
    "antiPatterns",
    "evaluationLabels"
  ],
  properties: {
    version: { type: "string" },
    name: { type: "string" },
    language: { type: "string" },
    values: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "priority", "notes"],
        properties: {
          name: { type: "string" },
          priority: { type: "integer" },
          notes: { type: "string" }
        }
      }
    },
    stanceBoundaries: { type: "object" },
    toneRules: { type: "object" },
    controls: { type: "object" },
    styleControls: { type: "object" },
    syntaxProfile: { type: "object" },
    paragraphProfile: { type: "object" },
    humorProfile: { type: "object" },
    lexiconProfile: { type: "object" },
    zhTwUsageProfile: { type: "object" },
    registerProfile: { type: "object" },
    argumentationProfile: { type: "object" },
    motifProfile: { type: "object" },
    audienceAdaptation: { type: "object" },
    sensitiveTopics: { type: "object" },
    referenceBehavior: { type: "object" },
    antiPatterns: { type: "array", items: { type: "string" } },
    evaluationLabels: { type: "array", items: { type: "string" } }
  }
};

const sourcePolicy = {
  version: "2026-02-28",
  allowedCollections: ["blog", "facebook"],
  counts: {
    blog: 191,
    facebook: 976
  },
  totalDocuments: 1167,
  note: "只使用精選文章與臉書文章，不納入其他篇。",
  enforcement: {
    corpusBuild: "scripts/build-rag-corpus.mjs 只掃描 src/content/blog 與 src/content/facebook",
    goldSelection: "gold set candidates 只從 corpus 中這兩個 collection 挑選"
  }
};

const taxonomy = {
  editReasons: ["用字", "句法", "節奏", "幽默", "結構", "立場", "世界觀", "資料正確性", "語氣尺度"],
  driftTypes: ["無", "中立過頭", "用語過激", "框架不對", "價值排序錯", "事實斷言過猛"],
  trainabilityReasons: ["含未核實資訊", "涉及一次性時事脈絡", "私人內容不適合訓練", "草稿本身失真太多", "可直接納入"]
};

const html = String.raw`<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>自動豆泥腦</title>
    <style>
      :root {
        --bg: #faf7ef;
        --ink: #18262d;
        --muted: #61737d;
        --accent: #0d7a67;
        --accent-soft: #dff4eb;
        --line: #d7e1da;
        --panel: rgba(255, 255, 255, 0.94);
        --warm: #f5ead2;
        --track: #a8cbbf;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Noto Sans TC", "PingFang TC", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at 10% 0%, rgba(217, 244, 238, 0.9), transparent 32%),
          radial-gradient(circle at 90% 10%, rgba(255, 238, 195, 0.8), transparent 28%),
          var(--bg);
        line-height: 1.7;
      }
      h1, h2, h3 { font-family: "Noto Serif TC", "PingFang TC", serif; }
      .shell {
        width: min(1320px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 24px 0 48px;
        display: grid;
        gap: 24px;
      }
      .hero, .panel {
        border: 1px solid var(--line);
        border-radius: 22px;
        background: var(--panel);
        box-shadow: 0 24px 50px rgba(19, 36, 47, 0.06);
      }
      .hero {
        padding: 24px;
        display: grid;
        gap: 20px;
        grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
      }
      .eyebrow {
        margin: 0;
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--accent);
      }
      .hero h1, .panel h2 { margin: 0; }
      .hero h1 { font-size: clamp(34px, 6vw, 56px); line-height: 1.05; }
      .hero-copy { display: grid; gap: 12px; }
      .hero-lead { font-size: 18px; max-width: 36ch; margin: 0; }
      .hero-aside { display: grid; gap: 12px; align-content: start; }
      .grid {
        display: grid;
        gap: 20px;
      }
      .workflow {
        position: relative;
        display: grid;
        gap: 24px;
        padding-left: 56px;
      }
      .workflow-line {
        position: absolute;
        left: 18px;
        top: 8px;
        bottom: 8px;
        width: 2px;
        background:
          linear-gradient(to bottom, rgba(13, 122, 103, 0.18), rgba(13, 122, 103, 0.7), rgba(13, 122, 103, 0.18));
      }
      .workflow-stage {
        position: relative;
      }
      .workflow-stage::before {
        content: "";
        position: absolute;
        left: -46px;
        top: 26px;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        background: var(--accent);
        box-shadow: 0 0 0 6px rgba(13, 122, 103, 0.12);
      }
      .panel {
        padding: 20px;
      }
      .panel-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        align-items: end;
      }
      .muted { color: var(--muted); }
      .hero-meta {
        display: grid;
        gap: 10px;
      }
      .stats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .stats > div {
        border: 1px solid var(--line);
        background: rgba(255,255,255,0.85);
        border-radius: 16px;
        padding: 10px 12px;
      }
      .stats dt { color: var(--muted); font-size: 12px; }
      .stats dd { margin: 4px 0 0; font-size: 16px; font-family: "JetBrains Mono", monospace; }
      form, .form-grid, .stack { display: grid; gap: 12px; }
      .form-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      label, fieldset { display: grid; gap: 6px; }
      fieldset {
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 14px;
        margin: 0;
      }
      input, textarea, select, button {
        font: inherit;
      }
      input[type="text"], input[type="number"], textarea, select {
        width: 100%;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid #c9d8d2;
        background: #fff;
        color: var(--ink);
      }
      textarea { min-height: 100px; resize: vertical; }
      input[type="range"] {
        width: 100%;
        accent-color: var(--accent);
      }
      button {
        cursor: pointer;
        border-radius: 999px;
        border: 1px solid #b8cdc5;
        background: #f8fcfb;
        color: var(--ink);
        padding: 10px 16px;
      }
      button.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }
      button.danger {
        color: #8e2d2d;
        background: #fff6f6;
        border-color: #dbb8b8;
      }
      .actions, .chips, .meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
      .pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 4px 10px;
        background: #edf6f3;
        font-size: 12px;
      }
      .card {
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 16px;
        background: #fffefb;
      }
      .results, .session-list {
        display: grid;
        gap: 12px;
      }
      .draft-columns {
        display: grid;
        gap: 16px;
      }
      .control-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .control-card {
        border: 1px solid var(--line);
        border-radius: 18px;
        background: linear-gradient(180deg, #fff, #fbf8ef);
        padding: 14px;
      }
      .control-card strong {
        font-size: 15px;
      }
      .microcopy {
        margin: 0;
        color: var(--muted);
        font-size: 13px;
      }
      .compact {
        font-size: 13px;
        color: var(--muted);
      }
      .compare-card {
        background: linear-gradient(180deg, #fffef8, #f7fcfa);
      }
      .comment-box {
        display: grid;
        gap: 10px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed var(--line);
      }
      .comment-box textarea {
        min-height: 90px;
      }
      .comment-suggestion {
        border-radius: 12px;
        background: var(--accent-soft);
        padding: 10px 12px;
        font-size: 13px;
      }
      .workflow-note {
        display: grid;
        gap: 10px;
      }
      .export-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .export-card p {
        margin: 0;
      }
      .editor {
        display: grid;
        gap: 16px;
      }
      .editor-grid {
        display: grid;
        gap: 16px;
      }
      pre, .readonly {
        margin: 0;
        white-space: pre-wrap;
        background: #f7fbfa;
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 14px;
        min-height: 320px;
        overflow: auto;
      }
      .diff { display: grid; gap: 6px; }
      .diff-line {
        border-radius: 10px;
        padding: 8px 10px;
        white-space: pre-wrap;
      }
      .same { background: #f5f8f7; }
      .add { background: #edf9f1; }
      .remove { background: #fff1f1; }
      .chip-option {
        position: relative;
        cursor: pointer;
      }
      .chip-option input {
        position: absolute;
        inset: 0;
        opacity: 0;
      }
      .chip-option span {
        display: inline-flex;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 10px;
        background: #eef5f2;
        font-size: 13px;
      }
      .chip-option input:checked + span {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }
      @media (min-width: 1024px) {
        .draft-columns,
        .editor-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 700px) {
        .hero,
        .control-grid,
        .export-grid,
        .form-grid.two {
          grid-template-columns: 1fr;
        }
        .workflow {
          padding-left: 28px;
        }
        .workflow-stage::before {
          left: -22px;
        }
        .workflow-line {
          left: 6px;
        }
        .panel-head {
          flex-direction: column;
          align-items: start;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div class="hero-copy">
          <div>
            <p class="eyebrow">Writing System</p>
            <h1>自動豆泥腦</h1>
          </div>
          <p class="hero-lead">目標是讓 AI 生成的豆泥文體越來越像豆泥本人。</p>
          <div class="workflow-note">
            <div class="card">
              <strong>目前工作流</strong>
              <p class="compact">先生成兩篇候選稿，再做對照、評論、改稿，最後決定哪些回饋要進訓練資料。</p>
            </div>
          </div>
        </div>
        <aside class="hero-aside">
          <div class="card">
            <strong>風格設定</strong>
            <div id="worldview-summary" class="stack" style="margin-top:10px;"></div>
          </div>
          <div class="hero-meta">
            <dl class="stats">
              <div><dt>語料文件</dt><dd id="stat-docs">-</dd></div>
              <div><dt>切段數</dt><dd id="stat-chunks">-</dd></div>
              <div><dt>世界觀版本</dt><dd id="stat-worldview">-</dd></div>
            </dl>
          </div>
        </aside>
      </section>

      <div class="workflow">
        <div class="workflow-line"></div>
        <section class="panel workflow-stage">
          <div class="panel-head">
            <div>
              <p class="eyebrow">A</p>
              <h2>生成介面</h2>
            </div>
            <p class="muted">先把題目、素材與觀察整理好，再生成兩篇可對照的候選稿。</p>
          </div>

          <form id="draft-form">
            <label><span>主題</span><input name="topic" type="text" required placeholder="例如：數位身分錢包的公共性困境" /></label>
            <label><span>內容 / 素材</span><textarea name="material" placeholder="事件背景、引文、要點"></textarea></label>
            <label><span>觀察</span><textarea name="observation" placeholder="反差、洞見、好笑的點"></textarea></label>
            <label><span>連結</span><textarea name="links" placeholder="每行一個網址"></textarea></label>

            <div class="form-grid two">
              <label><span>文體</span><select name="style"><option>小品文</option><option>評論</option><option>敘事</option><option>科普</option></select></label>
              <label><span>長度</span><select name="length"><option>800-1200</option><option>1200-1800</option><option>1800-2600</option></select></label>
              <label><span>讀者設定</span><select name="reader"><option>一般讀者</option><option>政策圈</option><option>技術圈</option><option>社群內梗</option></select></label>
              <label><span>語言</span><select name="language"><option>繁體中文（台灣用語）</option></select></label>
              <label><span>取回片段 k</span><input name="k" type="number" min="3" max="18" value="8" /></label>
              <label><span>偏好文章</span><select name="articlePreference"><option>同文體優先</option><option>同主題優先</option><option>同年代優先</option><option selected>平均混搭</option></select></label>
            </div>
            <div class="control-grid">
              <div class="control-card">
                <strong>幽默強度 <span id="humor-display">2 / 3</span></strong>
                <input name="humor" id="humor-range" type="range" min="0" max="3" step="1" value="2" />
                <p class="microcopy">0 是完全收斂，3 是明顯反差與吐槽。若你想先把文風調穩，建議從 1 或 2 開始。</p>
              </div>
              <div class="control-card">
                <strong>立場強度 <span id="stance-display">2 / 3</span></strong>
                <input name="stance" id="stance-range" type="range" min="0" max="3" step="1" value="2" />
                <p class="microcopy">0 比較觀察式，3 比較尖銳。這個旋鈕主要影響價值排序與語氣稜角，不等於情緒化。</p>
              </div>
            </div>
            <label><input name="allowClosing" type="checkbox" checked /> 允許取回結尾段落做節奏參考</label>
            <div class="actions">
              <button class="primary" type="submit">生成 2 篇草稿</button>
              <button type="button" id="reroll">固定材料換角度</button>
            </div>
          </form>
          <p id="draft-status" class="muted">尚未生成草稿。</p>
          <div id="draft-comparison" class="stack" style="margin-bottom:12px;"></div>
          <div id="draft-results" class="results draft-columns"></div>
        </section>

        <section class="panel workflow-stage editor">
          <div class="panel-head">
            <div>
              <p class="eyebrow">B</p>
              <h2>改稿介面</h2>
            </div>
            <p class="muted">左邊放你的改稿版本，右邊保留 AI 生成稿，方便直接對照。</p>
          </div>
          <div class="editor-grid">
            <article class="card">
              <h3>你的改稿版本</h3>
              <textarea id="revision-text"></textarea>
            </article>
            <article class="card">
              <h3>AI 生成稿</h3>
              <p id="draft-meta" class="muted">尚未選擇草稿。</p>
              <pre id="draft-text">請先從上方把草稿送進來。</pre>
            </article>
          </div>
          <div class="card">
            <div class="panel-head">
              <h3>修改痕跡</h3>
              <button type="button" id="copy-draft">先把 AI 生成稿複製到左邊</button>
            </div>
            <div id="diff-view" class="diff"></div>
          </div>
          <form id="feedback-form" class="form-grid two">
            <fieldset>
              <legend>改動理由標籤</legend>
              <div id="reason-list" class="chips"></div>
            </fieldset>
            <fieldset>
              <legend>世界觀一致性</legend>
              <label><span>評分</span><select name="worldviewScore"><option>5</option><option selected>4</option><option>3</option><option>2</option><option>1</option></select></label>
              <label><span>偏差類型</span><select id="drift-type" name="driftType"></select></label>
            </fieldset>
            <fieldset>
              <legend>訓練資料</legend>
              <label><span>是否納入訓練</span><select name="trainable"><option value="yes">可</option><option value="no">不可</option></select></label>
              <label><span>原因</span><select id="trainability-reason" name="trainabilityReason"></select></label>
            </fieldset>
            <div class="actions">
              <button class="primary" type="submit">提交改稿回饋</button>
              <span id="feedback-status" class="muted">尚未提交任何改稿。</span>
            </div>
          </form>
        </section>

        <section class="panel workflow-stage">
          <div class="panel-head">
            <div>
              <p class="eyebrow">C</p>
              <h2>匯出與訓練資料</h2>
            </div>
          </div>
          <div class="export-grid">
            <article class="card export-card">
              <strong>Session JSON</strong>
              <p class="compact">把你目前在介面裡做過的所有草稿、改稿與標記完整存出去。最適合備份與人工檢查。</p>
            </article>
            <article class="card export-card">
              <strong>SFT JSONL</strong>
              <p class="compact">把「指令 -> 你改完的版本」整理成訓練資料。如果你只想先做 supervised fine-tuning，通常先按這個。</p>
            </article>
            <article class="card export-card">
              <strong>Preference JSONL</strong>
              <p class="compact">把「AI 初稿 vs 你修完的版本」整理成偏好資料。適合後續做 chosen / rejected 類型的訓練。</p>
            </article>
          </div>
          <div class="actions" style="margin-top:12px;">
            <button type="button" id="export-sessions">匯出 Session JSON</button>
            <button type="button" id="export-sft">匯出 SFT JSONL</button>
            <button type="button" id="export-preference">匯出 Preference JSONL</button>
            <button type="button" id="clear-sessions" class="danger">清空本地 session</button>
          </div>
          <div id="training-summary" class="stack" style="margin-top:12px;"></div>
          <div id="session-list" class="session-list" style="margin-top:12px;"></div>
        </section>
      </div>
    </main>

    <script>
      const ANGLES = ["反差開場", "制度拆解"];
      const state = { corpus: null, worldview: null, taxonomy: null, lastInput: null, activeDraft: null, draftSeed: 0, sessions: [], lastComparison: null, draftMode: "idle", retrievalMode: "server", lastSuitability: null, lastValidation: null, draftComments: {} };

      const byId = (id) => document.getElementById(id);
      const escapeHTML = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
      const tokenize = (text) => {
        const lowered = String(text).toLowerCase();
        const latin = lowered.match(/[a-z0-9][a-z0-9_-]{1,}/g) || [];
        const cjk = lowered.match(/[\u3400-\u9fff]{2,}/g) || [];
        return [...new Set([...latin, ...cjk])];
      };
      async function apiJSON(url, options) {
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          ...options
        });
        if (!response.ok) {
          let payload = null;
          let detail = "";
          try {
            payload = await response.json();
            detail = payload.error ? ": " + payload.error : payload.hint ? ": " + payload.hint : "";
          } catch {}
          const error = new Error("API " + response.status + " " + url + detail);
          error.status = response.status;
          error.code = payload?.code || null;
          error.noFallback = Boolean(payload?.noFallback || response.status === 422);
          error.details = payload;
          throw error;
        }
        return response.json();
      }

      async function loadSessions() {
        const payload = await apiJSON("./api/sessions");
        state.sessions = payload.sessions || [];
        return state.sessions;
      }

      async function saveSession(session) {
        await apiJSON("./api/sessions", {
          method: "POST",
          body: JSON.stringify(session)
        });
        state.sessions.push(session);
      }

      async function clearSessionsRemote() {
        const payload = await apiJSON("./api/sessions", { method: "DELETE" });
        state.sessions = payload.sessions || [];
      }

      async function generateDraftsRemote(input) {
        return apiJSON("./api/draft", {
          method: "POST",
          body: JSON.stringify(input)
        });
      }

      function readInput() {
        const form = byId("draft-form");
        const data = new FormData(form);
        return {
          topic: String(data.get("topic") || "").trim(),
          material: String(data.get("material") || "").trim(),
          observation: String(data.get("observation") || "").trim(),
          links: String(data.get("links") || "").split("\n").map((line) => line.trim()).filter(Boolean),
          style: String(data.get("style") || "小品文"),
          length: String(data.get("length") || "800-1200"),
          humor: Number(data.get("humor") || 2),
          stance: Number(data.get("stance") || 2),
          reader: String(data.get("reader") || "一般讀者"),
          language: String(data.get("language") || "繁體中文（台灣用語）"),
          k: Number(data.get("k") || 8),
          articlePreference: String(data.get("articlePreference") || "平均混搭"),
          allowClosing: data.get("allowClosing") === "on"
        };
      }

      function worldviewCheck(text, input) {
        const bannedTerms = (state.worldview?.toneRules.avoid || []).filter((term) => text.includes(term));
        return {
          bannedTerms,
          humorMechanism: input.humor >= 3 ? "反差 + 吐槽" : input.humor >= 2 ? "反差" : input.humor === 1 ? "輕微吐槽" : "節制",
          stanceStrength: input.stance
        };
      }

      function syncRangeDisplays() {
        const humor = byId("humor-range");
        const stance = byId("stance-range");
        if (humor) byId("humor-display").textContent = humor.value + " / 3";
        if (stance) byId("stance-display").textContent = stance.value + " / 3";
      }

      function suggestCommentTarget(comment) {
        const text = String(comment || "").trim();
        if (!text) return null;
        if (/抓錯|參考|引用|片段|偏題|資料|事實|不相關/.test(text)) {
          return { target: "retrieval / facts", reason: "這條評論比較像是在說取回素材、引用依據或事實 grounding 出了問題。" };
        }
        if (/語氣|口氣|幽默|節奏|句子|文風|不像我|收尾|開頭|段落/.test(text)) {
          return { target: "generation prompt", reason: "這條評論直接指向文風、節奏或敘事方式，通常該先修 prompt 與 style 指令。" };
        }
        if (/立場|價值|框架|政治|世界觀|排序/.test(text)) {
          return { target: "worldview profile", reason: "這條評論像是在說價值排序或立場邊界要調整，應回到 worldview 設定。" };
        }
        if (/太嚴|太鬆|被擋|誤判|污染/.test(text)) {
          return { target: "validator / judge", reason: "這條評論比較像是在指出驗證或判斷規則過嚴、過鬆。" };
        }
        return { target: "generation prompt", reason: "目前看起來先從 prompt 調整最划算，再決定要不要回頭改其他層。" };
      }

      function likenessScore(draft) {
        const referenceBoost = draft.references.reduce((sum, ref) => {
          let score = sum;
          if (ref.document.collection === "blog") score += 1.2;
          if (ref.document.era === "recent") score += 0.6;
          if (["essay", "commentary", "micro-essay"].includes(ref.document.contentType)) score += 0.5;
          return score;
        }, 0);
        const worldviewPenalty = draft.worldviewCheck.bannedTerms.length * 4;
        const humorFit = draft.input.humor === (state.worldview?.styleControls?.humorStrength ?? 2) ? 1.5 : 0.8;
        const stanceFit = draft.input.stance === (state.worldview?.controls?.stanceStrength ?? 2) ? 1.5 : 0.8;
        return Number((referenceBoost + humorFit + stanceFit - worldviewPenalty).toFixed(2));
      }

      function renderComparison(candidates) {
        const target = byId("draft-comparison");
        if (!target) return;
        if (state.lastComparison && candidates && candidates.length >= 2) {
          const winner = candidates[state.lastComparison.winnerIndex ?? 0] ?? candidates[0];
          target.innerHTML =
            "<div class='card compare-card'><strong>比較服務</strong><p>目前比較像豆泥的是「" + escapeHTML(winner.title) +
            "」。理由：" + escapeHTML(state.lastComparison.rationale || "未提供") + "</p><p>" +
            ((state.lastComparison.criteria || []).map((item) => "• " + escapeHTML(item)).join("<br />")) +
            "</p><p><small>模式：" + escapeHTML(state.draftMode) + " / retrieval: " + escapeHTML(state.retrievalMode) + "</small></p></div>";
          return;
        }
        if (!candidates || candidates.length < 2) {
          target.innerHTML = "";
          return;
        }
        const ranked = candidates
          .map((draft) => ({ draft, score: likenessScore(draft) }))
          .sort((left, right) => right.score - left.score);
        const winner = ranked[0];
        const runnerUp = ranked[1];
        target.innerHTML =
          "<div class='card compare-card'><strong>比較服務</strong><p>目前判定比較像豆泥的是「" + escapeHTML(winner.draft.title) +
          "」。兩篇差異主要在：論證收束、引用素材的貼題度、以及語氣稜角。暫時計分 " + winner.score.toFixed(2) + " vs " + runnerUp.score.toFixed(2) +
          "。</p><p><small>模式：" + escapeHTML(state.draftMode) + " / retrieval: " + escapeHTML(state.retrievalMode) + "</small></p></div>";
      }

      function renderWorldview() {
        byId("worldview-summary").innerHTML = [
          "<div class='card'><strong>價值排序</strong><p>" + state.worldview.values.map((item) => item.priority + ". " + item.name).join(" / ") + "</p></div>",
          "<div class='card'><strong>政治語氣</strong><p>" + escapeHTML(state.worldview.toneRules.politics) + "</p></div>",
          "<div class='card'><strong>避免框架</strong><p>" + state.worldview.stanceBoundaries.avoid.join("、") + "</p></div>",
          "<div class='card'><strong>敏感主題規則</strong><p>" + Object.values(state.worldview.sensitiveTopics).join(" ") + "</p></div>"
        ].join("");
      }

      function loadDraftIntoEditor(draft) {
        state.activeDraft = draft;
        byId("draft-text").textContent = draft.text;
        byId("draft-meta").textContent = draft.title + "｜" + draft.input.style + "｜幽默 " + draft.input.humor + "｜立場 " + draft.input.stance;
        byId("revision-text").value = draft.text;
        renderDiff(draft.text, draft.text);
      }

      function renderReferenceNotes(referenceNotes) {
        if (!referenceNotes || !referenceNotes.length) {
          return "<p class='muted'>這次沒有 server 端 writing notes；若是 fallback 草稿，這是預期行為。</p>";
        }
        return referenceNotes.map((note) =>
          "<article class='card'><strong>" + escapeHTML(note.title) + "</strong><div class='meta'>" +
          "<span class='pill'>" + escapeHTML(note.source) + "</span>" +
          (note.anchorTypes || []).map((anchor) => "<span class='pill'>" + escapeHTML(anchor) + "</span>").join("") +
          "<span class='pill'>lexical " + Number(note.lexicalScore || 0).toFixed(2) + "</span>" +
          "<span class='pill'>semantic " + Number(note.semanticScore || 0).toFixed(2) + "</span></div>" +
          "<p><strong>可借用：</strong>" + escapeHTML(note.styleRole) + " " + escapeHTML(note.structureCue) + "</p>" +
          "<p><strong>與本題相接：</strong>" + escapeHTML(note.overlapCue) + "</p>" +
          "<p><strong>注意：</strong>" + escapeHTML(note.caution) + "</p></article>"
        ).join("");
      }

      function renderScoreBreakdown(ref) {
        if (!ref.scoreBreakdown) return "";
        const parts = ref.scoreBreakdown.preferenceParts || {};
        const anchorBreakdown = parts.anchorBreakdown || {};
        const documentBreakdown = parts.documentBreakdown || {};
        return "<p><strong>排序拆解：</strong>" +
          "overlap " + Number(ref.scoreBreakdown.overlap || 0).toFixed(2) +
          " / title " + Number(ref.scoreBreakdown.titleBoost || 0).toFixed(2) +
          " / tags " + Number(ref.scoreBreakdown.tagBoost || 0).toFixed(2) +
          " / semantic " + Number(ref.scoreBreakdown.semanticBoost || 0).toFixed(2) +
          " / preference " + Number(ref.scoreBreakdown.preferenceBoost || 0).toFixed(2) +
          "<br />anchor: style " + Number(anchorBreakdown.style_anchor || 0).toFixed(2) +
          " / worldview " + Number(anchorBreakdown.worldview_anchor || 0).toFixed(2) +
          " / humor " + Number(anchorBreakdown.humor_anchor || 0).toFixed(2) +
          " / argument " + Number(anchorBreakdown.argument_anchor || 0).toFixed(2) +
          "<br />document: contentType " + Number(documentBreakdown.contentType || 0).toFixed(2) +
          " / era " + Number(documentBreakdown.era || 0).toFixed(2) +
          " / position " + Number(documentBreakdown.position || 0).toFixed(2) +
          "</p>";
      }

      function renderDiagnostics() {
        const target = byId("draft-comparison");
        if (!target) return;
        const blocks = [];
        if (state.lastSuitability) {
          const suitability = state.lastSuitability;
          blocks.push(
            "<details class='card'><summary><strong>診斷備註</strong></summary><p style='margin-top:12px;'>" +
            "sensitive topic: " + (suitability.sensitiveTopic ? "是" : "否") +
            " / grounding: " + (suitability.hasGrounding ? "有" : "不足") +
            " / strong refs: " + Number(suitability.strongReferenceCount || 0) +
            " / lexical: " + Number(suitability.lexicalAverage || 0).toFixed(3) +
            " / semantic: " + Number(suitability.semanticAverage || 0).toFixed(3) +
            "</p><p>" + ((suitability.reasons || []).length ? suitability.reasons.map((reason) => "• " + escapeHTML(reason)).join("<br />") : "• 目前看起來可進入生稿。") +
            "</p></details>"
          );
        }
        if (state.lastValidation) {
          const summary = (state.lastValidation.reports || []).map((report) => {
            const label = "Draft " + (Number(report.index) + 1);
            const body = report.ok ? "通過污染檢查。" : (report.reasons || []).map((reason) => "• " + escapeHTML(reason)).join("<br />");
            return "<article class='card'><strong>" + label + "</strong><p>" + body + "</p></article>";
          }).join("");
          blocks.push("<details class='card'><summary><strong>草稿檢查</strong></summary><div class='stack' style='margin-top:12px;'>" + summary + "</div></details>");
        }
        if (!blocks.length) {
          target.innerHTML = "";
          return;
        }
        const comparisonHtml = target.innerHTML;
        target.innerHTML = blocks.join("") + comparisonHtml;
      }

      function renderDrafts(candidates) {
        byId("draft-status").textContent = "已生成 " + candidates.length + " 篇草稿。";
        renderComparison(candidates);
        renderDiagnostics();
        byId("draft-results").innerHTML = candidates.map((draft, index) => {
          const draftWorldviewCheck = draft.worldviewCheck || worldviewCheck(draft.text || "", draft.input || state.lastInput || readInput());
          const validationReport = (draft.validationReport || {});
          const validationSummary = validationReport.ok === false
            ? "<span class='pill'>污染警示 " + escapeHTML((validationReport.reasons || []).slice(0, 2).join(" / ")) + "</span>"
            : "<span class='pill'>檢查通過</span>";
          const warnings = [
            "<span class='pill'>禁用詞 " + draftWorldviewCheck.bannedTerms.length + "</span>",
            "<span class='pill'>立場強度 " + draftWorldviewCheck.stanceStrength + "</span>",
            "<span class='pill'>幽默機制 " + draftWorldviewCheck.humorMechanism + "</span>",
            validationSummary
          ].join("");
          const commentState = state.draftComments[draft.id] || {};
          const suggestion = suggestCommentTarget(commentState.comment || "");
          return "<article class='card' data-index='" + index + "'>" +
            "<div class='panel-head'><div><h3>" + escapeHTML(draft.title) + "</h3><div class='meta'>" +
            "<span class='pill'>" + escapeHTML(draft.input.style) + "</span>" +
            "<span class='pill'>" + escapeHTML(draft.input.reader) + "</span>" +
            "<span class='pill'>" + escapeHTML(draft.angle) + "</span>" +
            "</div></div><div class='meta'>" + warnings + "</div></div>" +
            "<pre class='readonly'>" + escapeHTML(draft.text) + "</pre>" +
            "<details class='card' style='margin-top:12px;'><summary>寫作筆記 (" + ((draft.referenceNotes || []).length) + ")</summary><div class='stack' style='margin-top:12px;'>" +
            renderReferenceNotes(draft.referenceNotes) +
            "</div></details>" +
            "<details class='card' style='margin-top:12px;'><summary>參考片段 (" + draft.references.length + ")</summary><div class='stack' style='margin-top:12px;'>" +
            draft.references.map((ref) => "<article class='card'><strong>" + escapeHTML(ref.document.title) + "</strong><div class='meta'>" +
              "<span class='pill'>" + escapeHTML(ref.document.collection) + "</span>" +
              "<span class='pill'>" + escapeHTML(ref.document.contentType) + "</span>" +
              "<span class='pill'>" + escapeHTML(ref.chunk.position) + "</span>" +
              "<span class='pill'>score " + ref.score.toFixed(2) + "</span>" +
              "<span class='pill'>lexical " + Number(ref.lexicalScore || 0).toFixed(2) + "</span>" +
              "<span class='pill'>semantic " + Number(ref.semanticScore || 0).toFixed(2) + "</span></div>" + renderScoreBreakdown(ref) + "<p>" + escapeHTML(ref.chunk.text) + "</p><small>" + escapeHTML(ref.document.filepath) + "</small></article>").join("") +
            "</div></details>" +
            "<details class='card' style='margin-top:12px;'><summary>生成 prompt</summary><pre class='readonly' style='margin-top:12px; min-height:0;'>" + escapeHTML(draft.prompt || "目前沒有保存 prompt。") + "</pre></details>" +
            "<div class='comment-box'><strong>評論：哪裡不像豆泥本人？</strong><textarea class='draft-comment' data-draft-id='" + escapeHTML(draft.id) + "' placeholder='例如：第二段太像政策簡報，不像我會這樣收。'>" + escapeHTML(commentState.comment || "") + "</textarea>" +
            "<div class='comment-suggestion' data-suggestion-for='" + escapeHTML(draft.id) + "'>" +
            (suggestion ? ("系統建議優先修改：<strong>" + escapeHTML(suggestion.target) + "</strong><br />" + escapeHTML(suggestion.reason)) : "輸入評論後，系統會先判斷這條意見比較該修在 prompt、worldview、retrieval 還是 validator。") +
            "</div></div>" +
            "<div class='actions' style='margin-top:12px;'><button type='button' class='primary send-editor'>送去改稿介面</button><button type='button' class='rerender'>同主題變體重算</button></div>" +
            "</article>";
        }).join("");
        [...byId("draft-results").querySelectorAll(".card[data-index]")].forEach((card) => {
          const draft = candidates[Number(card.dataset.index)];
          card.querySelector(".send-editor").addEventListener("click", () => loadDraftIntoEditor(draft));
          card.querySelector(".rerender").addEventListener("click", () => {
            byId("draft-status").textContent = "請使用上方「固定材料換角度」重新呼叫 LLM。";
          });
        });
        [...byId("draft-results").querySelectorAll(".draft-comment")].forEach((input) => {
          input.addEventListener("input", (event) => {
            const draftId = event.target.dataset.draftId;
            state.draftComments[draftId] = { comment: event.target.value };
            const suggestion = suggestCommentTarget(event.target.value);
            const box = document.querySelector('[data-suggestion-for="' + CSS.escape(draftId) + '"]');
            if (!box) return;
            box.innerHTML = suggestion
              ? "系統建議優先修改：<strong>" + escapeHTML(suggestion.target) + "</strong><br />" + escapeHTML(suggestion.reason)
              : "輸入評論後，系統會先判斷這條意見比較該修在 prompt、worldview、retrieval 還是 validator。";
          });
        });
      }

      function computeDiff(original, revised) {
        const source = original.split(/\n+/);
        const target = revised.split(/\n+/);
        const dp = Array.from({ length: source.length + 1 }, () => Array(target.length + 1).fill(0));
        for (let i = source.length - 1; i >= 0; i--) {
          for (let j = target.length - 1; j >= 0; j--) {
            dp[i][j] = source[i] === target[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
          }
        }
        const lines = [];
        let i = 0, j = 0;
        while (i < source.length && j < target.length) {
          if (source[i] === target[j]) { lines.push({ type: "same", text: source[i] }); i++; j++; continue; }
          if (dp[i + 1][j] >= dp[i][j + 1]) { lines.push({ type: "remove", text: source[i++] }); }
          else { lines.push({ type: "add", text: target[j++] }); }
        }
        while (i < source.length) lines.push({ type: "remove", text: source[i++] });
        while (j < target.length) lines.push({ type: "add", text: target[j++] });
        return lines;
      }

      function renderDiff(original, revised) {
        byId("diff-view").innerHTML = computeDiff(original, revised).map((line) =>
          "<div class='diff-line " + (line.type === "same" ? "same" : line.type === "add" ? "add" : "remove") + "'>" +
          (line.type === "same" ? " " : line.type === "add" ? "+" : "-") + " " + escapeHTML(line.text) + "</div>"
        ).join("");
      }

      function renderTaxonomy() {
        byId("reason-list").innerHTML = state.taxonomy.editReasons.map((reason) =>
          "<label class='chip-option'><input type='checkbox' name='editReasons' value='" + escapeHTML(reason) + "' /><span>" + escapeHTML(reason) + "</span></label>"
        ).join("");
        byId("drift-type").innerHTML = state.taxonomy.driftTypes.map((item) => "<option>" + escapeHTML(item) + "</option>").join("");
        byId("trainability-reason").innerHTML = state.taxonomy.trainabilityReasons.map((item) => "<option>" + escapeHTML(item) + "</option>").join("");
      }

      function renderTrainingSummary() {
        const sessions = state.sessions;
        const trainableCount = sessions.filter((session) => session.trainable).length;
        const groups = new Map();
        sessions.forEach((session) => {
          const key = session.draft.input.style + " / 幽默 " + session.draft.input.humor + " / 立場 " + session.draft.input.stance;
          groups.set(key, (groups.get(key) || 0) + 1);
        });
        byId("training-summary").innerHTML =
          "<div class='card'><strong>目前累積</strong><p>session " + sessions.length + " 筆，可訓練 " + trainableCount + " 筆。</p></div>" +
          "<div class='card'><strong>版本切面</strong><p>" + (groups.size ? [...groups.entries()].map(([label, count]) => label + "：" + count).join(" / ") : "尚無資料") + "</p></div>";
        byId("session-list").innerHTML = sessions.slice().reverse().map((session) =>
          "<article class='card'><h3>" + escapeHTML(session.draft.title) + "</h3><div class='meta'>" +
          "<span class='pill'>世界觀 " + session.worldviewScore + "/5</span>" +
          "<span class='pill'>" + escapeHTML(session.driftType) + "</span>" +
          "<span class='pill'>" + (session.trainable ? "可訓練" : "不納入訓練") + "</span></div>" +
          "<p>標籤：" + (session.editReasons.join("、") || "未標記") + "</p><p>原因：" + escapeHTML(session.trainabilityReason) + "</p>" +
          "<p><small>" + new Date(session.createdAt).toLocaleString("zh-TW") + "</small></p></article>"
        ).join("");
      }

      function download(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }

      async function boot() {
        const [corpus, worldview, taxonomy] = await Promise.all([
          fetch("./data/corpus.json").then((res) => res.json()),
          fetch("./data/worldview-profile.json").then((res) => res.json()),
          fetch("./data/feedback-taxonomy.json").then((res) => res.json())
        ]);
        state.corpus = corpus;
        state.worldview = worldview;
        state.taxonomy = taxonomy;
        try {
          await loadSessions();
        } catch {
          state.sessions = [];
        }
        byId("stat-docs").textContent = String(corpus.documentCount);
        byId("stat-chunks").textContent = String(corpus.chunkCount);
        byId("stat-worldview").textContent = worldview.version;
        renderWorldview();
        renderTaxonomy();
        renderTrainingSummary();
        syncRangeDisplays();
      }

      function clearDraftOutput() {
        byId("draft-results").innerHTML = "";
        byId("draft-comparison").innerHTML = "";
      }

      byId("draft-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = readInput();
        state.lastInput = input;
        state.draftSeed = 0;
        byId("draft-status").textContent = "草稿生成中...";
        try {
          const result = await generateDraftsRemote(input);
          state.draftMode = "llm-api";
          state.retrievalMode = result.retrievalMode || "server";
          state.lastComparison = result.comparison ?? null;
          state.lastSuitability = result.suitability || null;
          state.lastValidation = result.validation || null;
          renderDrafts((result.drafts || []).map((draft, index) => ({
            ...draft,
            prompt: draft.prompt || result.prompt || "",
            worldviewCheck: worldviewCheck(draft.text || "", draft.input || input),
            referenceNotes: result.referenceNotes || [],
            validationReport: result.validation?.reports?.[index] || null
          })));
          byId("draft-status").textContent = "已生成 2 篇草稿（LLM API）。";
        } catch (error) {
          if (error.noFallback) {
            state.draftMode = "llm-api-blocked";
            state.retrievalMode = "server";
            state.lastComparison = null;
            state.lastSuitability = error.details?.suitability || null;
            state.lastValidation = error.details?.validation || null;
            byId("draft-results").innerHTML = "";
            byId("draft-comparison").innerHTML = "";
            const reasons = error.details?.suitability?.reasons || error.details?.validation?.reports?.flatMap((report) => report.reasons || []) || [];
            byId("draft-status").textContent = "這題已被系統擋下，不再退回本地規則式草稿：" + (reasons.join("；") || error.message);
            renderDiagnostics();
            return;
          }
          state.draftMode = "error";
          state.retrievalMode = "server";
          state.lastComparison = null;
          state.lastSuitability = null;
          state.lastValidation = null;
          clearDraftOutput();
          byId("draft-status").textContent = "草稿生成失敗：" + error;
        }
      });
      byId("reroll").addEventListener("click", async () => {
        if (!state.lastInput) { byId("draft-status").textContent = "請先生成一次草稿。"; return; }
        state.draftSeed += 1;
        byId("draft-status").textContent = "重新生成中...";
        try {
          const result = await generateDraftsRemote(state.lastInput);
          state.draftMode = "llm-api";
          state.retrievalMode = result.retrievalMode || "server";
          state.lastComparison = result.comparison ?? null;
          state.lastSuitability = result.suitability || null;
          state.lastValidation = result.validation || null;
          renderDrafts((result.drafts || []).map((draft, index) => ({
            ...draft,
            prompt: draft.prompt || result.prompt || "",
            worldviewCheck: worldviewCheck(draft.text || "", draft.input || state.lastInput),
            referenceNotes: result.referenceNotes || [],
            validationReport: result.validation?.reports?.[index] || null
          })));
          byId("draft-status").textContent = "已重新生成 2 篇草稿（LLM API）。";
        } catch (error) {
          if (error.noFallback) {
            state.draftMode = "llm-api-blocked";
            state.retrievalMode = "server";
            state.lastComparison = null;
            state.lastSuitability = error.details?.suitability || null;
            state.lastValidation = error.details?.validation || null;
            byId("draft-results").innerHTML = "";
            byId("draft-comparison").innerHTML = "";
            const reasons = error.details?.suitability?.reasons || error.details?.validation?.reports?.flatMap((report) => report.reasons || []) || [];
            byId("draft-status").textContent = "這題已被系統擋下，不再退回本地規則式草稿：" + (reasons.join("；") || error.message);
            renderDiagnostics();
            return;
          }
          state.draftMode = "error";
          state.retrievalMode = "server";
          state.lastComparison = null;
          state.lastSuitability = null;
          state.lastValidation = null;
          clearDraftOutput();
          byId("draft-status").textContent = "草稿生成失敗：" + error;
        }
      });
      byId("copy-draft").addEventListener("click", () => {
        if (!state.activeDraft) return;
        byId("revision-text").value = state.activeDraft.text;
        renderDiff(state.activeDraft.text, state.activeDraft.text);
      });
      byId("revision-text").addEventListener("input", () => {
        if (!state.activeDraft) return;
        renderDiff(state.activeDraft.text, byId("revision-text").value);
      });
      byId("feedback-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!state.activeDraft) { byId("feedback-status").textContent = "請先選一篇草稿。"; return; }
        const data = new FormData(byId("feedback-form"));
        const session = {
          id: "session-" + Date.now(),
          createdAt: new Date().toISOString(),
          draft: state.activeDraft,
          revisedText: byId("revision-text").value.trim(),
          editReasons: data.getAll("editReasons").map(String),
          worldviewScore: Number(data.get("worldviewScore") || 4),
          driftType: String(data.get("driftType") || "無"),
          trainable: data.get("trainable") === "yes",
          trainabilityReason: String(data.get("trainabilityReason") || "可直接納入")
        };
        await saveSession(session);
        renderTrainingSummary();
        byId("feedback-status").textContent = "已保存 1 筆回饋：" + session.draft.title;
      });
      byId("export-sessions").addEventListener("click", () => download("rag-lab-sessions-" + Date.now() + ".json", JSON.stringify(state.sessions, null, 2), "application/json"));
      byId("export-sft").addEventListener("click", () => {
        const content = state.sessions.filter((s) => s.trainable).map((s) => JSON.stringify({
          id: s.id,
          instruction: s.draft.prompt,
          constraints: {
            style: s.draft.input.style,
            humor: s.draft.input.humor,
            stance: s.draft.input.stance,
            reader: s.draft.input.reader,
            worldviewScore: s.worldviewScore,
            editReasons: s.editReasons
          },
          output: s.revisedText
        })).join("\n");
        download("rag-lab-sft-" + Date.now() + ".jsonl", content, "application/x-ndjson");
      });
      byId("export-preference").addEventListener("click", () => {
        const content = state.sessions.filter((s) => s.trainable).map((s) => JSON.stringify({
          id: s.id,
          prompt: s.draft.prompt,
          chosen: s.revisedText,
          rejected: s.draft.text,
          metadata: {
            driftType: s.driftType,
            worldviewScore: s.worldviewScore,
            style: s.draft.input.style,
            humor: s.draft.input.humor,
            stance: s.draft.input.stance
          }
        })).join("\n");
        download("rag-lab-preference-" + Date.now() + ".jsonl", content, "application/x-ndjson");
      });
      byId("clear-sessions").addEventListener("click", async () => {
        await clearSessionsRemote();
        renderTrainingSummary();
      });
      byId("humor-range").addEventListener("input", syncRangeDisplays);
      byId("stance-range").addEventListener("input", syncRangeDisplays);
      boot().catch((error) => {
        byId("draft-status").textContent = "Workbench 初始化失敗：" + error;
      });
    </script>
  </body>
</html>
`;

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(SESSIONS_DIR, { recursive: true });
  await fs.mkdir(EXPORTS_DIR, { recursive: true });
  await fs.writeFile(worldviewPath, `${JSON.stringify(worldview, null, 2)}\n`, "utf8");
  await fs.writeFile(worldviewSchemaPath, `${JSON.stringify(worldviewSchema, null, 2)}\n`, "utf8");
  await fs.writeFile(taxonomyPath, `${JSON.stringify(taxonomy, null, 2)}\n`, "utf8");
  await fs.writeFile(sourcePolicyPath, `${JSON.stringify(sourcePolicy, null, 2)}\n`, "utf8");
  await fs.writeFile(htmlPath, html, "utf8");
  console.log(`[rag:build-workbench] wrote ${path.relative(ROOT, htmlPath)}`);
}

main().catch((error) => {
  console.error("[rag:build-workbench] failed:", error);
  process.exitCode = 1;
});
