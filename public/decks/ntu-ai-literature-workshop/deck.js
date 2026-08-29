(() => {
  "use strict";

  const deck = document.querySelector("#workshop-deck");
  const notesNode = document.querySelector("#speaker-notes");
  const slides = [];

  const URL = {
    tsmc: "https://tsmc-literature-award-analysis.mashbean55700.chatgpt.site/",
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

  const notes = (cue, sources = []) =>
    `${cue}\n\n[Sources]\n${(sources.length ? sources : ["使用者提供的工作坊資訊"]).map((source) => `- ${source}`).join("\n")}`;

  const eyebrow = (number, label) =>
    `<div class="eyebrow"><span class="num">${String(number).padStart(2, "0")}</span>${label}</div>`;
  const heading = (number, label, title, compact = false) =>
    `${eyebrow(number, label)}<h2 class="title${compact ? " compact" : ""}">${title}</h2>`;
  const pageLink = (url, label = url.replace(/^https:\/\//, "")) =>
    `<p class="page-link"><a href="${url}" target="_blank" rel="noreferrer">${label}</a></p>`;
  const slideNo = (number) => `<span class="slide-no">${String(number).padStart(2, "0")}</span>`;
  const metric = (value, label, sub = "", accent = "var(--purple)") =>
    `<div class="metric" style="--accent:${accent}"><span class="value">${value}</span><span class="label">${label}</span>${sub ? `<span class="sub">${sub}</span>` : ""}</div>`;
  const card = ({ kicker, title, body, className = "", accent = "" }) =>
    `<article class="card ${className}"${accent ? ` style="--accent:${accent}"` : ""}>${kicker ? `<p class="card-kicker">${kicker}</p>` : ""}<h3>${title}</h3><p>${body}</p></article>`;
  const flowNode = (step, title, body, extra = "") =>
    `<article class="flow-node" ${extra}><span class="step">${step}</span><h3>${title}</h3><p>${body}</p></article>`;

  function add({ number, label, className = "", content, cue, sources = [], link = "" }) {
    slides.push({
      html: `<section data-label="${String(number).padStart(2, "0")} ${label}" class="${className}"><div class="frame">${content}</div>${link ? pageLink(link) : ""}${slideNo(number)}</section>`,
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
    content: `<p class="cover-kicker">AI 文學創作工作坊 ／ 2026.09.02・09.09</p><h1 class="cover-title">台灣的文學社會學之<span>基礎建設</span></h1><p class="cover-subtitle">從評審爭議、研究工具，到一個可以真的跑完的匿名創作閉環</p><div class="cover-meta"><span>臺文所 530 教室｜16:00–18:00</span><span>基礎使用 × 文學研究 × 創作實驗</span></div>`,
    cue: "封面。只交代兩週工作坊的題目、日期與場地。",
  });

  add({
    number: 2,
    label: "核心命題",
    className: "inverse",
    content: `${eyebrow(2, "文學系需要的，不只是生成工具")}<p class="thesis">AI 進入文學現場後，<br>最先暴露的往往不是文風，<br>而是我們原本就沒有寫清楚的<span class="mark">規則、證據與互評程序。</span></p>`,
    cue: "全場主命題：把焦點從 AI 味移到制度與工作流程。",
    sources: [URL.tsmc, URL.writing],
  });

  add({
    number: 3,
    label: "今天的路線",
    content: `${heading(3, "今天的路線", "先把爭議拆開，再把工具真的跑起來")}<div class="grid grid-4" style="margin-top:60px">${[
      ["01", "評審爭議", "四方地圖、五位評審、證據邊界"],
      ["02", "我的使用方法", "聊天、代理、研究生產線與互動工具"],
      ["03", "AI 小說研究", "StoryScope、Sepia，以及不能過度外推的地方"],
      ["04", "現場創作閉環", "300 字、匿名一句話評論、即時儀表板"],
    ]
      .map(([n, t, b], index) =>
        card({ kicker: n, title: t, body: b, className: index === 3 ? "purple-card" : "" }),
      )
      .join("")}</div>`,
    cue: "前半是案例與方法，後半把現場創作完整跑一輪。",
    sources: [URL.tsmc, URL.article, URL.workshop],
  });

  divider(
    4,
    "01",
    "LITERARY INSTITUTIONS",
    "台積電文學獎爭議",
    "同一篇文本，在兩次投票之間被換了一套問題",
    "先分析判準移動，不判定作品是否使用 AI。",
    [URL.tsmc],
  );

  add({
    number: 5,
    label: "〈實白〉兩次投票",
    content: `${heading(5, "〈實白〉兩次投票", "分數變了，更重要的是評判對象也變了")}<div class="vote-row" style="margin-top:55px">${metric("36", "6 月 27 日｜匿名文本評選", "首獎")}<div class="vote-arrow">→</div>${metric("9", "7 月 2 日｜加入檢舉與作者說明", "佳作", "var(--red)")}${card({ kicker: "證據狀態", title: "沒有可提出的實證", body: "紀要中，評審承認只能以自由心證處理。", className: "dark", accent: "var(--acid)" })}</div><p class="lead" style="margin-top:80px;font-weight:700">第一次在評文本；第二、三次逐步轉向規則、倫理、教育訊號與作者可信度。</p>`,
    cue: "公開材料是決審紀要／記錄整理，不是附錄音的逐字稿。",
    sources: [URL.tsmc, URL.minutes],
    link: URL.tsmc,
  });

  add({
    number: 6,
    label: "四方地圖",
    content: `${heading(6, "四方地圖", "不要先站隊，先看四個位置各自在守什麼")}<div class="quad-wrap" style="margin-top:25px"><article class="quad" style="--accent:var(--purple);--card-bg:var(--purple-soft)"><span class="letter">A</span><h3>作者與個案權益</h3><p class="guard">要守住｜創作尊嚴、答辯、隱私</p><p>不能被要求證明一個無限寬廣的「完全沒用 AI」。</p></article><article class="quad" style="--accent:var(--amber);--card-bg:var(--amber-soft)"><span class="letter">B</span><h3>評審與主辦方</h3><p class="guard">要守住｜獎項公信力、文學價值</p><p>必須回應質疑；風險是用自由心證填補規則缺口。</p></article><article class="quad" style="--accent:var(--green);--card-bg:var(--green-soft)"><span class="letter">C</span><h3>其他參賽者與教育現場</h3><p class="guard">要守住｜公平起點、可預測規範</p><p>學生應在投稿前知道允許、揭露與禁止的界線。</p></article><article class="quad" style="--accent:var(--red);--card-bg:var(--red-soft)"><span class="letter">D</span><h3>技術與制度設計</h3><p class="guard">要守住｜可驗證、可申復、最少蒐集</p><p>文風直覺或偵測器不能單獨定案。</p></article><div class="quad-center">共同問題｜獎勵的是文本、創作控制，還是無 AI 的過程？</div></div>`,
    cue: "四方不是四種人格，而是四個制度位置。",
    sources: [URL.tsmc],
  });

  add({
    number: 7,
    label: "三次會議",
    content: `${heading(7, "三次會議，三種評判對象", "問題不是只有分數變了，而是投票承擔的任務變了")}<div class="timeline"><article class="timeline-step" data-step="1" style="--accent:var(--purple)"><time>6 / 27</time><h3>匿名評文本</h3><p>精準、節制、複雜情感；「太成熟」仍沒有阻止首獎。</p></article><article class="timeline-step" data-step="2" style="--accent:var(--amber)"><time>7 / 1</time><h3>收到來信後評制度</h3><p>作者說明前，先討論自建模型、代筆、公平與教育訊號。</p></article><article class="timeline-step" data-step="3" style="--accent:var(--red)"><time>7 / 2</time><h3>讀回應後評信任</h3><p>沒有新增可驗證證據，回答是否聰明、迴避與可信成為降分依據。</p></article></div>`,
    cue: "把三次會議的評判對象分開，避免把後來的制度判斷倒灌回第一次文本評選。",
    sources: [URL.tsmc, URL.minutes],
  });

  add({
    number: 8,
    label: "五位評審總覽",
    content: `${heading(8, "五位評審的立場移動", "沒有單一的反 AI 陣線，每個人換問題的方式不同", true)}<table class="judge-table"><colgroup><col style="width:14%"><col style="width:14%"><col style="width:28%"><col></colgroup><thead><tr><th>評審</th><th>分數</th><th>判準核心</th><th>分析</th></tr></thead><tbody><tr><td>周芬伶</td><td>8 → 1</td><td>人文教育禁線</td><td>讓警示效果優先於原始文本肯定</td></tr><tr><td>林俊頴</td><td>7 → 3</td><td>規則意識 × 倫理懷疑</td><td>知道不能事後改規則，仍想處理疑慮</td></tr><tr><td>連明偉</td><td>6 → 1</td><td>文化公平／太乾淨</td><td>把成熟風格連到資源與文學能動性</td></tr><tr><td>黃崇凱</td><td>8 → 2</td><td>揭露與分類</td><td>以賽後才提出的揭露條件重建正當性</td></tr><tr><td>顧玉玲</td><td>7 → 2</td><td>技術開放 → 信任審查</td><td>決定因素轉成對作者回應方式的解讀</td></tr></tbody></table>`,
    cue: "五人的總覽；接下來兩頁拆開看各自的內在衝突。",
    sources: [URL.tsmc],
  });

  add({
    number: 9,
    label: "三種禁線來源",
    content: `${heading(9, "三種不同的禁線來源", "同樣大幅降分，理由並不相同")}<div class="grid grid-3">${card({ kicker: "周芬伶｜8 → 1", title: "人文教育的界線", body: "第一次仍肯定文本；加入 AI 脈絡後，清楚的教育示範比違規證據更重要。<br><br>要追問：規範訊號可以取代證據門檻嗎？", className: "tall red-card" })}${card({ kicker: "林俊頴｜7 → 3", title: "程序與倫理拉扯", body: "最明確說不能事後改規則，也最坦白承認沒有證據；但仍以自由心證評作者回應。<br><br>票數保留原始文學判斷。", className: "tall purple-card" })}${card({ kicker: "連明偉｜6 → 1", title: "文化公平與成熟風格", body: "仍喜歡作品，也承認協作不等於違規；但把「太乾淨」連到起跑點與文學精神。<br><br>這是線索，還是青年寫作的類型預設？", className: "tall amber-card" })}</div>`,
    cue: "三人都在處理公平，但證據、教育訊號與文化想像的比重不同。",
    sources: [URL.tsmc],
  });

  add({
    number: 10,
    label: "揭露條件與信任審查",
    content: `${heading(10, "揭露條件與信任審查", "另外兩位，分別把焦點放在分類與作者回應")}<div class="grid grid-2">${card({ kicker: "黃崇凱｜8 → 2", title: "以揭露條件重建獎項正當性", body: "他問的是：獎勵創作，還是工具使用技巧？若揭露模型、流程並標註協作，才可保留獎項。<br><br>問題在於，這套條件是賽後才提出。", className: "purple-card" })}${card({ kicker: "顧玉玲｜7 → 2", title: "從技術開放轉向信任審查", body: "她原先期待人與技術合作，也相信作者具備寫作能力；最後卻因書面說明被理解為避重就輕而轉向。<br><br>決定性因素不是新證據，而是回應方式的解讀。", className: "red-card" })}</div><div class="callout" style="margin-top:35px">非投票者也不一致｜王盛弘：回到既有辦法；許峻郎：公正、教育理念與首獎從缺的象徵效果。</div>`,
    cue: "補上兩位非投票者，顯示制度內部也不是同一種 AI 立場。",
    sources: [URL.tsmc],
  });

  add({
    number: 11,
    label: "四個分歧",
    content: `${heading(11, "真正分歧的四個問題", "這不是一條支持／反對 AI 的單軸線")}<div class="grid grid-2">${[
      ["01", "太完整、太成熟，能否成為 AI 線索？", "第一次仍高度肯定；風格疑慮後來才被放大。"],
      ["02", "當年規則是否禁止 AI？", "沒有明文禁線；爭議在能否用抄襲、代筆或倫理補足。"],
      ["03", "應該審文本，還是審創作過程？", "生產過程被納入後，揭露範圍與證據門檻仍未先設計。"],
      ["04", "作者說明應該扮演什麼角色？", "回應語氣成為降分依據，卻沒有明確查核題目。"],
    ]
      .map(([n, t, b], i) =>
        card({ kicker: n, title: t, body: b, className: i === 3 ? "purple-card" : "" }),
      )
      .join("")}</div>`,
    cue: "把爭議改寫成可預先設計的四個問題。",
    sources: [URL.tsmc, URL.rules],
  });

  add({
    number: 12,
    label: "證據邊界",
    content: `${heading(12, "本案能說到哪裡", "把事實、推論與未知分開，才不會再複製爭議本身")}<div class="grid grid-2">${card({ kicker: "紀要可以確認", title: "判準確實移動", body: "規則沒有生成式 AI 條款<br>第一次匿名評選高度肯定〈實白〉<br>外部來信、作者說明與信任判斷改變投票<br>評審承認無法提出真憑實據", className: "green-card" })}${card({ kicker: "仍然不能確認", title: "作品究竟如何生成", body: "是否以生成式 AI 生成或改寫<br>完整檢舉信與附件<br>作者提交的歷程是否足以完成查核<br>紀要是否完整呈現電話與群組討論", className: "red-card" })}</div><p class="lead serif center" style="margin-top:48px;font-weight:700">當規則沒有準備好，誰有權把懷疑變成後果？</p>`,
    cue: "結論停在證據邊界；不替任何一方補上沒有公開的事實。",
    sources: [URL.tsmc, URL.minutes, URL.author],
  });

  divider(
    13,
    "02",
    "MY AI PRACTICE",
    "我如何使用 AI",
    "不是把判斷交出去，而是重新分配思考、製作與驗證",
    "依指定的 C-LAB 舊稿結構縮編。",
    [URL.clab, URL.style],
  );

  add({
    number: 14,
    label: "判斷、資料、品味",
    content: `${heading(14, "非工程師真正能帶進來的東西", "判斷、資料與品味，才是 AI 工作的起點")}<div class="grid grid-3" style="margin-top:60px">${card({ kicker: "01", title: "判斷", body: "知道什麼問題值得做，也知道何時不該做。", accent: "var(--purple)" })}${card({ kicker: "02", title: "資料", body: "手上累積的文本、脈絡、案例與失敗紀錄。", className: "green-card" })}${card({ kicker: "03", title: "品味", body: "能看出一個結果雖然完整，卻還是不對。", className: "amber-card" })}</div><p class="lead" style="margin-top:70px;font-weight:700">誰最受益？通常不是最會下指令的人，而是已有材料、能驗證、也能說清楚取捨的人。</p>`,
    cue: "合併舊稿第 3 與第 19 頁。",
    sources: [URL.clab],
  });

  add({
    number: 15,
    label: "Chat 與 Agent",
    content: `${heading(15, "Chat 與 Agent，不是同一種工作", "一個幫你想；一個拿到工具後，能替你把流程跑完")}<div class="grid grid-2" style="margin-top:45px">${card({ kicker: "CHAT", title: "對話、解釋、整理", body: "你把問題帶進來，模型在對話裡幫你想。<br><br>適合：拆題、比較、反駁、改寫。", className: "purple-card" })}${card({ kicker: "AGENT", title: "有工具、有狀態、有驗證", body: "它可以讀檔、跑測試、改網站、查來源，再回報實際結果。<br><br>適合：研究、開發、發布、追蹤。", className: "dark", accent: "var(--acid)" })}</div><p class="lead" style="margin-top:55px;font-weight:700">我的原則：聊天處理情緒與方向；代理處理可以明確驗證的工作。</p>`,
    cue: "合併舊稿第 4–5 頁。",
    sources: [URL.clab],
  });

  add({
    number: 16,
    label: "模型與推理時間",
    content: `${heading(16, "把時間花在真正需要推理的地方", "更強模型、更多思考時間，通常比廉價大量輸出更划算")}<div class="metrics" style="margin-top:60px">${metric("1×", "先把問題寫清楚", "目標、證據、限制")}${metric("10×", "允許模型多走幾步", "反證、驗證、重寫", "var(--acid)")}${metric("0×", "不要把垃圾大量生產", "便宜輸出仍要付審稿成本", "var(--red)")}</div><div class="callout" style="margin-top:70px">Takeaway｜讓模型思考，不等於讓模型替你決定。你仍然要負責問題、資料與驗收。</div>`,
    cue: "合併舊稿第 6–7 頁；保留可長期使用的原則。",
    sources: [URL.clab],
  });

  add({
    number: 17,
    label: "兩個 Aha",
    content: `${heading(17, "兩個讓我改變工作方式的時刻", "不是生成一句好文案，而是把一整段工作接起來")}<div class="grid grid-2" style="margin-top:45px">${card({ kicker: "AHA 01", title: "整理一個真的很亂的資料夾", body: "AI 先讀結構、辨識重複、提出搬移計畫，再逐步執行與留下紀錄。<br><br>關鍵不是分類建議，而是可回復的操作閉環。", className: "purple-card" })}${card({ kicker: "AHA 02", title: "把一個網站真的發佈出去", body: "寫內容、改版面、跑檢查、部署、打開正式網址確認。<br><br>「程式改完」和「讀者真的看得到」是兩件事。", className: "green-card" })}</div><p class="lead" style="margin-top:55px;font-weight:700">我開始把 AI 看成工作流程中的協作者，而不是聊天視窗裡的答案機器。</p>`,
    cue: "合併舊稿第 9–10 頁。",
    sources: [URL.clab],
  });

  add({
    number: 18,
    label: "每天一個困難問題",
    className: "inverse",
    content: `${eyebrow(18, "每天一個真正困難的問題")}<p class="thesis">把「我想知道什麼」寫成一個<br>有材料、能反駁、可以驗收的研究問題。</p><div class="callout dark" style="margin-top:auto;margin-bottom:105px">例：一個判準究竟是從文本長出來，還是在事件之後才被補上？</div>`,
    cue: "合併舊稿第 16–17 頁，依要求移到研究生產線之前。",
    sources: [URL.clab],
  });

  add({
    number: 19,
    label: "研究生產線",
    content: `${heading(19, "嚴謹研究，不是一次問答", "把核心命題、證據、反證與發布拆成可重跑的生產線")}<div class="flow" style="margin-top:40px">${flowNode("01", "問題", "核心命題與證據需求")}${flowNode("02", "研究", "一手來源與資料擷取")}${flowNode("03", "推論", "子論點、反證、風險")}${flowNode("04", "查核", "事實地圖與缺口")}${flowNode("05", "發布", "編輯、校對、公開驗證", 'style="--card-bg:var(--purple-soft);--accent:var(--acid)"')}</div><p class="lead" style="margin-top:65px;font-weight:700">核心 → 子論點 → 證據 → 風險 → 綜合，不讓漂亮文字掩蓋推論缺口。</p>`,
    cue: "合併舊稿第 12–15 頁；帶入實際使用的研究發布生產線。",
    sources: [URL.clab, URL.pipeline],
  });

  add({
    number: 20,
    label: "獨立研究者",
    content: `${heading(20, "作為一名獨立研究者", "我用 AI 做推論研究，也留下可以回看的生產紀錄")}<div class="image-pair"><figure class="image-panel"><img src="assets/article.png" alt="pro.mashbean.net 上的 StoryScope 與 Sepia 研究文章首頁"><figcaption>成果｜pro.mashbean.net</figcaption></figure><figure class="image-panel"><img src="assets/pipeline.png" alt="research-publishing-pipeline GitHub 儲存庫頁面"><figcaption class="purple">生產線｜research-publishing-pipeline</figcaption></figure></div>`,
    cue: "成果與方法分開：文章是可讀結果，pipeline 是可追溯的研究過程。",
    sources: [URL.pro, URL.pipeline, URL.article],
  });

  add({
    number: 21,
    label: "讀者與開發者",
    content: `${heading(21, "作為讀者，也作為審議民主開發者", "一邊寫自己想看的小說，一邊把互動工具做得更可用", true)}<div class="image-pair"><figure class="image-panel"><img src="assets/fiction.png" alt="pro.mashbean.net 小說列表頁"><figcaption>讀者 → 用 AI 寫自己想讀的長篇與短篇</figcaption></figure><figure class="image-panel"><img src="assets/call-in.png" alt="Call-in 即時簡報互動工具首頁"><figcaption>開發者 → 把提問、回應與現場節奏接進簡報</figcaption></figure></div>`,
    cue: "把使用 AI 的兩個角色放在同一頁，避免案例清單拖長。",
    sources: [URL.fiction, URL.callin],
  });

  add({
    number: 22,
    label: "工具的增幅與削弱",
    content: `${heading(22, "工具讓能力變大，也可能讓理解變薄", "會做，和知道自己在做什麼，是兩種不同的能力")}<div class="grid grid-2" style="margin-top:55px">${card({ kicker: "AUGMENT", title: "把既有判斷放大", body: "能提出問題、檢查結果、辨認例外；工具讓你更快抵達更遠的地方。", className: "green-card" })}${card({ kicker: "DIMINISH", title: "把陌生流程藏起來", body: "如果只收答案、不重建工具在腦中的模型，錯誤也會跟著被自動化。", className: "red-card" })}</div>`,
    cue: "舊稿第 21–23 頁縮成第一頁：能力增幅與理解變薄。",
    sources: [URL.clab],
  });

  add({
    number: 23,
    label: "目標與控制",
    content: `${heading(23, "工具可以伸手，但目標仍要留在人這邊", "真正需要內化的，是目標、判準與停止條件")}<div class="flow four" style="margin-top:65px">${flowNode("你", "提出目的", "")}${flowNode("AI", "擴張可行路徑", "", 'style="--card-bg:var(--purple);color:#fff"')}${flowNode("資料與工具", "執行、查找、驗證", "", 'style="--card-bg:var(--purple-soft)"')}${flowNode("你", "決定採用、修正或停止", "", 'style="--card-bg:var(--acid);--accent:var(--acid)"')}</div><div class="callout" style="margin-top:70px">內化不是背會每個按鈕，而是即使換了工具，你仍知道為什麼要這樣做。</div>`,
    cue: "舊稿第 24–26 頁縮成第二頁：工具可及性與能力內化。",
    sources: [URL.clab],
  });

  add({
    number: 24,
    label: "不要把 LLM 當神諭",
    className: "inverse",
    content: `${eyebrow(24, "不要把 LLM 當神諭")}<div class="two-voices"><div class="voice muted">好問題不是：<br>「請給我正確答案。」</div><div class="voice">而是：<br>「你用了哪些假設？<br>哪個反例會讓結論失效？」</div></div><div class="callout dark" style="margin-top:auto;margin-bottom:105px">四個原則｜說清楚目標 · 給足材料 · 要求反證 · 驗證公開結果</div>`,
    cue: "舊稿第 27–29 頁縮成第三頁：從神諭轉向可以追問的對話。",
    sources: [URL.clab],
  });

  divider(
    25,
    "03",
    "AI FICTION RESEARCH",
    "用 AI 寫小說？",
    "先看它在哪些敘事選擇上容易重複，再決定要不要介入",
    "第三部分以 StoryScope 與 Sepia 做初步研究與採用判斷。",
    [URL.storyscope, URL.sepia],
  );

  add({
    number: 26,
    label: "StoryScope 研究範圍",
    content: `${heading(26, "StoryScope 研究了什麼", "不是幾百字提示詞，而是大規模、英文、接近長篇短篇小說的語料", true)}<div class="metrics" style="margin-top:60px">${metric("10,272", "prompt 組", "人類＋5 個 LLM")}${metric("61,608", "篇故事", "平均 4,753 words", "var(--acid)")}${metric("304", "可解釋敘事特徵", "主題、結構、視角、語言", "var(--green)")}</div><div class="callout" style="margin-top:65px">方法價值｜把模糊的「AI 味」拆成可討論的敘事決策。<br><span class="red">但樣本語言、篇幅與任務都和中文 300 字極短篇不同。</span></div>`,
    cue: "數字來自 v6 論文；先交代外推邊界。",
    sources: [URL.storyscope, URL.storyscopeRepo],
  });

  add({
    number: 27,
    label: "StoryScope 分類結果",
    content: `${heading(27, "它確實抓到穩定差異，但不是萬用偵測器", "模型可以分類語料；這不等於能裁決單篇作品的作者身分", true)}<div class="metrics" style="margin-top:60px">${metric("93.2", "Human / AI macro-F1", "敘事特徵模型")}${metric("68.4", "六方來源 macro-F1", "人類＋5 個模型", "var(--amber)")}${metric("84.8", "只用 30 個核心特徵", "Human / AI", "var(--green)")}</div><p class="lead center" style="margin-top:85px;font-weight:700">可用來找群體傾向；不能把機率分數直接變成個案處分。</p>`,
    cue: "區分研究分類效能與個案歸因。",
    sources: [URL.storyscope],
    link: URL.storyscope,
  });

  add({
    number: 28,
    label: "敘事傾向",
    content: `${heading(28, "AI 故事容易在哪裡變得太順", "問題常在語氣下面：敘事決策比表面文風更有用")}<div class="grid grid-2">${card({ kicker: "77% / 52%", title: "主題更明說", body: "AI 比人類更常把主題直接寫出來。", className: "purple-card" })}${card({ kicker: "69% / 46%", title: "主角推動收束", body: "更常由主角行動完成解決。", className: "amber-card" })}${card({ kicker: "81% / 38%", title: "情緒寫進身體", body: "更常使用明確的身體化情緒線索。", className: "green-card" })}${card({ kicker: "HUMAN", title: "時間更複雜", body: "人類文本整體更常保留歧義、時間層次與多樣性。", className: "red-card" })}</div>`,
    cue: "這四項是工作坊最有用的敘事鏡頭，不是判定 AI 的清單。",
    sources: [URL.storyscope],
  });

  add({
    number: 29,
    label: "研究邊界",
    content: `${heading(29, "研究可以給我們詞彙，不能替我們定罪", "英文平均 4,753 words 的群體差異，不等於中文 300 字的個案證據", true)}<div class="grid grid-2" style="margin-top:65px">${card({ kicker: "可以帶進課堂", title: "四個敘事鏡頭", body: "主題是否明說／收束由誰推動／情緒是否只剩身體反應／時間與歧義是否被壓平。", className: "green-card" })}${card({ kicker: "不能帶進評審", title: "一張 AI 嫌疑清單", body: "不能因為故事順、乾淨或完整，就推定作者使用 AI；更不能跳過規則、查核與申復。", className: "red-card" })}</div>`,
    cue: "研究詞彙不應變成自由心證的新包裝。",
    sources: [URL.storyscope, URL.tsmc],
  });

  add({
    number: 30,
    label: "Sepia 採用判斷",
    content: `${heading(30, "Sepia 值得用，但只能放在可見的修改層", "把統計傾向翻成寫作選項，不把作品偷偷「洗成人類」", true)}<div class="grid grid-3" style="margin-top:50px">${card({ kicker: "1", title: "敘事架構", body: "因果、節點、收束" })}${card({ kicker: "2", title: "話語組織", body: "視角、時間、資訊延遲" })}${card({ kicker: "3", title: "表面語言", body: "句式、感官、重複", className: "purple-card" })}</div><div class="callout dark" style="margin-top:65px">採用決定｜每輪只選 3–5 個候選；本次 300 字練習更嚴格：最多顯示 4 個鏡頭、作者最多選 2 個動作。</div>`,
    cue: "Sepia 自己也提醒不要反向模仿 AI 特徵；本次把介入縮到最多兩個可見動作。",
    sources: [URL.sepia, URL.article],
  });

  divider(
    31,
    "04",
    "LIVE WRITING LOOP",
    "來真的使用 AI 寫小說",
    "先跑完 300 字閉環；第二週再把長篇流程拉開",
    "第四部分進入實作。",
    [URL.writing, URL.workshop],
  );

  add({
    number: 32,
    label: "創作系統",
    content: `${heading(32, "這不是一個按下去就生成的網站", "模型、提示層、版本與匿名互評，都必須成為可研究的基礎建設", true)}<div class="architecture"><div class="architecture-list"><div class="architecture-item"><strong>SOTA 模型</strong><span>使用當下可用的強模型，但不把模型名稱寫死成方法。</span></div><div class="architecture-item"><strong>提示層可修改</strong><span>system／developer／任務提示可以分層調整與保存。</span></div><div class="architecture-item"><strong>版本與來源</strong><span>保留模型版本、提示版本、回應結構與測試標記。</span></div><div class="architecture-item"><strong>匿名互評</strong><span>先看作品與評論，再揭露創作路徑，避免先驗身分效應。</span></div></div><img src="assets/writing-home.png" alt="AI 文學創作工作坊首頁，顯示兩週活動與進入工作區按鈕"></div>`,
    cue: "說明正式網站的研究目的與可追溯設計。",
    sources: [URL.writing],
    link: URL.writing,
  });

  add({
    number: 33,
    label: "課堂閉環",
    content: `${heading(33, "第一段｜課堂上跑完一個完整閉環", "從拿到題目到看到匿名回饋，全部在現場完成")}<div class="flow" style="margin-top:40px">${flowNode("01", "領動物代號", "裝置為單位")}${flowNode("02", "寫 300 字", "先自己決定方向")}${flowNode("03", "最多選 2 個動作", "AI 建議保持可見")}${flowNode("04", "匿名一句話評論", "指出一個具體閱讀效果")}${flowNode("05", "即時儀表板", "看全班進度與作品", 'style="--card-bg:var(--purple-soft);--accent:var(--acid)"')}</div><p class="lead center" style="margin-top:65px;font-weight:700">完成閉環，比一次生成出「好像很完整」的小說更重要。</p>`,
    cue: "現場閉環用裝置識別，不要求姓名與帳號。",
    sources: [URL.workshop],
  });

  add({
    number: 34,
    label: "動物代號與儀表板",
    content: `${heading(34, "不用名字。先讓這台裝置領一隻動物。", "匿名不是裝飾；它是把文本判斷與身分判斷暫時拆開", true)}<div class="image-pair"><figure class="image-panel"><img src="assets/workshop.png" alt="工作坊領取動物代號頁面"><figcaption>每台裝置固定一個代號；不蒐集姓名。</figcaption></figure><figure class="image-panel"><img src="assets/dashboard.png" alt="黑底課堂即時成果儀表板"><figcaption>儀表板只顯示動物、進度、作品與匿名評論。</figcaption></figure></div>`,
    cue: "儀表板留在 writing 同一資料層，保持代號、階段與截止時間一致。",
    sources: [URL.workshop, URL.dashboard, URL.callin],
  });

  add({
    number: 35,
    label: "現場開始",
    content: `${heading(35, "現在開始｜先完成 300 字，再交換一句話", "今天不比誰最像人；只看一個敘事選擇改變了什麼")}<div class="cta-grid"><div><img class="qr" src="assets/qr-workshop.png" alt="掃描後前往 writing.mashbean.net/workshop 的 QR code"><p class="mono purple" style="font-size:20px;font-weight:700">writing.mashbean.net/workshop</p></div><div class="schedule"><div class="schedule-row"><time>16:00–17:25</time><strong>創作</strong><span>一台裝置一篇；最多兩個 AI 建議動作</span></div><div class="schedule-row"><time>17:25–17:45</time><strong>評論</strong><span>匿名一句話；具體指出閱讀效果</span></div><div class="schedule-row"><time>17:45–18:00</time><strong>全班讀回</strong><span>看儀表板，討論差異與規則</span></div></div></div>`,
    cue: "時間可由管理頁調整；投影片先放建議節奏。",
    sources: [URL.workshop, URL.dashboard],
    link: URL.workshop,
  });

  add({
    number: 36,
    label: "返家創作與互評",
    content: `${heading(36, "第二段｜帶回家寫，隔週再匿名互評", "把截止時間、揭露順序與版本保存都寫進流程", true)}<div class="deadline-grid"><article class="deadline"><span class="letter">A</span><time>09 / 07 23:59</time><h3>創作截止前</h3><p>完成較長作品；保存提示層、模型版本與修改歷程。</p></article><article class="deadline"><span class="letter">B</span><time>09 / 09 15:30</time><h3>評論截止前</h3><p>只看匿名文本；寫具體、可回到句段的評論。</p></article><article class="deadline highlight"><span class="letter">C</span><time>09 / 09 16:00</time><h3>課堂揭露</h3><p>先讀作品與評論，再看作者採用哪些 AI 介入。</p></article><article class="deadline"><span class="letter">D</span><time>課後</time><h3>方法回收</h3><p>討論哪些提示幫助創作，哪些只讓文本更平滑。</p></article></div><div class="callout dark" style="margin-top:50px">核心原則｜先讓文本與評論發生關係，再揭露工具與作者。</div>`,
    cue: "正式返家流程加入創作截止與評論截止；動物代號沿用到揭露前。",
    sources: [URL.writing, URL.article],
  });

  add({
    number: 37,
    label: "結語",
    className: "inverse",
    content: `${eyebrow(37, "文學社會學的 AI 基礎建設")}<p class="thesis">不是更會辨認 AI 味，<br>而是讓每一次介入都<span class="mark">看得見、說得清、可以申復。</span></p><div class="closing-links"><span>案例分析｜研究文章｜創作入口｜即時儀表板</span><span class="mono purple">mashbean.net</span></div>`,
    cue: "把生成工具轉成一套可公開討論、可研究、也可修正的程序。",
    sources: [URL.tsmc, URL.article, URL.writing],
  });

  deck.innerHTML = slides.map((slide) => slide.html).join("");
  notesNode.textContent = JSON.stringify(slides.map((slide) => slide.note));
})();
