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
    sepia: "https://github.com/Nanako0129/sepia/",
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
    [URL.sepia, "GitHub｜Sepia"],
    [URL.writing, "writing.mashbean.net｜正式研究"],
    [URL.workshop, "writing.mashbean.net/workshop｜現場練習"],
    [URL.dashboard, "writing.mashbean.net｜即時儀表板"],
  ]);

  const notes = (cue, sources) =>
    `${cue}\n\n[Sources]\n${sources.map((source) => `- ${source}`).join("\n")}`;
  const eyebrow = (number, label) =>
    `<div class="eyebrow"><span class="num">${String(number).padStart(2, "0")}</span>${label}</div>`;
  const heading = (number, label, title, compact = false) =>
    `${eyebrow(number, label)}<h2 class="title${compact ? " compact" : ""}">${title}</h2>`;
  const slideNo = (number) => `<span class="slide-no">${String(number).padStart(2, "0")}</span>`;
  const metric = (value, label, sub = "", accent = "var(--purple)") =>
    `<div class="metric" style="--accent:${accent}"><span class="value">${value}</span><span class="label">${label}</span>${sub ? `<span class="sub">${sub}</span>` : ""}</div>`;
  const card = ({ kicker, title, body, className = "", accent = "" }) =>
    `<article class="card ${className}"${accent ? ` style="--accent:${accent}"` : ""}>${kicker ? `<p class="card-kicker">${kicker}</p>` : ""}<h3>${title}</h3><p>${body}</p></article>`;
  const flowNode = (step, title, body, className = "") =>
    `<article class="flow-node ${className}"><span class="step">${step}</span><h3>${title}</h3><p>${body}</p></article>`;
  const sourceStrip = (sources) =>
    `<div class="slide-sources"><span>資料來源</span>${sources
      .map(
        (source) =>
          `<a href="${source}" target="_blank" rel="noreferrer">${sourceName.get(source) || source.replace(/^https:\/\//, "")}</a>`,
      )
      .join("")}</div>`;

  function add({ number, label, className = "", content, cue, sources }) {
    if (!sources?.length) throw new Error(`Slide ${number} is missing visible sources`);
    slides.push({
      html: `<section data-label="${String(number).padStart(2, "0")} ${label}" class="${className}"><div class="frame">${content}</div>${sourceStrip(sources)}${slideNo(number)}</section>`,
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
    content: `<p class="cover-kicker">AI 文學創作工作坊 ／ 2026.09.02・09.09</p><h1 class="cover-title">我們距離機器會夢見<span>電子羊</span>的時代有多近？</h1><p class="cover-subtitle">文學獎評選爭議、合成工具賞析、匿名同儕審查實驗</p><div class="cover-meta"><span>臺文所 530 教室｜16:00–18:00</span><span>案例分析 × 研究方法 × 創作實驗</span></div>`,
    cue: "封面。電子羊連到文學想像、合成文本與判斷制度三個部分。",
    sources: [URL.tsmc, URL.article, URL.writing],
  });

  add({
    number: 2,
    label: "核心問題",
    className: "inverse",
    content: `${eyebrow(2, "機器能生成小說以後，文學制度要回答什麼")}<p class="thesis">我們需要同時辨認三件事：<br><span class="mark">作品做了什麼、工具介入哪裡、判斷程序如何成立。</span></p><p class="inverse-note">文風直覺、偵測分數與作者身分都只能提供局部訊號。公開規則、可核對紀錄與同儕閱讀，決定這些訊號如何被使用。</p>`,
    cue: "全場主命題。把作品、工具、程序留在同一張圖裡。",
    sources: [URL.tsmc, URL.article, URL.writing],
  });

  add({
    number: 3,
    label: "今天的路線",
    className: "dense",
    content: `${heading(3, "今天的路線", "四個部分，共用同一個問題：判斷如何留下證據", true)}<div class="grid grid-4 route-grid">${[
      ["01", "文學獎爭議", "四方地圖、三次會議、五位評審的判準移動，以及公開紀錄的證據邊界。"],
      ["02", "我的 AI 使用", "從 Chat、Agent、研究生產線，到小說書架與審議民主互動工具。"],
      ["03", "合成工具賞析", "StoryScope 的資料與方法、Sepia 的修訂轉譯、中文短篇的外推限制。"],
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
    content: `${heading(5, "〈實白〉的兩次投票", "分數從 36 降到 9；投票承擔的任務也跟著改變", true)}<div class="vote-row compact-vote">${metric("36", "6 月 27 日｜匿名文本評選", "首獎") }<div class="vote-arrow">→</div>${metric("9", "7 月 2 日｜加入檢舉與作者說明", "佳作", "var(--red)")}${card({ kicker: "公開證據", title: "評審承認無法提出實證", body: "公開材料是三次決審紀要／記錄整理。沒有錄音可逐句核對，完整檢舉信與附件也未公開。", className: "dark", accent: "var(--acid)" })}</div><div class="context-band"><strong>評判對象的變化</strong><span>匿名文本 → 規則與公平 → 作者說明與信任</span><span>這張圖確認判準移動，沒有判定作品如何生成。</span></div>`,
    cue: "交代兩次投票與證據狀態；右下來源連到 mashbean.net/decks 的完整子頁。",
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
    number: 7,
    label: "三次會議",
    className: "dense",
    content: `${heading(7, "三次會議，三種評判對象", "分數改變以前，評審面對的問題已經改變", true)}<div class="timeline"><article class="timeline-step" data-step="1" style="--accent:var(--purple)"><time>6 / 27</time><h3>匿名評文本</h3><p>精準、節制、情感複雜。作品的成熟與完整引起遲疑，同時也是高分理由，最後得到首獎。</p></article><article class="timeline-step" data-step="2" style="--accent:var(--amber)"><time>7 / 1</time><h3>收到來信後評制度</h3><p>作者說明尚未出現，討論已轉向自建模型、代筆、公平、教育訊號與首獎從缺。</p></article><article class="timeline-step" data-step="3" style="--accent:var(--red)"><time>7 / 2</time><h3>讀回應後評信任</h3><p>沒有新增可驗證技術證據；回答是否迴避、是否聰明與是否可信進入最後投票。</p></article></div><p class="timeline-conclusion">同一個分數欄位，依序承載文學評價、制度處理與信任審查。紀要沒有說明三者應如何加權。</p>`,
    cue: "把三次會議的評判對象分開閱讀。",
    sources: [URL.tsmc, URL.minutes],
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
    label: "三種禁線來源",
    className: "dense",
    content: `${heading(9, "周芬伶、林俊頴、連明偉", "同樣大幅降分，分別從教育、程序與文化公平出發", true)}<div class="grid grid-3 judge-cards">${card({ kicker: "周芬伶｜8 → 1", title: "人文教育的界線", body: "6/27 仍給全場最高分。加入 AI 脈絡後，她主張文學教育需要明確禁線，個案也承擔了對未來參賽者的警示功能。<br><br><strong>分析問題：</strong>教育訊號能否取代事前規則與證據門檻？", className: "tall red-card" })}${card({ kicker: "林俊頴｜7 → 3", title: "程序與倫理的拉扯", body: "他最清楚指出比賽中途不能改規則，也最坦白承認缺乏實證；最後仍以灰色地帶與道德瑕疵支持重投。<br><br><strong>分析問題：</strong>自由心證可以承擔多大的不確定性？", className: "tall purple-card" })}${card({ kicker: "連明偉｜6 → 1", title: "公平與成熟風格", body: "他持續喜歡作品，也承認協作未必違規；「太乾淨」逐步連到起跑點差異與文學精神。<br><br><strong>分析問題：</strong>成熟風格是查核線索，或青年寫作的類型預設？", className: "tall amber-card" })}</div>`,
    cue: "三位評審都處理公平，使用的證據與規範來源不同。",
    sources: [URL.tsmc, URL.minutes],
  });

  add({
    number: 10,
    label: "揭露條件與信任審查",
    className: "dense",
    content: `${heading(10, "黃崇凱、顧玉玲與兩位非投票者", "分類、揭露、信任與象徵效果同時進入評選", true)}<div class="grid grid-2 judge-detail">${card({ kicker: "黃崇凱｜8 → 2", title: "以揭露條件重建獎項正當性", body: "他追問獎項究竟在獎勵創作或工具技巧，並提出模型、流程與協作標示三項條件。這套條件可以成為未來規則；用於當屆作品時，會遇到事後形成的程序問題。", className: "purple-card" })}${card({ kicker: "顧玉玲｜7 → 2", title: "技術開放轉向信任審查", body: "她原先期待人與技術出現新合作，也相信作者具備寫作能力。書面說明被理解為避重就輕以後，作者如何回答成為決定性因素，技術問題也跨入人格與可信度。", className: "red-card" })}</div><div class="dual-note"><p><strong>王盛弘｜</strong>提醒回到既有辦法；AI 是否等於抄襲或代筆仍缺少答案。</p><p><strong>許峻郎｜</strong>較重視公正、教育理念與首獎從缺所傳達的象徵訊號。</p></div>`,
    cue: "補入兩位非投票者，顯示主辦方內部的制度焦點也有差異。",
    sources: [URL.tsmc, URL.minutes],
  });

  add({
    number: 11,
    label: "四個分歧",
    className: "dense",
    content: `${heading(11, "爭議集中在四個可設計的問題", "每一題都需要事前規則、證據門檻與決定權", true)}<div class="grid grid-2 issue-grid">${[
      ["01", "成熟與完整能否成為 AI 線索？", "第一次會議裡，成熟同時構成高分理由。後來的懷疑放大了同一特徵，線索與結論之間缺少查核步驟。"],
      ["02", "當年規則如何處理 AI 協作？", "辦法沒有生成式 AI 條款。評審嘗試借用抄襲、代筆、倫理與教育理念補足，四種概念的責任條件並不相同。"],
      ["03", "評文本、評控制或評過程？", "創作過程進入評選以後，揭露到什麼程度、何種使用影響名次、由誰查核，都需要被寫成規則。"],
      ["04", "作者說明如何成為證據？", "具體問題、回答期限、可接受材料與申復方式尚未列明，回答語氣卻進入分數，容易把程序不確定性轉嫁給個人。"],
    ]
      .map(([n, t, b], i) => card({ kicker: n, title: t, body: b, className: i === 3 ? "purple-card" : "" }))
      .join("")}</div>`,
    cue: "將爭議改寫成未來可以事前設計的四個問題。",
    sources: [URL.tsmc, URL.minutes, URL.rules],
  });

  add({
    number: 12,
    label: "證據邊界",
    className: "dense",
    content: `${heading(12, "公開材料能支持到哪裡", "事實、編輯性推論與未知需要分開陳述", true)}<div class="grid grid-2 boundary-cards">${card({ kicker: "公開紀要可以確認", title: "判準與決策程序確實移動", body: "規則沒有生成式 AI 條款。<br>第一次匿名評選高度肯定〈實白〉。<br>外部來信、作者說明與信任判斷改變投票。<br>評審明白表示無法提出真憑實據。", className: "green-card" })}${card({ kicker: "公開材料仍未提供", title: "作品實際生成方式與完整查核材料", body: "作品是否由生成式 AI 生成或改寫。<br>完整檢舉信、附件與資料取得方式。<br>作者提交的歷程能否滿足某套查核標準。<br>紀要是否涵蓋電話與群組討論。", className: "red-card" })}</div><p class="lead serif center boundary-question">規則尚未準備好時，誰可以把懷疑轉成後果？</p>`,
    cue: "結論停在證據邊界；完整分析可由來源列開啟。",
    sources: [URL.tsmc, URL.minutes, URL.rules, URL.author],
  });

  add({
    number: 13,
    label: "制度設計",
    className: "dense",
    content: `${heading(13, "下一屆規則需要回答的六件事", "將價值衝突寫成可預期、可執行、可申復的程序", true)}<div class="six-grid">${[
      ["允許範圍", "構想、查找、修辭、翻譯、生成、重寫各自如何處理。"],
      ["揭露內容", "工具名稱、提示、版本、修改比例或創作說明需要到什麼程度。"],
      ["啟動門檻", "何種訊號足以開始查核，文風直覺能扮演什麼角色。"],
      ["證據分量", "版本紀錄、草稿、答辯、偵測器與第三方材料如何加權。"],
      ["資料保護", "蒐集範圍、保存期限、可接觸者與刪除方式。"],
      ["申復程序", "具體指控、回應期限、複核者與利益衝突迴避。"],
    ].map(([t,b],i)=>`<article><span>0${i+1}</span><h3>${t}</h3><p>${b}</p></article>`).join("")}</div>`,
    cue: "把爭議轉成下一屆可以落地的六項規則。",
    sources: [URL.tsmc, URL.rules],
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
    label: "Chat 與 Agent",
    className: "dense",
    content: `${heading(16, "Chat 與 Agent 是兩種工作形態", "一段對話處理思考與表達；一套流程可以操作工具、維持狀態並接受驗證", true)}<div class="grid grid-2 chat-agent">${card({ kicker: "CHAT｜一段對話", title: "拆題、比較、解釋、反駁、改寫", body: "你提供問題與材料，模型回到對話裡協助理解。對話結束後，外部世界通常沒有被改動；結果仍需要你自行放進文件、網站或流程。", className: "purple-card" })}${card({ kicker: "AGENT｜一套工作流程", title: "讀檔、查來源、修改、測試、部署、回報", body: "代理取得工具和狀態後，可以完成多個相依步驟。每一步都要有範圍、權限、停止條件與結果驗證，否則錯誤也會被自動化。", className: "dark" })}</div><p class="context-band"><strong>我的分工</strong><span>Chat 適合情緒、方向與概念來回；Agent 適合範圍清楚且能驗收的工作。</span></p>`,
    cue: "恢復 C-LAB 第 4–5 頁的工具差異與實務分工。",
    sources: [URL.clab],
  });

  add({
    number: 17,
    label: "模型與推理時間",
    className: "dense",
    content: `${heading(17, "模型費用要和人類審稿成本一起算", "強模型、足夠推理時間與清楚驗收，常比大量廉價輸出省事", true)}<div class="metrics reasoning-metrics">${metric("1×", "問題寫清楚", "目標、材料、限制、輸出格式")}${metric("10×", "允許多走幾步", "反證、比較、工具呼叫、驗證", "var(--acid)")}${metric("0×", "無驗收的大量輸出", "文字便宜，判讀與修復仍昂貴", "var(--red)")}</div><div class="grid grid-2 mini-cards"><p><strong>原始經驗一｜</strong>即時模型、思考模型與深度研究適合不同任務。高風險問題需要較慢的查核和反證。</p><p><strong>原始經驗二｜</strong>月費和 API 成本應與聘用、延誤、返工及錯誤發布的成本比較。</p></div>`,
    cue: "恢復 C-LAB 第 6–7 頁：模型思考時間與成本比較。",
    sources: [URL.clab],
  });

  add({
    number: 18,
    label: "兩個轉折時刻",
    className: "dense",
    content: `${heading(18, "兩個讓我改變工作方式的時刻", "關鍵發生在一整段工作被接起來，並且留下可核對結果", true)}<div class="grid grid-2 aha-grid">${card({ kicker: "AHA 01｜1,000+ 個檔案", title: "整理一個真的很亂的資料夾", body: "代理讀取結構、找出重複與例外、提出搬移計畫、逐步執行並留下紀錄。價值來自可回復的操作、範圍控制與結果盤點，超過一次分類建議。", className: "purple-card" })}${card({ kicker: "AHA 02｜拖了好幾年的部落格", title: "網站終於成為公開成果", body: "內容整理、設計實作、建置檢查、部署與正式網址驗證被接成同一段工作。程式完成、版本推送、公開可讀是三個需要分別確認的狀態。", className: "green-card" })}</div><p class="context-band"><strong>工作觀的改變</strong><span>我開始把模型放進可回復、可驗收的流程，聊天回答只佔其中一小段。</span></p>`,
    cue: "恢復 C-LAB 第 9–10 頁的原始案例與尺度。",
    sources: [URL.clab, URL.pro],
  });

  add({
    number: 19,
    label: "每天一個困難問題",
    className: "inverse dense",
    content: `${eyebrow(19, "每天一個真正困難的問題")}<h2 class="inverse-title">研究能力來自問題、材料、反例與公開結果的反覆往返。</h2><div class="question-list"><p>國際上哪些媒體收益分潤模式真的有效？</p><p>我們如何評估流亡社群的影響力？</p><p>AI Agent 身分需要什麼政策？</p><p>各國年齡驗證法律的真實效果是什麼？</p></div><p class="inverse-note">這些問題沒有現成同事可以陪我長期追查。代理提供執行能力，研究責任仍包含來源選擇、反證與公開驗收。</p>`,
    cue: "恢復 C-LAB 第 16–17 頁的四個原始研究問題。",
    sources: [URL.clab, URL.pro],
  });

  add({
    number: 20,
    label: "研究生產線",
    className: "dense",
    content: `${heading(20, "五個角色，一條可以重跑的研究生產線", "每個角色有不同交付物；每種推論也有不同失敗方式", true)}<div class="flow research-flow">${flowNode("01", "研究者", "蒐集一手來源、界定可說範圍")}${flowNode("02", "寫作者", "組織脈絡、例子與讀者路徑")}${flowNode("03", "批判者", "找反例、替代解釋與利益衝突")}${flowNode("04", "編輯", "壓縮重複、標示推論層級")}${flowNode("05", "發布者", "建置、部署、打開正式網址驗證", "accent-node")}</div><div class="reasoning-strip"><span>演繹｜前提若錯，結論會整批失效</span><span>歸納｜樣本與選擇偏誤</span><span>類比｜相似處遮住關鍵差異</span><span>溯因｜最佳解釋仍可能有替代方案</span><span>因果｜相關、時序與機制需要分開</span></div>`,
    cue: "恢復 C-LAB 第 12–15 頁的五個角色、推論結構與風險。",
    sources: [URL.clab, URL.pipeline],
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
    label: "能力與智能",
    className: "dense",
    content: `${heading(24, "工具提高可完成的事情，也可能降低獨立能力", "拿掉工具以後留下多少理解，是判斷增益或削弱的重要線索", true)}<div class="grid grid-2 capability-grid">${card({ kicker: "工具增加的能力", title: "搜尋、計算、生成、協調與執行", body: "使用者可以處理更大範圍、更高速度與更多步驟的任務。表面產出能力上升，仍需檢查判斷是否同步成長。", className: "green-card" })}${card({ kicker: "使用者留下的能力", title: "模型、原理、判準與轉移能力", body: "能在腦中重建工具的運作方式，使用者較能換工具、處理例外與辨認失效。流程完全隱藏時，依賴會增加。", className: "red-card" })}</div><p class="context-band"><strong>David Krakauer 的問題</strong><span>能力不等同智能。工具帶來的外顯表現，需要和使用者內化的理解分開觀察。</span></p>`,
    cue: "C-LAB 附錄第 21–23 頁的能力與內化概念。",
    sources: [URL.clab],
  });

  add({
    number: 25,
    label: "工具如何內化",
    className: "dense",
    content: `${heading(25, "可解釋、可內化、可轉移", "工具與使用者形成一個系統；設計要讓能力能夠回到人身上", true)}<div class="flow four internal-flow">${flowNode("你", "提出目的", "說明要改善的情境與判準")}${flowNode("AI", "展開路徑", "提供候選解法、問題與反例", "dark-node")}${flowNode("資料與工具", "執行與驗證", "留下來源、版本、測試與錯誤")}${flowNode("你", "形成可轉移理解", "採用、修正、停止，也能解釋理由", "accent-node")}</div><div class="reasoning-strip"><span>可解釋 → 能理解結構</span><span>可內化 → 能在腦中重建</span><span>可轉移 → 換工具仍能處理</span><span>互補 → 人與工具各自承擔擅長部分</span></div>`,
    cue: "C-LAB 附錄第 24–27 頁的工具範圍、轉導與內化流程。",
    sources: [URL.clab],
  });

  add({
    number: 26,
    label: "LLM 與研究問題",
    className: "inverse dense",
    content: `${eyebrow(26, "LLM 當作神諭，會成為思想的 GPS")}<h2 class="inverse-title">把正確答案的要求，改寫成可以檢查的研究問題。</h2><div class="question-list two"><p>這個結論依賴哪些前提與資料選擇？</p><p>哪一個反例會讓結論失效？</p><p>還有哪些替代解釋沒有被排除？</p><p>公開結果如何讓第三者重做或質疑？</p></div><p class="inverse-note">四個操作原則：目標說清楚、材料給完整、主動要求反證、打開正式結果驗收。</p>`,
    cue: "C-LAB 附錄第 28–29 頁轉成四個可直接使用的研究問題。",
    sources: [URL.clab, URL.pipeline],
  });

  divider(
    27,
    "03",
    "SYNTHETIC FICTION",
    "合成工具賞析：StoryScope 與 Sepia",
    "AI 小說常見問題位在語氣下方；敘事架構、因果、揭露與情緒策略需要一起閱讀",
    "這一部分區分論文實證、工具轉譯與工作坊設計。",
    [URL.article, URL.storyscope, URL.sepia],
  );

  add({
    number: 28,
    label: "問題脈絡",
    className: "dense",
    content: `${heading(28, "表面語氣改掉以後，故事可能仍沿著同一條軌道", "破折號、華麗形容詞與排比容易處理；主題、因果、情緒與結尾需要結構修改", true)}<div class="grid grid-2 structure-layer">${card({ kicker: "表面層", title: "詞彙、句法、陳腔與節奏", body: "這些特徵醒目、可快速改寫，也會隨模型版本和提示改變。許多 humanizer 主要停在這一層。", className: "purple-card" })}${card({ kicker: "敘事層", title: "意義、因果、時間、揭露與人物關係", body: "故事可能持續過度解釋主題、維持單一因果線、用內在成長收束，或把情緒集中寫成身體反應。", className: "dark" })}</div><p class="context-band"><strong>StoryScope 的研究問題</strong><span>排除大多數表面風格訊號後，敘事選擇能否區分人類與模型故事？</span></p>`,
    cue: "建立研究脈絡，說明文章標題『語氣下面』的含義。",
    sources: [URL.article, URL.storyscope],
  });

  add({
    number: 29,
    label: "StoryScope 方法",
    className: "dense",
    content: `${heading(29, "StoryScope 的資料與五段分析流程", "同題六篇故事、模型中介的特徵抽取，以及題目層級的測試切分", true)}<div class="metrics method-metrics">${metric("10,272", "同題組", "Books3 人類故事＋5 個模型")}${metric("61,608", "篇故事", "平均 4,753 words", "var(--acid)")}${metric("304", "特徵", "十個 NarraBench 敘事面向", "var(--green)")}</div><div class="method-line"><span>① GPT-5.1 結構化模板</span><span>② 100 組／600 篇盲化比較</span><span>③ 408 候選去重為 304</span><span>④ Gemini 3 Flash 全量標記</span><span>⑤ XGBoost＋SHAP＋bootstrap</span></div><p class="method-foot">可靠度檢查：五次重跑 Krippendorff’s α = 0.90；240 個故事特徵項目的人機 Cohen’s κ 平均 0.84。特徵仍由模型抽取，測量本身需要納入限制。</p>`,
    cue: "完整交代資料來源、模型分工與驗證方式。",
    sources: [URL.storyscope, URL.storyscopeRepo, URL.article],
  });

  add({
    number: 30,
    label: "分類結果",
    className: "dense",
    content: `${heading(30, "93.2% 的適用條件", "數字描述封閉資料集的分類表現，沒有提供個別投稿的 AI 機率", true)}<div class="metrics result-metrics">${metric("93.2", "敘事特徵 macro-F1", "Human / AI；257 features")}${metric("84.8", "核心特徵 macro-F1", "Human / AI；30 features", "var(--green)")}${metric("68.4", "六方來源 macro-F1", "Human＋5 models", "var(--amber)")}</div><div class="grid grid-2 mini-cards"><p><strong>測試條件｜</strong>8,739 組題目訓練；1,377 組題目、8,262 篇故事完全留出測試；同題版本不會跨越訓練與測試。</p><p><strong>壓力測試｜</strong>長度配對後仍為 93.2%；278 篇 Gemini 故事經 LAMP 表面修訂後，分類由 95.5% 降至 93.9%。</p></div>`,
    cue: "把分類表現、測試設計與個案外推邊界放在同一頁。",
    sources: [URL.storyscope, URL.article],
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
    number: 32,
    label: "推論限制",
    className: "dense",
    content: `${heading(32, "推論的六個限制", "每一項都會影響這套研究如何進入中文、短篇、教室與文學獎", true)}<div class="six-grid limits">${[
      ["英文長篇", "平均 4,753 words；中文 300 字無法承載相同特徵密度。"],
      ["反推題目", "題目由既有人類作品生成，和自然發生的多輪人機協作仍有距離。"],
      ["模型量測", "模板、比較、特徵發現與標記都由其他模型參與。"],
      ["封閉來源", "分類器只面對已知的人類與五個特定模型版本。"],
      ["品質未測", "來源分得開，沒有回答讀者喜好與作品價值。"],
      ["Books3 倫理", "原文沒有公開，語料取得與作者同意爭議仍然存在。"],
    ].map(([t,b],i)=>`<article><span>0${i+1}</span><h3>${t}</h3><p>${b}</p></article>`).join("")}</div><p class="method-foot">因此：這套結果可以擴充閱讀語彙與研究設計，無法直接成為中文個案判源器。</p>`,
    cue: "第二版文章補入的六個盲點。",
    sources: [URL.storyscope, URL.article],
  });

  add({
    number: 33,
    label: "Sepia 轉譯",
    className: "dense",
    content: `${heading(33, "Sepia 將研究差異轉成三層修訂程序", "從統計相關走向修改處方，需要額外成效研究與創作者選擇", true)}<div class="grid grid-3 sepia-grid">${card({ kicker: "PASS 1", title: "敘事架構", body: "主題明說、因果鏈、揭露位置、人物網絡、結尾模式與情緒策略。", className: "purple-card" })}${card({ kicker: "PASS 2", title: "篇章流動", body: "段落模板、中段鬆弛、節奏、資訊位置與問答式組織。", className: "green-card" })}${card({ kicker: "PASS 3", title: "表面語言", body: "陳腔、句法模板、詞彙、語域與感官重複。", className: "amber-card" })}</div><div class="grid grid-2 mini-cards"><p><strong>工具自我限制｜</strong>每篇挑 3–5 個動作，目標落在人類分布中段；三十項全套使用會形成另一套穩定指紋。</p><p><strong>目前證據｜</strong>repository 提供規則、研究整理與操作方式，尚未提供獨立讀者研究證明作品品質或人類感提升。</p></div>`,
    cue: "清楚區分 StoryScope 的實證與 Sepia 的規範性轉譯。",
    sources: [URL.sepia, URL.storyscope, URL.article],
  });

  add({
    number: 34,
    label: "工作坊採用範圍",
    className: "dense",
    content: `${heading(34, "這次工作坊只採用四個可見的閱讀鏡頭", "參與者可完全不選，最多選兩項；系統保存選擇、提示、模型與輸出", true)}<div class="grid grid-4 adoption-grid">${card({ kicker: "01", title: "主題明說", body: "保留空白，或要求前文承擔更多意義。" })}${card({ kicker: "02", title: "揭露時機", body: "調整資訊出現順序與重新理解的深度。" })}${card({ kicker: "03", title: "情緒策略", body: "比較身體、動作、命名、對話與沉默。" })}${card({ kicker: "04", title: "因果鬆動", body: "加入偶然、旁支、未解關係或不完整收束。", className: "purple-card" })}</div><div class="context-band"><strong>採用界線</strong><span>網站不提供判源分數，也不在背景自動改寫。創作者看見選項並決定是否採用，匿名讀者只回應實際閱讀效果。</span></div>`,
    cue: "將研究轉成四個透明、可拒絕、可記錄的課堂選項。",
    sources: [URL.article, URL.storyscope, URL.sepia, URL.workshop],
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
    content: `${heading(38, "動物代號降低現場負擔，也隔開文本與身分", "每台裝置固定一個代號；儀表板只顯示完成狀態、作品與匿名評論", true)}<div class="image-pair"><figure class="image-panel"><img src="assets/workshop.png" alt="工作坊取得動物代號頁面"><figcaption>參與者端｜取得代號、生成一篇、收到一篇評讀任務</figcaption></figure><figure class="image-panel"><img src="assets/dashboard.png" alt="課堂即時成果儀表板"><figcaption>主持端｜裝置、作品、分配與評論的即時狀態</figcaption></figure></div><p class="image-note">代號提供課堂匿名性，無法單獨解決裝置共用、旁觀推測與小班可識別性；主持人仍需說明資料用途與公開範圍。</p>`,
    cue: "補充匿名設計的用途與限制。",
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
    content: `${eyebrow(41, "文學制度面對合成文本的三項基礎工作")}<p class="thesis">讓工具介入有紀錄，<br>讓文學判斷有理由，<br><span class="mark">讓受影響的人有申復與修正的空間。</span></p><div class="closing-links"><span>文學獎分析｜研究文章｜創作入口｜即時儀表板</span><span class="mono purple">mashbean.net</span></div>`,
    cue: "結語回到作品、工具與程序三層。",
    sources: [URL.tsmc, URL.article, URL.writing, URL.dashboard],
  });

  deck.innerHTML = slides.map((slide) => slide.html).join("");
  notesNode.textContent = JSON.stringify(slides.map((slide) => slide.note));
})();
