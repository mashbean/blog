(() => {
  "use strict";

  const deck = document.querySelector("#workshop-deck");
  const notesNode = document.querySelector("#speaker-notes");
  const slides = [];

  const URL = {
    tsmc: "https://mashbean.net/decks/tsmc-literature-award-analysis/",
    minutes:
      "https://www.facebook.com/teenagerwrite/posts/pfbid02J1SuhqdwmFAnCTsVKgCEoGbrjHUZbby85ukSQJPkLAAjVD3zH3otLwf7WLzqFDw8l",
    rules: "https://udn.com/news/story/7272/9327157",
    author: "https://www.threads.com/@froggg_0302/post/DcBeuMuCdzT",
    clab: "https://mashbean.net/decks/c-lab-0610/",
    style: "https://mashbean.net/decks/twnic-2026-platform-cleaner/",
    pro: "https://pro.mashbean.net/",
    article: "https://pro.mashbean.net/reports/2026-08-29-storyscope-sepia-writing-workshop/",
    pipeline: "https://github.com/mashbean/research-publishing-pipeline",
    fiction: "https://pro.mashbean.net/fiction/",
    callin: "https://call-in.mashbean.net/",
    storyscope: "https://arxiv.org/html/2604.03136v6",
    storyscopeRepo: "https://github.com/jenna-russell/storyscope",
    humanNarratives: "https://aclanthology.org/2024.emnlp-main.978/",
    creativeStories: "https://arxiv.org/abs/2411.02316",
    litvista: "https://aclanthology.org/2026.acl-long.1024/",
    narrativeAgency: "https://arxiv.org/abs/2604.23676",
    collectiveDiversity: "https://doi.org/10.1126/sciadv.adn5290",
    coauthor: "https://arxiv.org/abs/2201.06796",
    wordcraft: "https://arxiv.org/abs/2107.07430",
    dramatron: "https://deepmind.google/research/publications/13609/",
    sepia: "https://github.com/Nanako0129/sepia/",
    skills: "https://platform.claude.com/docs/en/managed-agents/skills",
    sudowrite: "https://docs.sudowrite.com/",
    novelai: "https://docs.novelai.net/en/text/lorebook/",
    writing: "https://writing.mashbean.net/",
    workshop: "https://writing.mashbean.net/workshop",
    dashboard: "https://writing.mashbean.net/workshop/dashboard",
  };

  const sourceName = new Map([
    [URL.tsmc, "mashbean.net｜文學獎四方地圖與評審分析"],
    [URL.minutes, "青年文學獎｜三次決審紀要"],
    [URL.rules, "聯合報｜2026 徵文辦法"],
    [URL.author, "作者方｜公開說明"],
    [URL.clab, "mashbean.net｜C-LAB 原始簡報"],
    [URL.style, "mashbean.net｜TWNIC 視覺參考"],
    [URL.pro, "pro.mashbean.net｜研究成果"],
    [URL.article, "pro.mashbean.net｜StoryScope／Sepia 第二版研究"],
    [URL.pipeline, "GitHub｜research-publishing-pipeline"],
    [URL.fiction, "pro.mashbean.net｜小說書架"],
    [URL.callin, "call-in.mashbean.net｜審議互動工具"],
    [URL.storyscope, "arXiv:2604.03136v6｜StoryScope"],
    [URL.storyscopeRepo, "GitHub｜StoryScope code & data"],
    [URL.humanNarratives, "EMNLP 2024｜Human-Level Narratives"],
    [URL.creativeStories, "arXiv:2411.02316｜Creative Short Stories"],
    [URL.litvista, "ACL 2026｜LitVISTA"],
    [URL.narrativeAgency, "arXiv:2604.23676｜Narrative Agency"],
    [URL.collectiveDiversity, "Science Advances｜創意與集體多樣性"],
    [URL.coauthor, "CHI 2022｜CoAuthor"],
    [URL.wordcraft, "IUI 2022｜Wordcraft"],
    [URL.dramatron, "Google DeepMind｜Dramatron"],
    [URL.sepia, "GitHub｜Sepia"],
    [URL.skills, "Anthropic Docs｜Agent Skills"],
    [URL.sudowrite, "Sudowrite｜官方文件"],
    [URL.novelai, "NovelAI｜Lorebook 文件"],
    [URL.writing, "writing.mashbean.net｜正式研究"],
    [URL.workshop, "writing.mashbean.net/workshop｜現場練習"],
    [URL.dashboard, "writing.mashbean.net｜即時儀表板"],
  ]);

  const notes = (cue, sources) =>
    `${cue}\n\n[Sources]\n${sources.map((source) => `- ${source}`).join("\n")}`;
  const currentNumber = () => slides.length + 1;
  const eyebrow = (_number, label) =>
    `<div class="eyebrow"><span class="num">${String(currentNumber()).padStart(2, "0")}</span>${label}</div>`;
  const heading = (number, label, title, compact = false) =>
    `${eyebrow(number, label)}<h2 class="title${compact ? " compact" : ""}">${title}</h2>`;
  const slideNo = (number) => `<span class="slide-no">${String(number).padStart(2, "0")}</span>`;
  const metric = (value, label, sub = "", accent = "var(--purple)") =>
    `<div class="metric" style="--accent:${accent}"><span class="value">${value}</span><span class="label">${label}</span>${sub ? `<span class="sub">${sub}</span>` : ""}</div>`;
  const card = ({ kicker, title, body, className = "", accent = "" }) =>
    `<article class="card ${className}"${accent ? ` style="--accent:${accent}"` : ""}>${kicker ? `<p class="card-kicker">${kicker}</p>` : ""}<h3>${title}</h3><p>${body}</p></article>`;
  const icon = (name) => {
    const paths = {
      chat: '<path d="M4 5h16v10H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
      agent: '<circle cx="12" cy="6" r="3"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 9v4M7 17l5-4 5 4"/>',
      memory: '<path d="M8 4a4 4 0 0 0-3 6 4 4 0 0 0 1 7 4 4 0 0 0 6 3V4a4 4 0 0 0-4 0Zm8 0a4 4 0 0 1 3 6 4 4 0 0 1-1 7 4 4 0 0 1-6 3V4a4 4 0 0 1 4 0Z"/>',
      folder: '<path d="M3 6h7l2 2h9v10H3V6Z"/>',
      tools: '<path d="m4 20 7-7M14 4a5 5 0 0 0 6 6l-8 8-6-6 8-8Z"/>',
      target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5"/>',
      compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-4 2 2-6 4-2Z"/>',
      map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
      gps: '<circle cx="12" cy="10" r="3"/><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/>',
      pen: '<path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z"/><path d="m14 7 3 3"/>',
      layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
      chart: '<path d="M4 20V9M10 20V4M16 20v-7M22 20H2"/>',
    };
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.tools}</svg>`;
  };
  const note = (term, kicker, title, body) =>
    `<span class="note-ref" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${term}，開啟名詞解釋">${term}<span class="note-tag" aria-hidden="true">註</span><span class="note-body"><span class="note-kicker">${kicker}</span><strong class="note-title">${title}</strong><span class="note-copy">${body}</span></span></span>`;
  const flowNode = (step, title, body, className = "") =>
    `<article class="flow-node ${className}"><span class="step">${step}</span><h3>${title}</h3><p>${body}</p></article>`;
  const sourceStrip = (sources) =>
    `<div class="slide-sources"><span>資料來源</span>${sources
      .map(
        (source) =>
          `<a href="${source}" target="_blank" rel="noreferrer">${sourceName.get(source) || source.replace(/^https:\/\//, "")}</a>`,
      )
      .join("")}</div>`;

  function add({ label, className = "", content, cue, sources }) {
    const displayNumber = currentNumber();
    if (!sources?.length) throw new Error(`Slide ${displayNumber} is missing visible sources`);
    slides.push({
      html: `<section data-label="${String(displayNumber).padStart(2, "0")} ${label}" class="${className}"><div class="frame">${content}</div>${sourceStrip(sources)}${slideNo(displayNumber)}</section>`,
      note: notes(cue, sources),
    });
  }

  function divider(number, sectionNumber, label, title, subtitle, cue, sources) {
    add({
      number,
      label: title,
      className: "divider",
      content: `<div class="section-number">${sectionNumber}</div><div class="section-label">${label}</div><h2 class="section-title">${title}</h2><p class="section-subtitle">${subtitle}</p>`,
      cue,
      sources,
    });
  }

  add({
    number: 1,
    label: "封面",
    className: "cover",
    content: `<p class="cover-kicker">AI 文學創作工作坊 ／ 2026.09.02・09.09</p><h1 class="cover-title">我們距離機器會夢見<span>電子羊</span>的時代有多近？</h1><p class="cover-subtitle">文學獎評選爭議、合成工具賞析、匿名同儕審查實驗</p><p class="cover-author">黃豆泥 M.D.</p><div class="cover-meta"><span>臺文所 530 教室｜16:00–18:00</span><span>案例分析 × 研究方法 × 創作實驗</span></div>`,
    cue: "封面。電子羊連到文學想像、合成文本與判斷制度三個部分。",
    sources: [URL.tsmc, URL.article, URL.writing],
  });

  add({
    number: 2,
    label: "疑惑與追尋",
    className: "inverse dense",
    content: `${heading(2, "我的疑惑與追尋的倉鼠輪", "四個問題反覆把我帶回作品、制度與知識生產", true)}<div class="question-wheel"><div class="wheel-track" aria-hidden="true"><span class="wheel-arrow a">→</span><span class="wheel-arrow b">→</span><span class="wheel-arrow c">→</span><span class="wheel-arrow d">→</span><div class="wheel-center">${icon("memory")}<strong>操作</strong><span>閱讀／創作／研究／制度</span></div></div><article class="wheel-q q1"><span>01</span><p>合成創作是什麼？</p></article><article class="wheel-q q2"><span>02</span><p>真正的品味與美學是什麼？</p></article><article class="wheel-q q3"><span>03</span><p>如何界定有邊界的競爭？</p></article><article class="wheel-q q4"><span>04</span><p>知識生產機構的永續模式如何受到影響？</p></article></div>`,
    cue: "這四個問題會在文學獎、工具使用、研究比較與課堂實驗裡反覆出現。",
    sources: [URL.tsmc, URL.article, URL.writing],
  });

  add({
    number: 3,
    label: "今天的路線",
    className: "dense",
    content: `${heading(3, "今天的路線", "四個部分，共用同一個問題：判斷如何留下證據", true)}<div class="grid grid-4 route-grid">${[
      ["01", "文學獎爭議", "四方地圖、三次會議、五位評審的判準移動，以及公開紀錄的證據邊界。"],
      ["02", "我的 AI 使用", "從 Chat、Agent、研究生產線，到小說書架與審議民主互動工具。"],
      ["03", "合成工具賞析", "比較文本判讀、共同創作、長篇結構、集體趨同，以及 Skill、診斷工具與套裝產品。"],
      ["04", "匿名同儕實驗", "現場 300 字練習、帶回家創作、提示揭露、評分改變與版本保存。"],
    ]
      .map(([n, t, b], index) =>
        card({ kicker: n, title: t, body: b, className: index === 3 ? "purple-card" : "" }),
      )
      .join("")}</div>`,
    cue: "說明整體路線與四部分的共同問題。",
    sources: [URL.tsmc, URL.clab, URL.article, URL.writing],
  });

  divider(
    4,
    "01",
    "LITERARY INSTITUTIONS",
    "台積電文學獎評選爭議",
    "同一篇文本，在三次會議裡依序成為文學作品、制度風險與作者可信度問題",
    "這一部分分析評判對象和判準如何移動。",
    [URL.tsmc, URL.minutes],
  );

  add({
    number: 5,
    label: "事件輪廓",
    className: "dense",
    content: `${heading(5, "36 分到 9 分：同一個分數欄位換了三次任務", "票數變動很醒目，真正需要追蹤的是評判對象如何從文本移向制度與信任", true)}<div class="event-composite"><div class="vote-bridge">${metric("36", "6 月 27 日", "匿名文本評選｜首獎") }<div class="vote-arrow"><span>評判對象移動</span>→</div>${metric("9", "7 月 2 日", "作者說明後｜佳作", "var(--red)")}</div><div class="mini-timeline"><article style="--accent:var(--purple)"><time>6 / 27</time><strong>評文本</strong><p>精準、節制、情感複雜；成熟完整同時是遲疑與高分理由。</p></article><article style="--accent:var(--amber)"><time>7 / 01</time><strong>評制度</strong><p>外部來信進場，焦點轉向規則、公平、教育訊號與首獎從缺。</p></article><article style="--accent:var(--red)"><time>7 / 02</time><strong>評信任</strong><p>沒有新增可核對的技術證據；作者如何回答進入最後投票。</p></article></div><div class="evidence-ribbon"><span>公開紀錄能確認</span><strong>判準移動</strong><i>／</i><span>公開紀錄仍不能確認</span><strong>作品實際生成方式</strong></div></div>`,
    cue: "將兩次投票與三次會議放在同一張圖，分開可確認的判準移動與未知的生成方式。",
    sources: [URL.tsmc, URL.minutes, URL.rules, URL.author],
  });

  add({
    number: 6,
    label: "四方地圖",
    className: "dense",
    content: `${heading(6, "四方地圖", "四個制度位置各自守住不同的價值，也各自承擔不同風險", true)}<div class="quad-wrap"><article class="quad" style="--accent:var(--purple);--card-bg:var(--purple-soft)"><span class="letter">A</span><h3>作者與個案權益</h3><p class="guard">創作尊嚴｜答辯｜隱私</p><p>作者需要知道具體指控、證據門檻與可申復方式。無限寬廣的「完全沒用 AI」無法被合理證明。</p></article><article class="quad" style="--accent:var(--amber);--card-bg:var(--amber-soft)"><span class="letter">B</span><h3>評審與主辦方</h3><p class="guard">獎項公信力｜文學價值</p><p>主辦方需要回應疑慮。規則缺席時，自由心證容易延伸到人格與可信度審查。</p></article><article class="quad" style="--accent:var(--green);--card-bg:var(--green-soft)"><span class="letter">C</span><h3>參賽者與教育現場</h3><p class="guard">公平起點｜可預期規範</p><p>參賽者應在投稿前知道允許、揭露、限制與禁止範圍，處分個案無法取代事前規則。</p></article><article class="quad" style="--accent:var(--red);--card-bg:var(--red-soft)"><span class="letter">D</span><h3>技術與制度設計</h3><p class="guard">查核｜申復｜最少蒐集</p><p>版本、提示、口頭答辯與偵測器皆屬局部證據；用途、保存期限與決定權需要明文設計。</p></article><div class="quad-center">共同問題｜獎勵的是文本、創作控制、工具技巧，或特定的無 AI 過程？</div></div>`,
    cue: "四方是制度位置，並非人格分類。",
    sources: [URL.tsmc, URL.minutes, URL.rules],
  });

  add({
    number: 8,
    label: "五位評審總覽",
    className: "dense",
    content: `${heading(8, "五位評審的立場移動", "降分幅度相近，理由和內在矛盾各不相同", true)}<table class="judge-table"><colgroup><col style="width:13%"><col style="width:13%"><col style="width:27%"><col></colgroup><thead><tr><th>評審</th><th>分數</th><th>主要判準</th><th>立場移動</th></tr></thead><tbody><tr><td>周芬伶</td><td>8 → 1</td><td>人文教育禁線</td><td>第一次肯定文本；後續把警示效果放到原始文學判斷之前。</td></tr><tr><td>林俊頴</td><td>7 → 3</td><td>程序意識 × 倫理懷疑</td><td>明說不能事後改規則，也承認沒有證據，仍以自由心證處理作者回應。</td></tr><tr><td>連明偉</td><td>6 → 1</td><td>文化公平 × 成熟風格</td><td>作品「太乾淨」從文學評語轉成資源不平等與文學能動性的疑慮。</td></tr><tr><td>黃崇凱</td><td>8 → 2</td><td>揭露與獎項分類</td><td>以模型、流程與協作標示為保留獎項的條件；條件在賽後才形成。</td></tr><tr><td>顧玉玲</td><td>7 → 2</td><td>技術開放 × 信任審查</td><td>原先期待人機合作；最後由作者回應方式決定信任與分數。</td></tr></tbody></table>`,
    cue: "總覽五位評審；下兩頁分析各自的內在張力。",
    sources: [URL.tsmc, URL.minutes],
  });

  add({
    number: 9,
    label: "評審立場剖面",
    className: "dense",
    content: `${heading(9, "七個位置，一場沒有共同量尺的重評", "五位投票評審與兩位非投票者都回應 AI，規範來源與證據要求卻不相同", true)}<div class="stance-board"><div class="stance-axis"><span>文本判斷</span><i></i><span>程序規則</span><i></i><span>文化／教育訊號</span><i></i><span>信任審查</span></div><div class="stance-rows"><article><strong>周芬伶 <em>8→1</em></strong><span class="pill red">人文教育</span><p>由高度肯定文本轉向明確禁線；個案承擔警示未來參賽者的功能。</p><small>疑問｜教育訊號能否取代事前規則？</small></article><article><strong>林俊頴 <em>7→3</em></strong><span class="pill purple">程序 × 倫理</span><p>明說不能中途改規則，也承認沒有實證；仍以自由心證處理灰色地帶。</p><small>疑問｜不確定性可以承擔多大的後果？</small></article><article><strong>連明偉 <em>6→1</em></strong><span class="pill amber">文化公平</span><p>持續喜歡作品；「太乾淨」逐步連到資源差距與文學能動性。</p><small>疑問｜成熟風格是線索，或類型預設？</small></article><article><strong>黃崇凱 <em>8→2</em></strong><span class="pill green">揭露分類</span><p>提出模型、流程、協作標示三條件；可進入未來規則，當屆使用則有追溯問題。</p><small>疑問｜賽後條件如何取得正當性？</small></article><article><strong>顧玉玲 <em>7→2</em></strong><span class="pill red">技術 × 信任</span><p>原先期待人機合作；最後由作者回應方式決定信任與分數。</p><small>疑問｜技術查核何時越界成人格判斷？</small></article></div><div class="observer-row"><p><strong>王盛弘｜</strong>回到既有辦法，追問 AI 是否能直接等同抄襲或代筆。</p><p><strong>許峻郎｜</strong>重視公正、教育理念與首獎從缺所傳達的象徵。</p></div></div>`,
    cue: "把七個位置放入同一張剖面圖，讓規範來源、立場移動與分析問題可以並讀。",
    sources: [URL.tsmc, URL.minutes],
  });

  add({
    number: 11,
    label: "證據與制度設計",
    className: "dense",
    content: `${heading(11, "從爭議紀要走到下一屆規則", "四個爭點同時對照可確認的證據與可事前寫下的制度條件", true)}<div class="design-matrix"><div class="matrix-head"><span>爭議問題</span><span>公開材料能確認</span><span>下一屆規則要回答</span></div><article><h3>成熟完整能否成為 AI 線索？</h3><p>同一特徵曾構成高分理由；後來成為懷疑來源，線索與結論間沒有公開查核步驟。</p><p><strong>啟動門檻＋證據分量</strong><br>文風直覺只能啟動詢問，或可以影響名次？</p></article><article><h3>AI 協作當年如何規範？</h3><p>辦法沒有生成式 AI 條款；抄襲、代筆、倫理與教育理念被拿來補足，責任條件並不相同。</p><p><strong>允許範圍＋揭露內容</strong><br>構想、查找、修辭、翻譯、生成、重寫如何處理？</p></article><article><h3>獎勵文本、控制或過程？</h3><p>三次會議把文學評價、制度處理與信任審查放進同一個分數，沒有公開加權方式。</p><p><strong>評選標的＋查核權限</strong><br>誰可要求版本、提示或口頭答辯？用途與保存多久？</p></article><article><h3>作者說明如何成為證據？</h3><p>回答語氣進入分數；具體問題、期限、可接受材料與複核程序沒有事前列明。</p><p><strong>申復程序＋資料保護</strong><br>指控、回應、複核、利益迴避與刪除方式如何落實？</p></article></div><div class="design-chips"><span>允許範圍</span><span>揭露內容</span><span>啟動門檻</span><span>證據分量</span><span>資料保護</span><span>申復程序</span></div>`,
    cue: "把三頁整合成爭點、證據邊界與制度設計的對照表；不越過公開材料判定生成方式。",
    sources: [URL.tsmc, URL.minutes, URL.rules, URL.author],
  });

  divider(
    14,
    "02",
    "MY AI PRACTICE",
    "我如何使用 AI",
    "判斷、資料與品味留在人身上；模型與工具擴張研究、製作與驗證能力",
    "本段依使用者指定的 C-LAB 原始簡報重組，保留原案例與方法脈絡。",
    [URL.clab, URL.style],
  );

  add({
    number: 15,
    label: "判斷、資料、品味",
    className: "dense",
    content: `${heading(15, "非工程背景也能帶進 AI 工作的三種資產", "工具熟練度會更新；問題意識、材料與判準會持續累積", true)}<div class="grid grid-3 asset-grid">${card({ kicker: "01｜判斷", title: "知道什麼值得做", body: "能把模糊焦慮改寫成問題，辨認決策風險，也知道某些事情應該停止或交回人處理。", className: "purple-card" })}${card({ kicker: "02｜資料", title: "知道材料在哪裡", body: "長期累積的文本、訪談、案例、制度脈絡、失敗紀錄與來源關係，決定模型能否離開一般答案。", className: "green-card" })}${card({ kicker: "03｜品味", title: "看得出完整仍可能不對", body: "能辨認語氣、節奏、價值與場域不合，也能說明哪一處需要保留粗糙、歧義或沉默。", className: "amber-card" })}</div><p class="context-band"><strong>原始簡報的結論</strong><span>有品味的人知道什麼值得保留；有資料的人知道來源與組合方式。</span></p>`,
    cue: "恢復 C-LAB 第 3 與第 19 頁的完整脈絡。",
    sources: [URL.clab],
  });

  add({
    number: 16,
    label: "Chat 與 Agent 的世界邊界",
    className: "dense",
    content: `${heading(16, "Chat 的世界在對話裡；Agent 的世界邊界由你設定", "差異不只在回答長短，還包括資料、記憶、工具與外部世界能否被接進工作", true)}<div class="world-boundary"><article class="chat-world"><div class="world-title">${icon("chat")}<span><small>CHAT</small><strong>對話內的世界觀</strong></span></div><div class="chat-bubble"><span>你的問題</span><span>貼進來的材料</span><span>這段對話的上下文</span><b>模型回覆</b></div><p>Chat 僅能處理對話內的世界觀。外部檔案、舊工作與發布狀態若沒有被帶入，模型就看不到。</p></article><article class="agent-world"><div class="world-title">${icon("agent")}<span><small>AGENT</small><strong>可配置的工作世界</strong></span></div><div class="orbit"><div class="orbit-core">${icon("target")}<strong>目標與驗收</strong></div><span class="o1">${icon("folder")}電腦資料</span><span class="o2">${icon("memory")}跨次記憶</span><span class="o3">${icon("tools")}工具／Skill</span><span class="o4">${icon("map")}瀏覽器／服務</span><span class="o5">${icon("chart")}公開結果</span></div><p>Agent 可以動用電腦裡面的資料，掌握記憶與工具的繼承，世界邊界操之在己。</p></article></div><div class="boundary-controls"><span><b>範圍</b>允許讀寫哪裡</span><span><b>權限</b>哪些行動要批准</span><span><b>停止</b>遇到何種風險就停</span><span><b>驗證</b>完成後打開真實結果</span></div>`,
    cue: "用世界邊界解釋 Chat 與 Agent；權力擴張也要求範圍、權限、停止條件與結果驗證。",
    sources: [URL.clab],
  });

  add({
    number: 17,
    label: "大型語言模型的黃金使用法則",
    className: "dense",
    content: `${heading(17, "大型語言模型的黃金使用法則", "模型能力、推理時間與提問品質互相放大；省下來的等待常以返工和誤判償還", true)}<div class="golden-rules"><article><span>01</span><div class="icon-badge">${icon("target")}</div><h3>問題界定清楚</h3><p>目標、材料、限制、利害關係與驗收條件都寫出來。問題含糊時，強模型只會更流暢地猜。</p></article><article><span>02</span><div class="icon-badge">${icon("chart")}</div><h3>花多一點錢用強模型</h3><p>把月費與 API 成本拿去對照聘用、延誤、返工與錯誤發布；複雜任務的品質差距通常是非線性的。</p></article><article><span>03</span><div class="icon-badge">${icon("memory")}</div><h3>花時間等推理模型</h3><p>即時回答 → 思考模型 → 深度研究／Agent。風險與步驟愈多，愈需要反證、工具呼叫與驗證。</p></article><article><span>04</span><div class="icon-badge">${icon("compass")}</div><h3>反覆迭代問問題的方法</h3><p>讓模型暴露假設、提出反例、標示未知，再回頭重寫問題；提問方式本身也是研究成果。</p></article></div><div class="question-iteration"><span>模糊疑問</span><b>→</b><span>界定目標／材料</span><b>→</b><span>暴露假設</span><b>→</b><span>尋找反例</span><b>→</b><span>重寫問題</span><b>→</b><span>驗收結果</span></div>`,
    cue: "補回強模型、推理等待、問題界定與提問迭代四條鐵律，以及一目了然的循環。",
    sources: [URL.clab],
  });

  add({
    number: 18,
    label: "兩個轉折時刻",
    className: "dense",
    content: `${heading(18, "兩個讓我改變工作方式的時刻", "關鍵發生在一整段工作被接起來，並且留下可核對結果", true)}<div class="grid grid-2 aha-grid">${card({ kicker: "AHA 01｜1,000+ 個檔案", title: "整理一個真的很亂的資料夾", body: "代理讀取結構、找出重複與例外、提出搬移計畫、逐步執行並留下紀錄。價值來自可回復的操作、範圍控制與結果盤點，超過一次分類建議。", className: "purple-card" })}${card({ kicker: "AHA 02｜拖了好幾年的部落格", title: "網站終於成為公開成果", body: "內容整理、設計實作、建置檢查、部署與正式網址驗證被接成同一段工作。程式完成、版本推送、公開可讀是三個需要分別確認的狀態。", className: "green-card" })}</div><p class="context-band"><strong>工作觀的改變</strong><span>我開始把模型放進可回復、可驗收的流程，聊天回答只佔其中一小段。</span></p>`,
    cue: "恢復 C-LAB 第 9–10 頁的原始案例與尺度。",
    sources: [URL.clab, URL.pro, URL.pipeline],
  });

  add({
    number: 19,
    label: "困難問題與研究生產線",
    className: "dense",
    content: `${heading(19, "每天一個困難問題，接上一條可以重跑的研究生產線", "代理提供執行能力；來源選擇、推論責任與公開驗收仍需要有人承擔", true)}<div class="question-pipeline"><div class="hard-questions"><h3>我長期追查的問題</h3><p>國際上哪些媒體收益分潤模式真的有效？</p><p>如何評估流亡社群的影響力？</p><p>AI Agent 身分需要什麼政策？</p><p>各國年齡驗證法律的真實效果是什麼？</p></div><div class="pipeline-stack"><article><b>01</b><span><strong>研究者</strong>蒐集一手來源、界定可說範圍</span></article><article><b>02</b><span><strong>寫作者</strong>組織脈絡、例子與讀者路徑</span></article><article><b>03</b><span><strong>批判者</strong>找反例、替代解釋與利益衝突</span></article><article><b>04</b><span><strong>編輯</strong>壓縮重複、標示推論層級</span></article><article><b>05</b><span><strong>發布者</strong>建置、部署、打開正式網址驗證</span></article></div></div><div class="inference-legend"><span><b>演繹</b>前提錯誤會整批失效</span><span><b>歸納</b>留意樣本與選擇偏誤</span><span><b>類比</b>相似處可能遮住差異</span><span><b>溯因</b>最佳解釋仍有替代方案</span><span><b>因果</b>相關、時序、機制分開</span></div>`,
    cue: "合併四個原始研究問題、五個角色與五種推論風險。",
    sources: [URL.clab, URL.pro, URL.pipeline],
  });

  add({
    number: 21,
    label: "獨立研究者",
    className: "dense",
    content: `${heading(21, "作為一名獨立研究者", "公開文章和生產紀錄分別回答『研究說了什麼』與『如何得到這個結果』", true)}<div class="image-pair"><figure class="image-panel"><img src="assets/article.png" alt="pro.mashbean.net 的 StoryScope 與 Sepia 研究文章"><figcaption>可讀成果｜研究問題、證據、盲點與結論</figcaption></figure><figure class="image-panel"><img src="assets/pipeline.png" alt="research-publishing-pipeline GitHub repository"><figcaption class="purple">可追溯流程｜來源、推論地圖、反證、編輯與發布</figcaption></figure></div><p class="image-note">同一份研究可以被更新、重跑與查錯。文章不需要暴露所有執行細節，仍要讓讀者知道關鍵證據和限制在哪裡。</p>`,
    cue: "成果與流程分開展示。",
    sources: [URL.pro, URL.pipeline, URL.article],
  });

  add({
    number: 22,
    label: "作為讀者",
    className: "dense",
    content: `${heading(22, "作為一名讀者：我用 AI 寫我想看的小說", "需求從『幫我寫一篇』改成世界觀、人物關係、節奏與長期版本管理", true)}<div class="product-split"><figure class="image-panel"><img src="assets/fiction.png" alt="pro.mashbean.net 小說書架"><figcaption>pro.mashbean.net/fiction</figcaption></figure><div class="product-copy"><p>我把閱讀偏好拆成可以長期維護的限制：哪些人物值得跟下去、每章需要承擔什麼變化、世界觀如何逐步揭露、哪些方便的收束要避免。</p><p>生成速度解決供給問題，也放大連續性與品味問題。角色記憶、伏筆、語氣、章節功能和刪除決定，都需要在多輪寫作裡維持。</p><div class="callout">小說書架保存的是我想閱讀的作品，也是一組持續調整的閱讀判準。</div></div></div>`,
    cue: "讀者案例獨立成頁，補回長期小說寫作的脈絡。",
    sources: [URL.fiction],
  });

  add({
    number: 23,
    label: "審議民主研究者",
    className: "dense",
    content: `${heading(23, "作為審議民主研究者與開發者", "我用 AI 強化互動工具，研究重點放在發言如何被看見、分配與回到討論", true)}<div class="product-split reverse"><div class="product-copy"><p>Call-in 將簡報、現場提問、主持節奏與觀眾回應放進同一個事件。AI 可以協助整理與歸納，工具仍要保留原始輸入、異議、主持人控制和可回到來源的路徑。</p><p>這次工作坊借用它的事件觀念：每台裝置有代號，系統顯示分配與進度，作品和評論以事件為單位同步；文學研究需要的資料欄位則留在 writing 服務。</p><div class="callout">互動效率只是其中一項指標；少數意見、匿名安全與主持權力也要進入設計。</div></div><figure class="image-panel"><img src="assets/call-in.png" alt="Call-in 即時簡報互動工具"><figcaption>call-in.mashbean.net｜現場提問與回應</figcaption></figure></div>`,
    cue: "審議民主案例獨立成頁，說明和文學工作坊的技術關係。",
    sources: [URL.callin, URL.workshop, URL.dashboard],
  });

  add({
    number: 24,
    label: "工具的能力範圍",
    className: "dense",
    content: `${heading(24, "從指南針、地圖到 GPS 與 Agent", "工具逐步接手記憶、操作、路徑與目標；方便程度提高，保留在人身上的能力也跟著改變", true)}<div class="tool-reach"><div class="reach-head"><span>工具</span><span>記憶</span><span>操作</span><span>路徑策略</span><span>目標策略</span><span>拿掉後留下什麼</span></div><article><strong>${icon("compass")}指南針</strong><span class="human">人</span><span class="tool">工具</span><span class="human">人</span><span class="human">人</span><p>方向概念、地形判讀與選路仍在使用者身上。</p></article><article><strong>${icon("map")}地圖</strong><span class="shared">共享</span><span class="human">人</span><span class="human">人</span><span class="human">人</span><p>空間模型可以逐漸內化，換圖仍能辨認位置關係。</p></article><article><strong>${icon("gps")}GPS</strong><span class="tool">工具</span><span class="tool">工具</span><span class="tool">工具</span><span class="human">人</span><p>抵達很容易；路徑記憶、方向感與替代路線可能減弱。</p></article><article><strong>${icon("tools")}計算機</strong><span class="human">人</span><span class="tool">工具</span><span class="human">人</span><span class="human">人</span><p>算式與目標仍可理解，手算成本變高。</p></article><article><strong>${icon("agent")}LLM／Agent</strong><span class="tool">工具</span><span class="tool">工具</span><span class="shared">共享</span><span class="shared">共享</span><p>若問題、判準與驗收也外包，思想會接近 GPS 導航。</p></article></div><div class="reach-legend"><span class="human">人承擔</span><span class="shared">人機共享</span><span class="tool">工具接手</span><p>可完成的事情增加，未必代表可獨立重建的理解同步增加。</p></div>`,
    cue: "撿回原始簡報的 GPS 與替代工具矩陣，分開工具提高的能力與使用者留下的能力。",
    sources: [URL.clab],
  });

  add({
    number: 25,
    label: "工具如何內化",
    className: "dense",
    content: `${heading(25, "工具如何成為能力，而非只留下依賴", "透明度讓人看見結構，可壓縮性讓人形成簡化模型，實作與驗證讓理解能夠轉移", true)}<div class="internalization-map"><div class="internal-main"><article><span>01</span>${icon("layers")}<h3>透明度</h3><p>能看見工具如何分解問題、使用哪些資料、在哪裡失敗。</p></article><b>→</b><article><span>02</span>${icon("memory")}<h3>可壓縮性</h3><p>能把複雜流程整理成自己的簡化模型與判斷規則。</p></article><b>→</b><article><span>03</span>${icon("tools")}<h3>實作與驗證</h3><p>能在例外、反例與新工具中重做一次，校正理解。</p></article><b>→</b><article class="outcome"><span>04</span>${icon("compass")}<h3>可轉移能力</h3><p>工具撤走或更換時，仍知道問題結構、路徑與停止理由。</p></article></div><div class="failure-branches"><article><strong>GPS 型失敗</strong><p>黑盒路徑直接給答案；抵達了，方向感沒有形成。</p></article><article><strong>計算機型殘餘</strong><p>理解算式與目的，失去快速手算；能力縮減有限且可辨認。</p></article><article><strong>Agent 型風險</strong><p>任務太大、工具太多、記憶太長；若沒有檢查點，很難知道自己還理解多少。</p></article></div></div>`,
    cue: "保留透明度、可壓縮性、實作驗證與能力轉移的原始流程，也畫出三條常見失敗支線。",
    sources: [URL.clab],
  });

  add({
    number: 26,
    label: "神諭與工具",
    className: "dense",
    content: `${heading(26, "LLM 可以是對話工具，也可能成為思想的 GPS", "差異取決於問題、路徑、判準與驗收由誰掌握", true)}<div class="oracle-matrix"><div class="oracle-head"><span></span><strong>對話工具</strong><strong>神諭模式</strong></div><article><h3>問題</h3><p>使用者界定目的，允許模型追問與指出缺口。</p><p>輸入模糊焦慮，要求一個完整、確定的答案。</p></article><article><h3>路徑</h3><p>來源、假設、反例與未知保持可見，可以更換方向。</p><p>中間過程被壓縮成流暢輸出，使用者跟著單一路線。</p></article><article><h3>判準</h3><p>使用者帶入品味、專業與場域限制，模型協助比較。</p><p>把語氣自信、完整度與速度誤認為正確性。</p></article><article><h3>拿掉工具</h3><p>仍能說明問題如何形成、哪些證據支持、何時停止。</p><p>只記得抵達的結論，無法重建為何走到這裡。</p></article></div><div class="oracle-prompts"><span>這個結論依賴哪些前提？</span><span>哪個反例會讓它失效？</span><span>還有哪些替代解釋？</span><span>第三者如何重做或質疑？</span></div>`,
    cue: "把神諭和工具概念放回矩陣：保留問題、路徑、判準與可重建性，避免思想 GPS 化。",
    sources: [URL.clab, URL.pipeline],
  });

  divider(
    27,
    "03",
    "SYNTHETIC FICTION",
    "合成文本研究與創作工具",
    "從 StoryScope 出發，連到敘事結構、共同創作、集體趨同，以及 Skill、診斷工具與套裝產品",
    "這一部分把論文的評估單位與工具的控制方式放在同一張地圖上。",
    [URL.article, URL.storyscope, URL.humanNarratives, URL.coauthor],
  );

  add({
    number: 28,
    label: "問題脈絡",
    className: "dense",
    content: `${heading(28, "AI 小說的問題，常常在語氣下面", "修掉破折號、華麗形容詞與排比，只處理了最醒目的表面；研究需要把作品、過程與文化後果分層", true)}<div class="fiction-layers"><article><span>01</span>${icon("pen")}<div><h3>表面語言</h3><p>詞彙、句法、陳腔、節奏與語域。容易被 humanizer 修改，也最容易隨模型版本變動。</p></div></article><article><span>02</span>${icon("layers")}<div><h3>敘事選擇</h3><p>主題是否明說、因果是否單線、揭露如何延遲、人物網絡與結尾如何收束。</p></div></article><article><span>03</span>${icon("agent")}<div><h3>共同創作過程</h3><p>誰提出新方向、誰只做展開；作者如何接受、拒絕、重寫，以及版本是否可追溯。</p></div></article><article><span>04</span>${icon("chart")}<div><h3>文化與制度後果</h3><p>個人作品可能變好，作品群卻可能更相似；品味、競爭與知識生產的條件也會移動。</p></div></article></div><p class="layer-question">研究地圖｜文本能否辨識？作品好不好？作者仍掌握多少${note("敘事能動性", "概念", "Narrative agency", "作者對故事方向、語義新意與關鍵選擇的實質控制；不等同於打字比例。")}？整體作品是否失去${note("集體多樣性", "概念", "Collective diversity", "觀察一群作品彼此有多相似。個人作品評價上升，仍可能同時伴隨整體趨同。")}？</p>`,
    cue: "建立四層研究地圖；表面語言只是其中一層。",
    sources: [URL.article, URL.storyscope, URL.narrativeAgency, URL.collectiveDiversity],
  });

  add({
    number: 29,
    label: "研究地景",
    className: "dense",
    content: `${heading(29, "六條研究路徑，回答六種不同問題", "「AI 會不會寫小說」太大；評估單位從五句短篇、長篇故事、共同創作到作品群，結論會跟著改變", true)}<div class="research-landscape"><div class="research-head"><span>研究</span><span>評估單位</span><span>主要發現</span><span>證據邊界</span></div><article><h3>StoryScope</h3><p>同題長篇／304 敘事特徵</p><p>表面修訂後，敘事選擇仍可高準確區分封閉來源。</p><p>來源分類沒有測量文學價值，也不能判定單篇投稿。</p></article><article><h3>Tian et al.</h3><p>敘事弧、轉折、情緒反應</p><p>人類故事較有懸念、喚起與多樣性；模型較正向，也較缺張力。</p><p>英文資料與特定模型；「好讀」與「人類式」要分開。</p></article><article><h3>Creative Short Stories</h3><p>五句短篇／創意評分</p><p>模型可生成連貫故事，人類作品在驚奇與新意上仍較突出。</p><p>五句格式不等同長篇的伏筆、回收與人物發展。</p></article><article><h3>LitVISTA</h3><p>長篇故事／結構化基準</p><p>模型偏重因果連貫，較少複雜${note("敘事弧", "敘事學", "Narrative arc", "角色、衝突或情緒隨時間產生的整體變化路徑。")}與${note("敘事協奏", "評估概念", "Narrative orchestration", "多條情節、角色目標、資訊揭露與節奏如何在長篇中互相配置。")}。</p><p>基準測量結構能力，仍需讀者研究連到作品效果。</p></article><article><h3>Narrative Agency</h3><p>87 篇人機共寫故事</p><p>人類較常引入${note("語義新意", "計算方法", "Semantic novelty", "新段落相對於既有故事方向帶來多少語義偏移，用來觀察誰在開啟新路徑。")}與方向；模型偏向展開、適應情緒。</p><p>小樣本與特定介面；控制感仍需要質性材料補足。</p></article><article><h3>Doshi & Hauser</h3><p>個人創意＋作品群相似度</p><p>AI 點子提高部分個人作品評價，也讓作品彼此更相似。</p><p>個人效益與文化層次的多樣性不能共用一個分數。</p></article></div>`,
    cue: "用評估單位整理六篇研究；每個結果都附帶它不能回答的問題。",
    sources: [URL.storyscope, URL.humanNarratives, URL.creativeStories, URL.litvista, URL.narrativeAgency, URL.collectiveDiversity],
  });

  add({
    number: 30,
    label: "StoryScope 方法與結果",
    className: "dense",
    content: `${heading(30, "StoryScope：從同題故事抽取敘事選擇", "方法與結果放在同一張圖上，才能理解 93.2% 代表什麼，以及它沒有代表什麼", true)}<div class="storyscope-composite"><div class="scope-metrics">${metric("61,608", "篇英文長篇", "Books3 人類故事＋5 個模型")}${metric("304", "敘事特徵", "十個 NarraBench 面向", "var(--green)")}${metric("93.2", "Human／AI macro-F1", "257 features", "var(--purple)")}</div><div class="scope-flow"><article><b>01</b><span>同一題目生成五個模型版本，與一篇人類故事組成題組</span></article><i>→</i><article><b>02</b><span>模型依結構模板比較 100 組／600 篇，提出候選特徵</span></article><i>→</i><article><b>03</b><span>408 項去重為 304 項，另一模型全量標記</span></article><i>→</i><article><b>04</b><span>XGBoost 分類，SHAP 解釋，bootstrap 檢查穩定性</span></article></div><div class="scope-evidence"><p><strong>可靠度</strong>五次重跑 Krippendorff’s α＝0.90；240 個故事特徵項目的人機 Cohen’s κ 平均 0.84。</p><p><strong>測試切分</strong>1,377 組題目、8,262 篇故事完全留出；同題版本不跨訓練與測試。</p><p><strong>壓力測試</strong>長度配對後仍為 93.2%；278 篇故事經表面修訂後由 95.5% 降至 93.9%。</p><p><strong>解讀</strong>${note("macro-F1", "分類指標", "Macro-averaged F1", "先分別計算每一類的 precision 與 recall，再等權平均；避免大類別把小類別的失敗遮住。")}描述封閉資料集的平均分類表現，沒有提供個別投稿的 AI 機率。</p></div></div>`,
    cue: "StoryScope 的資料、抽取流程、可靠度、分類表現與外推界線整合在同一頁。",
    sources: [URL.storyscope, URL.storyscopeRepo, URL.article],
  });

  add({
    number: 31,
    label: "四組敘事差異",
    className: "dense",
    content: `${heading(31, "語氣下面的四組敘事差異", "群體比例適合形成近讀問題；單一特徵不足以判定來源或文學價值", true)}<div class="grid grid-2 feature-grid">${card({ kicker: "77% AI｜52% Human", title: "主題由敘事者明說", body: "近讀問題：刪除最後的說明，前文能否自行成立？若不能，缺口可能出現在前面的材料。", className: "purple-card" })}${card({ kicker: "69% AI｜46% Human", title: "主角選擇推動結局", body: "模型作品也更常沒有支線、用內在理解收束。近讀可測試偶然、旁支或未解關係是否有位置。", className: "amber-card" })}${card({ kicker: "81% AI｜38% Human", title: "情緒集中寫進身體", body: "胸口、手心、呼吸與環境鏡射反覆出現。閱讀時可比較身體、動作、命名、對話與沉默的分配。", className: "green-card" })}${card({ kicker: "47% Human｜24% AI", title: "具名引用外部文本", body: "人類作品也有較多時間跳接、延後揭露與讀者直述。問題在具體關係如何參與故事，無須機械增加細節。", className: "red-card" })}</div>`,
    cue: "四項統計都轉成可以近讀與討論的問題。",
    sources: [URL.storyscope, URL.article],
  });

  add({
    number: 33,
    label: "共同創作的證據",
    className: "dense",
    content: `${heading(33, "作品之外，還要看人與模型如何分配方向", "共同創作介面會改變提示、採用、拒絕與修訂的粒度；研究若只收成品，就看不到這些控制關係", true)}<div class="collab-studies"><article><h3>CoAuthor</h3><span>63 位作者／1,445 次寫作</span><p>保存每次請求、建議與採用行為，建立可回放的事件層級資料。</p><small>看見過程｜作者何時求助、選了什麼</small></article><article><h3>Wordcraft</h3><span>續寫／改寫／擴寫</span><p>把模型能力放進故事編輯器，由作者選擇局部操作與保留內容。</p><small>看見控制粒度｜段落與選取範圍</small></article><article><h3>Dramatron</h3><span>階層式提示鏈</span><p>從 logline、人物與地點向下生成場景與對話；業界共寫者肯定發想，也指出方法不適合所有流程。</p><small>看見結構假設｜由上而下的劇本觀</small></article><article><h3>Narrative Agency</h3><span>87 篇共寫故事</span><p>人類較常開啟語義新路徑，模型較常沿既有方向展開並調節情緒。</p><small>看見方向權｜誰開路、誰補全</small></article><article class="collective"><h3>個人增益 × 集體趨同</h3><span>Doshi & Hauser</span><p>AI 點子可提高部分個人作品評價，也會提高作品間相似度；文化後果需要另一個評估層級。</p><small>看見作品群｜單篇成功不等於生態多樣</small></article></div><div class="collab-flow"><span>提出方向</span><b>→</b><span>模型生成候選</span><b>→</b><span>接受／拒絕／修改</span><b>→</b><span>版本留下紀錄</span><b>→</b><span>讀者評價＋作品群比較</span></div>`,
    cue: "把共同創作過程與集體趨同補進文本研究；成品分數無法取代事件紀錄。",
    sources: [URL.coauthor, URL.wordcraft, URL.dramatron, URL.narrativeAgency, URL.collectiveDiversity],
  });

  add({
    number: 34,
    label: "創作工具光譜",
    className: "dense",
    content: `${heading(34, "從一段提示到完整寫作環境：工具控制的單位逐步擴大", "比較工具時，核心問題是它記得什麼、能改哪一層、誰看得見中間過程，以及作者能否拒絕", true)}<div class="tool-spectrum"><article><span>01</span>${icon("chat")}<h3>單次提示</h3><p>對話內提供續寫或改寫；上下文與控制單位最小。</p><small>例｜一般 Chat</small></article><i>→</i><article><span>02</span>${icon("folder")}<h3>Skill</h3><p>以說明、腳本與資源封裝可重複的工作方法，依任務載入。</p><small>例｜Agent Skills</small></article><i>→</i><article><span>03</span>${icon("compass")}<h3>診斷／修訂程序</h3><p>把研究差異轉成閱讀鏡頭或修訂清單；規則透明，成效仍需另測。</p><small>例｜Sepia</small></article><i>→</i><article><span>04</span>${icon("layers")}<h3>套裝創作環境</h3><p>管理角色、世界、情節與長期上下文，提供專門的生成與改寫操作。</p><small>例｜Sudowrite／NovelAI</small></article><i>→</i><article><span>05</span>${icon("agent")}<h3>階層式／研究平台</h3><p>串接多步生成、版本、評讀與揭露；可以研究控制與讀者反應。</p><small>例｜Dramatron／本次實驗</small></article></div><div class="sepia-passes"><span><b>Sepia Pass 1</b>敘事架構</span><span><b>Pass 2</b>篇章流動</span><span><b>Pass 3</b>表面語言</span><p>每篇只挑 3–5 個動作；全套套用可能形成另一種穩定指紋。</p></div>`,
    cue: "把 Sepia、Skill、套裝工具與研究平台放進同一條控制光譜。",
    sources: [URL.sepia, URL.skills, URL.sudowrite, URL.novelai, URL.dramatron],
  });

  add({
    number: 35,
    label: "創作工具比較",
    className: "dense",
    content: `${heading(35, "六種工具的研究比較：記憶、控制、紀錄與證據", "產品功能豐富不等於研究資料完整；選擇工具要回到創作目的與可回答的問題", true)}<div class="tool-compare"><div class="tool-compare-head"><span>工具／形式</span><span>長期記憶</span><span>控制單位</span><span>過程紀錄</span><span>目前最適用途</span></div><article><h3>Sepia</h3><p>依使用方式</p><p>三層診斷與 3–5 項修訂</p><p>規則公開；缺獨立成效研究</p><p>近讀、修訂討論</p></article><article><h3>Agent Skill</h3><p>資料夾內說明、腳本、資源</p><p>可封裝完整流程</p><p>可版本控制；執行紀錄另設計</p><p>重複方法與團隊規範</p></article><article><h3>Sudowrite</h3><p>Story Bible 作為持續脈絡</p><p>場景、段落、選取文字與畫布</p><p>偏創作工作流，研究欄位需外接</p><p>商業小說發想與長篇維護</p></article><article><h3>NovelAI</h3><p>Memory／Author’s Note／Lorebook</p><p>依啟動詞把設定注入上下文</p><p>可見記憶規則；研究事件需另存</p><p>世界觀與角色知識維持</p></article><article><h3>Dramatron</h3><p>階層式故事結構</p><p>logline → 人物／地點 → 場景／對話</p><p>研究原型與共同創作者訪談</p><p>劇本式由上而下發展</p></article><article class="highlight"><h3>writing.mashbean.net</h3><p>提示、模型與每次輸出封存</p><p>版本、閱讀鏡頭、匿名評論</p><p>正式／測試分流與揭露順序</p><p>課堂實驗與同儕評讀</p></article></div>`,
    cue: "以記憶、控制單位、紀錄與用途比較 Sepia、Skill、兩個套裝產品、Dramatron 與本次研究平台。",
    sources: [URL.sepia, URL.skills, URL.sudowrite, URL.novelai, URL.dramatron, URL.writing],
  });

  divider(
    35,
    "04",
    "ANONYMOUS PEER REVIEW",
    "匿名同儕審查實驗",
    "現場極短篇提供完整操作流程；返家創作保留版本、揭露順序與評分改變",
    "第四部分進入正式系統、現場練習與隔週研究。",
    [URL.writing, URL.workshop, URL.dashboard],
  );

  add({
    number: 36,
    label: "創作系統",
    className: "dense",
    content: `${heading(36, "研究網站要保存作品，也要保存作品如何出現", "模型、提示層、版本、測試標記、匿名分配與揭露順序都屬研究材料", true)}<div class="architecture"><div class="architecture-list"><div class="architecture-item"><strong>強模型與版本</strong><span>使用當下可用的強模型；保存實際模型名稱、回應 ID、成功與失敗狀態。</span></div><div class="architecture-item"><strong>兩層提示可修改</strong><span>developer 與 user prompt 可編輯；生成時全文封存，避免事後以目前設定重建。</span></div><div class="architecture-item"><strong>正式／測試分流</strong><span>正式樣本、測試 cohort、評讀介面測試與課堂裝置使用不同標記與統計。</span></div><div class="architecture-item"><strong>匿名揭露順序</strong><span>作品與評論先建立關係；提示、評論來源與作者資訊依研究階段開放。</span></div></div><img src="assets/writing-home.png" alt="AI 文學創作工作坊首頁"></div>`,
    cue: "說明資料欄位與研究目的，避免把網站理解成單純生成器。",
    sources: [URL.writing, URL.article],
  });

  add({
    number: 37,
    label: "現場完整流程",
    className: "dense",
    content: `${heading(37, "九月二日：一堂課內完成的極短篇流程", "裝置代號、300 字生成、匿名短評與全班讀回都在 120 分鐘內發生", true)}<div class="flow workshop-flow">${flowNode("01", "取得動物代號", "裝置為單位，不輸入姓名")}${flowNode("02", "設定作品方向", "共同題目＋創作者補充")}${flowNode("03", "選 0–2 個鏡頭", "結構提醒保持可見")}${flowNode("04", "交換匿名短評", "一個分數、一句具體回應")}${flowNode("05", "全班讀回", "儀表板呈現進度、作品與評論", "accent-node")}</div><div class="grid grid-2 mini-cards"><p><strong>系統記錄｜</strong>動物代號、提示、選取鏡頭、完整輸出、字數、模型與評論。</p><p><strong>課堂觀察｜</strong>創作者採用哪些提醒；讀者是否在作品中感受到相對應的差異。</p></div>`,
    cue: "現場完整流程用臺灣用語呈現。",
    sources: [URL.workshop, URL.dashboard, URL.article],
  });

  add({
    number: 38,
    label: "動物代號與儀表板",
    className: "dense",
    content: `${heading(38, "用狀態模型取代空白儀表板截圖", "投影片呈現課堂當下會看到的資訊關係；數字與代號是教學示意，不使用正式研究或測試資料", true)}<div class="dashboard-redesign"><article class="participant-console"><div class="console-top"><span>參與者端</span><small>裝置匿名</small></div><div class="animal-id"><span class="animal">獺</span><div><small>你的代號</small><strong>水獺－07</strong></div></div><div class="participant-steps"><p class="done"><b>✓</b><span><strong>極短篇已送出</strong>318 字・1 個閱讀鏡頭</span></p><p class="active"><b>2</b><span><strong>匿名評讀中</strong>分配到：山羌－04</span></p><p><b>3</b><span><strong>等待全班讀回</strong>作品與評論維持代號顯示</span></p></div><div class="privacy-note">不輸入姓名；代號隔開文本與身分。小班可識別性仍由主持規範處理。</div></article><article class="live-dashboard"><div class="dashboard-top"><div><small>LIVE CLASSROOM</small><strong>極短篇交換狀態</strong></div><span class="live-dot">● 即時</span></div><div class="dashboard-metrics"><p><strong>24</strong><span>裝置</span></p><p><strong>19</strong><span>作品完成</span></p><p><strong>17</strong><span>評論完成</span></p><p><strong>71%</strong><span>整體進度</span></p></div><div class="dashboard-bars"><p><span>創作</span><i><b style="width:79%"></b></i><strong>19 / 24</strong></p><p><span>分配</span><i><b style="width:92%"></b></i><strong>22 / 24</strong></p><p><span>評論</span><i><b style="width:71%"></b></i><strong>17 / 24</strong></p></div><div class="status-list"><div><span class="status-animal">獺</span><strong>水獺－07</strong><em class="green">評論中</em><small>14:32 更新</small></div><div><span class="status-animal">羌</span><strong>山羌－04</strong><em class="purple">已完成</em><small>14:31 更新</small></div><div><span class="status-animal">鯨</span><strong>虎鯨－12</strong><em class="amber">創作中</em><small>14:30 更新</small></div></div><div class="illustrative-label">課堂介面示意｜不含真實參與者資料</div></article></div>`,
    cue: "撤掉空白測試截圖，改用可讀的狀態模型說明參與者端與主持端；數字均為教學示意。",
    sources: [URL.workshop, URL.dashboard, URL.callin],
  });

  add({
    number: 39,
    label: "現場開始",
    className: "dense",
    content: `${heading(39, "九月二日現場操作", "完成一篇 300 字極短篇，交換一句匿名短評，最後回到全班閱讀", true)}<div class="cta-grid"><div><img class="qr" src="assets/qr-workshop.png" alt="writing.mashbean.net/workshop QR code"><p class="mono purple qr-label">writing.mashbean.net/workshop</p></div><div class="schedule"><div class="schedule-row"><time>16:00–17:25</time><strong>創作</strong><span>共同題目、創作者補充、最多兩個結構提醒；每台裝置送出一篇。</span></div><div class="schedule-row"><time>17:25–17:45</time><strong>評論</strong><span>系統匿名分配另一篇作品；選閱讀角度，留下具體短評。</span></div><div class="schedule-row"><time>17:45–18:00</time><strong>讀回</strong><span>查看儀表板，討論提醒、文本差異、評論品質與規則。</span></div></div></div>`,
    cue: "現場可調整時間；投影片顯示目前建議節奏。",
    sources: [URL.workshop, URL.dashboard],
  });

  add({
    number: 40,
    label: "返家創作與正式研究",
    className: "dense",
    content: `${heading(40, "九月九日：返家創作、匿名評讀與分階段揭露", "截止時間、原始評論、提示揭露後評分與來源判斷都會分開保存", true)}<div class="deadline-grid"><article class="deadline"><span class="letter">A</span><time>09 / 07 23:59</time><h3>創作截止</h3><p>完成較長作品；最多五次成功生成。每一版保存實際提示、模型與輸出。</p></article><article class="deadline"><span class="letter">B</span><time>09 / 09 15:30</time><h3>評論截止</h3><p>只看匿名作品；每篇保存一個分數與一句短評，送出後封存。</p></article><article class="deadline highlight"><span class="letter">C</span><time>09 / 09 16:00</time><h3>提示揭露</h3><p>畫面保留第一輪評論與分數，同時顯示完整提示，記錄評分是否改變。</p></article><article class="deadline"><span class="letter">D</span><time>課堂／課後</time><h3>來源與方法回收</h3><p>比較人類與 AI 評論；討論控制感、平滑度、修訂用途與研究限制。</p></article></div><p class="method-foot">正式樣本、測試 cohort 與評讀介面測試分開計數。既有三則測試評論仍保存在遠端資料庫。</p>`,
    cue: "說明正式研究的時間、揭露順序與資料保存。",
    sources: [URL.writing, URL.article],
  });

  add({
    number: 41,
    label: "結語",
    className: "inverse",
    content: `${eyebrow(41, "文學制度面對合成文本的三項基礎工作")}<p class="thesis">在進行工具批判之前，<br>不妨先透過操作理解技術真實影響，<br><span class="mark">以及反思技術帶來的競賽、創作與品味文化的改變。</span></p><div class="closing-links"><span>文學獎分析｜研究文章｜創作入口｜即時儀表板</span><span class="mono purple">mashbean.net</span></div>`,
    cue: "結語回到作品、工具與程序三層。",
    sources: [URL.tsmc, URL.article, URL.writing, URL.dashboard],
  });

  deck.innerHTML = slides.map((slide) => slide.html).join("");
  notesNode.textContent = JSON.stringify(slides.map((slide) => slide.note));

  const overlay = document.createElement("div");
  overlay.id = "note-overlay";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "名詞解釋");
  overlay.innerHTML = '<article class="note-card"><button class="note-close" type="button" aria-label="關閉註解">×</button><div class="note-content"></div></article>';
  document.body.append(overlay);

  let activeNote = null;
  const closeNote = () => {
    overlay.hidden = true;
    overlay.querySelector(".note-content").innerHTML = "";
    activeNote?.focus();
    activeNote = null;
  };
  const openNote = (ref) => {
    const body = ref.querySelector(".note-body");
    if (!body) return;
    activeNote = ref;
    overlay.querySelector(".note-content").innerHTML = body.innerHTML;
    overlay.hidden = false;
    overlay.querySelector(".note-close").focus();
  };

  document.addEventListener(
    "click",
    (event) => {
      const ref = event.target.closest?.(".note-ref");
      if (ref) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openNote(ref);
        return;
      }
      if (event.target === overlay || event.target.closest?.(".note-close")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeNote();
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      const ref = event.target.closest?.(".note-ref");
      if (ref && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openNote(ref);
      } else if (event.key === "Escape" && !overlay.hidden) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeNote();
      }
    },
    true,
  );
})();
