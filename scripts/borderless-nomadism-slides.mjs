import fs from "node:fs";
const metadata = JSON.parse(
  fs.readFileSync(new URL("./borderless-nomadism-notes.json", import.meta.url), "utf8"),
);

// Each plate has its own composition. The notes retain the original source boundaries.
export function makeSlides({ term, photo, quote, lead, p, cols, entry, table }) {
  const slides = [];
  const art = (name, cls = "", alt = "") =>
    `<div class="engraving ${cls}"><img src="assets/${name}.webp" alt="${alt}" width="1100" height="1100" loading="lazy"></div>`;
  const tag = (s) => `<p class="eyebrow">${s}</p>`;
  const note = (s) => `<p class="marginal">${s}</p>`;
  const panel = (s, cls = "") => `<div class="panel ${cls}">${s}</div>`;
  const rule = '<div class="ornament-rule" aria-hidden="true"><span>✦</span></div>';
  function rev(n, title, body, layout) {
    slides.push({ ...metadata[n - 1], title, body, layout });
  }
  // Lines below are semantic routes, not illustrative artwork. Node positions are editorially composed.
  const routes = {
    cycle: {
      points: [
        [50, 10],
        [84, 50],
        [50, 90],
        [16, 50],
      ],
      paths: [
        "M570 60 Q845 70 880 235",
        "M920 350 Q850 520 590 520",
        "M415 520 Q145 520 110 350",
        "M110 230 Q155 80 415 60",
      ],
    },
    river: {
      points: [
        [17, 18],
        [49, 18],
        [49, 78],
        [84, 78],
      ],
      paths: ["M290 108 L380 108", "M490 170 L490 385", "M610 468 L725 468"],
    },
    stair: {
      points: [
        [16, 15],
        [39, 39],
        [62, 63],
        [85, 87],
      ],
      paths: [
        "M235 90 L390 90 L390 165",
        "M465 235 L620 235 L620 305",
        "M690 380 L850 380 L850 450",
      ],
    },
    triangle: {
      points: [
        [18, 73],
        [50, 15],
        [82, 73],
      ],
      paths: ["M240 350 L405 135", "M590 135 L755 350"],
    },
    book: {
      points: [
        [18, 15],
        [18, 83],
        [80, 83],
        [80, 15],
      ],
      paths: ["M180 165 L180 400", "M310 500 L665 500", "M800 400 L800 165"],
    },
    hub: {
      points: [
        [50, 7],
        [86, 37],
        [72, 86],
        [28, 86],
        [14, 37],
      ],
      paths: [
        "M500 290 L500 80",
        "M530 300 L745 222",
        "M530 325 L670 460",
        "M470 325 L335 460",
        "M470 300 L250 225",
      ],
      parallel: true,
    },
    hourglass: {
      points: [
        [18, 13],
        [82, 13],
        [18, 85],
        [82, 85],
      ],
      paths: ["M295 80 L710 80", "M820 145 L500 300 L180 430", "M295 510 L710 510"],
    },
    up: {
      points: [
        [14, 84],
        [38, 60],
        [62, 36],
        [86, 12],
      ],
      paths: [
        "M230 500 L380 500 L380 425",
        "M465 360 L620 360 L620 280",
        "M695 215 L860 215 L860 140",
      ],
    },
    loop: {
      points: [
        [18, 15],
        [80, 15],
        [80, 83],
        [18, 83],
      ],
      paths: ["M305 90 L675 90", "M800 165 L800 400", "M675 500 L310 500", "M180 405 L180 165"],
    },
    fork: {
      points: [
        [15, 17],
        [50, 17],
        [85, 17],
      ],
      paths: [
        "M500 480 L500 340 L150 340 L150 180",
        "M500 480 L500 180",
        "M500 480 L500 340 L850 340 L850 180",
      ],
      parallel: true,
    },
    spine: {
      points: [
        [18, 50],
        [50, 50],
        [82, 50],
      ],
      paths: ["M305 300 L375 300", "M630 300 L695 300"],
    },
  };
  let diagramCount = 0;
  const diagram = (kind, steps, center = "", caption = "") => {
    const r = routes[kind],
      marker = `route-arrow-${++diagramCount}`;
    return `<div class="flow-wrap diagram ${kind}" data-diagram="${kind}" ${r.parallel ? 'data-parallel="true"' : ""}><svg class="route-svg" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="${marker}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" stroke-width="1"/></marker></defs>${r.paths.map((d, i) => `<path class="route route-${i}" d="${d}" fill="none" marker-end="url(#${marker})"/>`).join("")}</svg>${center ? `<div class="diagram-center">${center}</div>` : ""}<ol class="flow">${steps.map(([a, b], i) => `<li class="flow-step" style="--x:${r.points[i][0]}%;--y:${r.points[i][1]}%"><span class="step-no">0${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join("")}</ol>${caption ? `<p class="flow-caption">${caption}</p>` : ""}<button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div>`;
  };

  rev(
    1,
    "無國界的遊牧",
    `<div class="cover-copy">${tag("飛地・台灣季　｜　在世界之間")}<h1>無國界的<span>遊牧</span></h1><p class="cover-sub">那些數位流動者的落地生根實驗</p>${rule}<p class="cover-topics">人・勞動・社群・空間・世界</p><p class="byline">黃豆泥 Yen-Lin (mashbean) Huang<br><span>London · 20 September 2026</span></p></div>`,
    "cover",
  );
  rev(
    2,
    "人、勞動、社群、空間、世界",
    `<div class="contents-emblem">${art("tree-roots")}${tag("虛擬與現實交錯的觀察筆記")}</div><div class="contents-copy"><ol class="contents">${[
      ["一", "兩種在清邁遊牧的人", 3],
      ["二", "故鄉可能是排他的<br>也可能是排擠的", 6],
      ["三", "數位避秦", 10],
      ["四", "何處是故鄉", 26],
    ]
      .map(
        ([n, t, to]) =>
          `<li><a href="#${to}"><span>${n}</span><b>${t}</b><small>↗</small></a></li>`,
      )
      .join("")}</ol><a class="afterword" href="#30">番外篇　AI、人類與工作 ↗</a></div>`,
    "contents-plate",
  );
  rev(
    3,
    "兩種在清邁遊牧的人",
    `<div class="specimens"><div>${art("snail-house")}${tag("I · 暫時離開")}<h3>躺平主義的遊牧</h3>${p("具有旅遊或體驗性質的追尋")}</div><div>${art("fox-path")}${tag("II · 動手重做")}<h3>身體力行的遊牧</h3>${p("具有生活或砍掉重練的實驗")}</div></div>${note(`這裡講的${term("nomad", "數位遊牧")}，是我在清邁遇見的兩種人。`)}`,
    "specimen-pair",
  );
  rev(
    4,
    "躺平體驗作為一種消費產業鏈",
    `<div class="tangping-manifesto">${quote("「只要將整個世界倒轉 90 度，人們就會發現一個平時難以啟齒的真理：躺平才是真正的站立，而站立的正是爬行。」", "《躺平主義宣言》")}</div><div class="cycle-layout"><div class="cycle-safe flow-wrap" data-diagram="cycle"><div class="cycle-orbit" aria-hidden="true"><span>→</span><span>→</span><span>→</span><span>→</span></div><ol class="flow cycle-cards">${[
      ["高壓日常", "工作、房價、內卷"],
      ["清邁躺一躺", "換一種生活節奏"],
      ["積蓄見底", "生活還是要花錢"],
      ["回去當牛馬", "存到錢，下次再來"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`,
      )
      .join(
        "",
      )}</ol><div class="cycle-core">${art("snail-house")}<span>清邁 ⇄ 職場</span></div><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div><aside>${tag("清邁筆記・之一")}${p("微信、抖音、小紅書上的遊民大會，賣的正是這種生活想像。")}${note(`原文裡，我把這叫做精神上的${term("lie", "Copium")}。`)}</aside></div>`,
    "cycle-plate",
  );
  rev(
    5,
    "從大理，流動到清邁",
    `<div class="migration-grid"><div class="migration-sequence flow-wrap" data-diagram="river"><ol class="flow migration-cards">${[
      [term("dali", "瓦貓之夏"), "2022・大理的活動被清場"],
      ["沒有大台，也繼續辦", "聚會改用去中心的方式進行"],
      ["一部分人來到清邁", "有人就這樣定居下來"],
      ["多中心的群落", "有衝突，也長出了產業鏈"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p>${i === 1 ? `<small class="tributary-chip">${term("seven", "706 青年空間")}也匯入清邁</small>` : ""}</li>`,
      )
      .join(
        "",
      )}</ol><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div><aside class="migration-evidence">${art("swallow-colony")}${p("由於 Web3 生態系短暫繁榮，年輕工作者擁有了實踐生活型態的餘裕。")}${quote("「甚至還建造了多中心的群落，有了點衝突，也有相應的產業鏈出現。」", "黃豆泥・清邁的遊牧觀察")}</aside></div>${note(`${term("web3", "Web3 加密遊牧者")}彼此也不見得熟；有些人反而更常與各自的西方社群往來。`)}`,
    "migration-plate",
  );
  rev(
    7,
    "故鄉可能是排他的<br>也可能是排擠的",
    `${tag("第二章　/　HOME & ELSEWHERE")}${art("moon-birds", "chapter-art")}<div class="chapter-pair"><div><span>I</span><h3>千里共嬋娟</h3>${p("不同地方，共享同一個空間")}</div><div><span>II</span><h3>神遊於物外</h3>${p("同樣空間，尋找神遊的地方")}</div></div>`,
    "threshold-chapter",
  );
  rev(
    8,
    "千里共嬋娟",
    `<div class="moon-triptych"><div class="shore">${tag("遠方之一")}<h3>人在海外<br>還是使用微信</h3>${p("語言・熟人<br>資訊・共同時間")}</div>${art("moon-birds")}<div class="shore">${tag("遠方之二")}<h3>波士頓<br>罵罵咧咧的司機</h3>${p("移居・日常<br>故鄉・情緒")}</div></div>${lead("在不同的地方，共享同一個空間。")}`,
    "moon-plate",
  );
  rev(
    9,
    "神遊於物外",
    `${art("moth-window", "window-art")}<div class="inner-copy">${tag("另一種遠方")}<div class="big-word">雲林的女兒<br><em>穆斯林的信仰</em></div>${rule}${lead("在同樣的空間，<br>尋找神遊的地方。")}${note("地方・家庭・信仰・歸屬")}</div>`,
    "inner-world",
  );
  rev(
    10,
    "次文化的遠方",
    `<div class="cabinet-photo">${photo("radio", "德意志博物館 DLØDM 電台", "DLØDM 電台，2022。圖／Deutsches Museum, München")}${tag("德意志博物館・火腿族志工爺爺")}</div><div class="cabinet-labels">${panel(entry(term("scp", "SCP 基金會"), "一起把不存在的世界寫出來。"))}${panel(entry(term("haitang", "海棠論壇"), "在閱讀與創作裡找到同類。"))}${panel(entry(term("ham", "業餘無線電"), "訊號先抵達，人未必要見面。"))}</div>`,
    "cabinet-plate",
  );
  rev(
    11,
    "數位避秦",
    `${tag("第三章　/　EXODUS")}${art("raven-book", "chapter-art")}<div class="era-stack"><div><b>戶籍</b><span>故鄉、邊境與名冊</span></div><div><b>1990s</b><span>把加密工具傳出去</span></div><div><b>2000–10s</b><span>從平台手裡搬走</span></div><div><b>2020s</b><span>真的去蓋一個地方</span></div></div>`,
    "exodus-chapter",
  );
  rev(
    12,
    "故鄉、邊境、戶口的誕生",
    `<div class="registry-note">${tag("制度如何看見人")}${lead(term("registry", "編戶齊民"))}${p("進了名冊，<br>也就進了治理的範圍。")}${note(`${term("exile", "避秦")}：想像名冊之外的生活。`)}</div><div class="registry-sequence flow-wrap" data-diagram="stair"><ol class="flow registry-cards">${[
      ["編入名冊", "把人辨認出來"],
      ["連到土地", "人屬於哪個地方"],
      ["分配義務", "賦稅、徭役與管理"],
      ["劃定邊界", "限制進入與離開"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`,
      )
      .join(
        "",
      )}</ol><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div>`,
    "registry-plate",
  );
  rev(
    13,
    "我們都有兩套戶籍",
    `<div class="passport-pair"><div class="passport"><span class="seal-number">I</span>${tag("國家")}<h3>戶籍・證件<br>公共服務</h3>${p("證明你的身分，<br>也決定你能使用哪些服務。")}</div><div class="passport"><span class="seal-number">II</span>${tag("平台")}<h3>帳號・登入<br>社交與支付</h3>${p("朋友、作品與交易都在裡面。<br>帳號一停，入口就關了。")}</div></div>${note("國籍與帳號的法律地位不同；但生活被擋在門外的感覺，未必那麼遙遠。")}`,
    "passport-plate",
  );
  rev(
    14,
    "把身分的三件事拆開",
    `${diagram(
      "triangle",
      [
        ["識別", "核發者確認身分"],
        ["憑證", "把證明交給個人保管"],
        ["驗證與授權", "需要時，由個人出示"],
      ],
      `<div class="identity-core">${term("ssi", "身分自主權")}<small>核發 ≠ 保管 ≠ 使用</small></div>`,
    )}<div class="three-margins">${note("個資權力：核發與撤銷")}${note("儲存位置：裝置與機構")}${note("使用足跡：紀錄對誰可見")}</div>`,
    "identity-plate",
  );
  rev(
    15,
    "把程式印成一本書",
    `<div class="book-emblem">${art("raven-book")}${tag("PGP · 1995 · MIT PRESS")}</div><div class="book-route">${lead(`${term("pgp", "PGP")} 原始碼出版計畫`)}<div class="book-sequence flow-wrap" data-diagram="book"><ol class="flow book-cards">${[
      ["加密程式", "讓私人通訊保持私密"],
      ["出口管制", "程式跨境受到限制"],
      ["印成紙本", "C 原始碼成了出版物"],
      ["讀回程式", "文字又能變成工具"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`,
      )
      .join(
        "",
      )}</ol><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div>${note(`${term("cypher", "密碼龐克")}把主張寫成程式，也把程式印上了紙。`)}</div>`,
    "pgp-plate",
  );
  rev(
    16,
    "1996：網路獨立宣言",
    `${tag("A DECLARATION OF THE INDEPENDENCE OF CYBERSPACE")}${quote("“We are creating a world that all may enter without privilege”", "John Perry Barlow・1996")}${rule}<div class="declaration-tail">${lead("三十年後，<br>進入這個世界仍需要誰的許可？")}${p("伺服器、平台條款、網路封鎖。<br>還有，沒辦法搬進網路的肉身。")}</div>`,
    "manifesto declaration",
  );
  rev(
    17,
    "網路也會失憶",
    `<div class="lost-number" aria-hidden="true">404</div><div class="archive-copy">${tag("2000–2010 年代・逃離數位壟斷")}<h3>無名小站下線，<br>早期網頁一個個失連。</h3>${p("伺服器要錢，網域要續，格式會過時。<br>「還在網路上」這件事，一直都需要有人照顧。")}</div><div class="archive-evidence">${photo("internet-404", "文章無法查看的截圖", "〈中文互聯網正在加速崩塌〉失連畫面。原文圖／黃豆泥")}${note("連談論網路崩塌的文章，也可能消失。")}</div>`,
    "archive-plate",
  );
  rev(
    18,
    "藝立協：誕生自網絡的部落美學",
    `<div class="elixus-evidence">${photo("elixus", "派樂西王國網站頁面", "派樂西王國網站。原文圖／黃豆泥")}</div><div class="elixus-copy">${tag("2001・派樂西王國")}${lead(term("elixus", "Elixus"))}${p("IRC、部落格、紫藤廬。<br>網友也會在茶館見面。")}${rule}<h3>${term("piraport", "Piraport 複照")} / PiraGene</h3>${p("身分、版權、交互信任，<br>都可以拿來當創作材料。")}</div>`,
    "elixus-plate",
  );
  rev(
    19,
    "逃離社群平台",
    `<div class="escape-map" data-diagram="hub"><div class="escape-keystone"><span>V</span><strong>五把鑰匙</strong><small>帶著朋友一起走</small></div><ol class="escape-keys">${[
      ["協議", "讓資料可以搬遷"],
      ["結社", "成員、承諾與分工"],
      ["治理", "申訴、決策與交接"],
      ["金流", "維護成本有人支付"],
      ["抗審查", "受壓時仍能連結"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`,
      )
      .join(
        "",
      )}</ol><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div>${note(`${term("fediverse", "聯邦宇宙")}提供一條路。搬家之後，總還得有人付房租、整理公共空間。`)}`,
    "escape-plate",
  );
  rev(
    20,
    "三種落地實驗",
    `<div class="experiment-triptych"><div>${art("swallow-colony")}<span class="roman">I</span><h3>快閃城市</h3>${p("包下一個地方，<br>讓網友來住一陣子。")}<a href="#20">短期聚集 ↗</a></div><div>${art("fox-path")}<span class="roman">II</span><h3>游擊實驗</h3>${p("帶著技術與理念，<br>投入已經在發生的事。")}<a href="#22">投入現場 ↗</a></div><div>${art("tree-roots")}<span class="roman">III</span><h3>新社會</h3>${p("集結資源，<br>照自己的藍圖蓋聚落。")}<a href="#24">圈地實踐 ↗</a></div></div>${note("這幾年看到了許多不同模式，也與不同參與者碰面聊過天，我覺得都是很有意思的田野題材。")}`,
    "experiments-plate",
  );
  rev(
    21,
    "快閃城市：Zuzalu 的兩個月",
    `<div class="popup-report"><div class="popup-gallery">${photo("zuzalu-moon", "黑山共和國 Luštica Bay 的月夜", "Zuzalu 所在的 Luštica Bay・照片／Cat Thu")}${photo("zuzalu-talk", "Zuzalu 的零知識證明課程現場", "Zuzalu 的 ZK 課程・照片／Cat Thu", "popup-inset")}</div><div class="popup-copy">${tag(term("popup", "POP-UP CITY"))}${lead("住在一起，<br>也把課堂、晚餐與工作帶進日常。")}${rule}<ol class="popup-sequence"><li><b>2023・Montenegro</b><span>約兩個月的共同居住與活動。</span></li><li><b>技術與生活並排</b><span>ZK、公共財、健康，也包含居民自發的課程與共餐。</span></li><li><b>散場後繼續分岔</b><span>後續計畫在不同城市各自延伸。</span></li></ol><p class="popup-other">Edge City・Mu・Frontier Tower</p></div></div>`,
    "popup-plate",
  );
  rev(
    22,
    "散場之後，地方留下了什麼？",
    `${quote("「介於共同工作空間、招商大會、青年旅館與讀書會的複合體。」", "黃豆泥・加密社群田野文章")}<div class="aftermath"><div>${tag("對參與者")}<h3>朋友、工作機會<br>下一站的邀請</h3></div>${art("swallow-colony")}<div>${tag("對在地居民")}<h3>哪些關係與資源<br>能待得久一點？</h3></div></div>${note("我問 Vitalik，Zuzalu 後來怎麼了。他說：去中心了，各地都有人繼續。")}`,
    "aftermath-plate",
  );
  rev(
    23,
    "游擊的人：Amir Taaki",
    `<div class="rojava-photo">${photo("amir-taaki", "Amir Taaki 肖像", "Amir Taaki・攝影／Anastasia Taylor-Lind for WIRED")}</div><div class="rojava-copy">${tag(term("guerrilla", "GUERRILLA EXPERIMENTATION"))}${lead(term("rojava", "羅賈瓦 Rojava"))}<div class="rojava-ledger"><div><b>2015–2016</b><span>WIRED 記錄他在中東停留約 15 個月。</span></div><div><b>離開前線之後</b><span>教當地人使用開源軟體與網路，並參與肥料工廠及太陽能研究。</span></div><div><b>留下的工作</b><span>他也協助設計新教育體系的技術課程。</span></div></div>${note("這些紀錄能確認他做過什麼；課程與工具後來是否延續，公開資料沒有回答。")}</div>`,
    "rojava-plate",
  );
  rev(
    24,
    "兩條數位投票路徑：Rarimo × Vocdoni",
    `<div class="voting-pair"><article><div class="voting-shot">${photo("rarimo-flow", "Rarimo Freedom Tool 投票流程", "Freedom Tool 流程圖／Rarimo 官方文件")}</div>${tag("RARIMO · FREEDOM TOOL")}<h3>先證明資格，再匿名投票</h3>${p(`手機讀取生物特徵護照，以${term("zkp", "零知識證明")}確認資格；官方列出的案例包括 Russia2024、Iranians Vote、United Space。`)}</article><article><div class="voting-shot">${photo("vocdoni", "加泰隆尼亞政府的 Vocdoni 案例圖", "Vocdoni 案例圖／Generalitat de Catalunya")}</div>${tag("VOCDONI · CATALUNYA")}<h3>讓數位投票可以公開驗證</h3>${p("加泰隆尼亞政府把 Vocdoni 列為區塊鏈成功案例：提供去中心化、可普遍驗證的投票基礎設施。")}</article></div><p class="caveat">${term("rarimo", "兩者不是同一專案")}：Rarimo 著重護照資格與隱私證明；Vocdoni 是另一套數位投票工具。</p>`,
    "voting-plate",
  );
  rev(
    25,
    "把理念蓋成一個地方",
    `<div class="society-layout"><div class="society-caption">${tag("BALAJI SRINIVASAN")}${lead(term("network", "New Society"))}${photo("network-school-cna", "Network School 在馬來西亞 Forest City 的展示空間", "Network School 展示空間，Forest City，2026・攝影／CNA・Zamzahuri Abas", "society-photo")}</div><div class="society-stair" data-diagram="up"><ol>${[
      ["網路社群", "先有共同認同"],
      ["集結資源", "資金、技能、支持者"],
      ["實體聚居", "Network School"],
      ["生活規則", "在同一棟樓裡實踐"],
    ]
      .map(
        ([h, t], i) =>
          `<li class="flow-step"><span class="step-no">0${i + 1}</span><h3>${h}</h3><p>${t}</p></li>`,
      )
      .join(
        "",
      )}</ol><button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播</button></div></div>${note("網路國家的主權願景，還不是已經發生的事。")}`,
    "society-plate",
  );
  rev(
    26,
    "自由意志主義者，也要做早操？",
    `<div class="exercise-quote">${tag("NETWORK SCHOOL・朋友轉述")}${quote("「我還真沒辦法想像一群『自由意志主義者』會一起集體做早操。」", "黃豆泥")}${rule}</div><div class="exercise-notes"><div><span>一</span><h3>一起生活</h3>${p("早操、居住問題，<br>還有公開表達的不滿。")}</div><div><span>二</span><h3>「百花齊放」</h3>${p("朋友用這四個字，形容<br>徵求意見後有人被逐出的經驗。")}</div><div><span>三</span><h3>誰能留下？</h3>${p("空間握在主理人手上時，<br>異議者有什麼選擇？")}</div></div><p class="caveat">以上為講者友人的轉述，尚未經獨立查證。</p>`,
    "exercise-plate",
  );
  rev(
    27,
    "何處是故鄉",
    `<div class="village-chapter-copy">${tag("第四章　/　PUTTING DOWN ROOTS")}${lead("地方創生<br>山古志村<br>關係人口")}${art("koi-roots")}</div><div class="village-landscape"><img src="assets/yamakoshi-snow.webp" alt="山古志村雪景，張寶成攝影" width="1000" height="700" loading="lazy"><p>山古志村雪景・攝影／張寶成</p></div>`,
    "village-chapter",
  );
  rev(
    28,
    "遠方的人，也能成為村民嗎？",
    `<div class="villagers-photo">${photo("digital-villagers", "台灣小隊展示錦鯉 NFT", "台灣小隊展示錦鯉 NFT。原文圖／Nishikigoi NFT Discord")}</div><div class="villagers-copy">${art("koi-roots")}<h3>${term("relation", "關係人口")}</h3>${p("不只來玩一次，<br>也不必立刻搬來住。")}<h3>${term("nft", "錦鯉 NFT")}</h3>${p("從一件作品、一個群組，<br>開始與山古志有來往。")}</div>`,
    "villagers-plate",
  );
  rev(
    29,
    "網路與村落之間，要有人來回跑",
    `${diagram(
      "loop",
      [
        ["關注與加入", "第一次看見山古志"],
        ["共同參與", "討論、提案與資源"],
        ["地方執行", "熟悉村落的人接手"],
        ["持續回應", "再把日常需求帶回來"],
      ],
      `<div class="hub-core">${term("mediator", "中介行動者")}<small>懂地方，也接得住外部資源</small></div>`,
    )}<aside>${photo("village-vote", "Nishikigoi 專案的投票頁面", "原文圖／Nishikigoi NFT Snapshot")}${p(`${term("dao", "DAO")}有投票程序。<br>提案落地，還是得靠人。`)}</aside>`,
    "mediator-plate",
  );
  rev(
    30,
    "海外者的數位結社？",
    `<div class="association-layout"><div class="association-hub">${art("tree-roots")}<span>我們</span></div><div class="association-notes">${[
      ["資金", "共同支持什麼？<br>長期成本怎麼付？"],
      ["人才", "把專長接起來。<br>也把工作分下去。"],
      ["資訊", "經驗不要只留在<br>滑過就找不到的聊天室。"],
      ["制度", "有人決策、有人接手，<br>新人也進得來。"],
    ]
      .map(([h, t], i) => `<div><span>0${i + 1}</span><h3>${h}</h3><p>${t}</p></div>`)
      .join("")}</div></div>`,
    "association-plate",
  );
  rev(
    32,
    "被機器奴役的未來",
    `<div class="machine-quote">${tag("兩種未來觀 I・1995・§173")}${quote("“At that stage the machines will be in effective control.”", "Ted Kaczynski")}${lead("「到了那個階段，<br>機器將實際掌握控制權。」")}${note("本簡報譯文")}<p class="caveat">文章${term("ted", "〈論工業社會及其未來〉")}作為批判閱讀材料；不認同作者的暴力行動。</p></div>${art("mechanical-bird", "machine-emblem")}`,
    "manifesto machine-plate",
  );
  rev(
    33,
    "機器工作，人類稀疏",
    `<div class="solaria-copy">${tag("兩種未來觀 II・1957")}${lead(`艾希莫夫《裸陽》<br>${term("solaria", "Solaria／索拉利星")}`)}<div class="solaria-pair">${panel(entry("工作交給機器人", "人類分散住在各自的領地。"))}${panel(entry("見面變成難事", "遠距交往很熟悉，肉身相見卻令人不安。"))}</div>${p("不必再為工作聚集之後，<br>還有什麼讓人願意靠近彼此？")}</div><div class="book-cover-pair"><div class="book-cover-card"><span>ENGLISH EDITION</span>${photo("naked-sun", "Isaac Asimov The Naked Sun 英文版書封", "《The Naked Sun》英文版／Penguin Random House")}</div><div class="book-cover-card"><span>繁體中文版</span>${photo("naked-sun-zh", "艾西莫夫《裸陽》繁體中文版書封", "《機器人四部曲 II：裸陽》繁體中文版／貓頭鷹出版社")}</div></div>`,
    "solaria-plate",
  );
  rev(
    34,
    "01｜還有多少「足夠的工作」？",
    `<div class="work-opening">${tag("DANIEL SUSSKIND")}<div class="work-large">工作還在。<br><em>薪水呢？</em></div>${p("Susskind 看的是任務如何被逐步接手。<br>職缺沒有歸零，仍可能發生薪資下降、<br>工時不穩；收入、地位與意義，也跟著鬆動。")}</div><div class="work-specimen">${art("mechanical-bird")}<div class="two-notes">${note("過去：新任務曾抵銷替代。")}${note("往後：新任務也可能交給機器。")}</div></div>`,
    "work-opening-plate",
  );
  rev(
    35,
    "02｜一份工作，是一束任務",
    `<div class="task-bundle"><div class="bundle-origin"><span>一份工作</span><div>${["觀察", "診斷", "操作", "記錄", "協調", "判斷"].map((x) => `<b>${x}</b>`).join("")}</div>${note("示意任務，非特定職業清單")}</div><div class="bundle-branches"><div class="flow-step"><span class="step-no">A</span><h3>${term("complement", "替代力量")}</h3>${p("機器接手其中一部分，<br>對人的需求可能減少。")}</div><div class="flow-step"><span class="step-no">B</span><h3>互補力量</h3>${p("生產力提高、需求擴大，<br>也可能長出新的部門與任務。")}</div></div></div>${note("不用先做出通用人工智慧，也能一步一步改變一份工作。")}`,
    "bundle-plate",
  );
  rev(
    36,
    "03｜有工作搆不到，還是工作不夠？",
    `<div class="gap-comparison"><div>${tag("摩擦與錯配")}<h3>機會在另一邊</h3><ol><li><b>技能</b><span>能力與職缺對不上</span></li><li><b>認同</b><span>不願或不敢換一種身分</span></li><li><b>地點</b><span>機會集中，搬遷有成本</span></li></ol></div><div>${tag("結構性需求不足")}<h3>過了橋，也沒有職缺</h3>${p("即使再訓練完成，市場仍可能<br>不需要那麼多人類勞動。")}${p("商品與服務變多，<br>人的工作機會未必跟著增加。")}</div></div>${note("遠距與遊牧鬆動了地點限制。技能、照護、收入分配，還在原地等著。")}`,
    "gap-plate",
  );
  rev(
    37,
    "04｜機器創造的繁榮，分到誰手上？",
    `<div class="balance"><div>${tag("人力資本")}<h3>技能・經驗・知識</h3>${p("靠工資分享收益。<br>需求與薪資卻可能往下走。")}</div><span class="balance-pivot" aria-hidden="true">△</span><div>${tag("其他資本")}<h3>機器・土地・股權・資料</h3>${p("持有資產的人，<br>可能拿走更多新增收益。")}</div></div><div class="distribution-band">${entry("Susskind 的回應", "收入分享、資本分享、勞動保障；也要處理大型科技權力與休閒的公共安排。")}${note(`${term("cbi", "UBI／CBI")}：照護與社群貢獻，要不要換成收入？由誰認定？`)}</div>`,
    "balance-plate",
  );
  rev(
    38,
    "05｜少一點上班，空出來做什麼？",
    `<div class="leisure-art">${art("moth-window")}${tag("SRNICEK & WILLIAMS")}</div><div class="leisure-copy">${lead("學習、創作、照護、<br>政治參與、社交、遊戲。")}${rule}${p("後工作主張讓人有能力拒絕惡劣的工作。<br>少賣一點時間，不代表人的活動也少了。")}${p(`${term("freedom", "合成自由")}需要收入、時間、公共服務。<br>不能只叫大家勇敢做自己。`)}</div>`,
    "leisure-plate",
  );
  rev(
    39,
    "06｜一次活動，怎麼變成長期的力量？",
    `<div class="politics-intro">${tag("SRNICEK & WILLIAMS")}${p(`他們批評${term("folk", "常民政治")}：短期、地方、直接行動可以聚人；若始終停在這裡，就很難改變更大的制度。`)}</div>${diagram(
      "up",
      [
        ["共同想像", "提出值得爭取的未來"],
        ["組織累積", "社群、媒體與工會"],
        ["擴大聯盟", "連結政治組織與公共討論"],
        ["持續施力", "政策、投資、公共制度"],
      ],
    )}${note("這也是快閃城市會遇到的問題：人散了，事情還做得下去嗎？")}`,
    "politics-plate",
  );
  rev(
    40,
    "07｜後工作的要求，與它的岔路",
    `<div class="demands"><h3>四項要求，一起推</h3>${[
      ["01", "必要勞動自動化"],
      ["02", "縮短工作週"],
      ["03", "足以生活的基本收入"],
      ["04", "鬆動工作倫理"],
    ]
      .map(([n, t]) => `<div><span>${n}</span><b>${t}</b></div>`)
      .join(
        "",
      )}</div><div class="crossroads"><h3>走下去，也可能走歪</h3>${p("富國享受紅利，窮國繼續低薪勞動。")}${p("機器多了，能源與生態負擔也多了。")}${p("男性少上班，女性繼續無薪照護。")}${rule}${note("作者要求的解放，同時包含全球、性別與生態正義。")}</div>`,
    "demands-plate",
  );
  rev(
    41,
    "08｜什麼才算親勞工 AI？",
    `${p(`${term("proworker", "Acemoglu／Autor／Johnson")}關心的是：專業價值、報酬與自主，有沒有一起增加？`)}<div class="ai-directions">${[
      ["I", "增強勞動／資本", "效率提高。<br>收益分配仍未定。"],
      ["II", "自動化", "機器接手任務。<br>對人的需求可能下降。"],
      ["III", "專業平準化", "新手更容易上手。<br>原有專業也可能貶值。"],
      ["IV", "創造新任務", "出現新的工作，<br>需要人的判斷與專業。"],
    ]
      .map(([n, h, t]) => `<div><span>${n}</span><h3>${h}</h3><p>${t}</p></div>`)
      .join("")}</div>${note("產出增加了、按鈕變少了，還不足以回答這個問題。")}`,
    "directions-plate",
  );
  rev(
    42,
    "09｜同一項技術，可以分成三條路",
    `${diagram(
      "fork",
      [
        ["自動化器", "技師成為指令的眼睛與雙手"],
        ["技師助手", "協助診斷、判斷與複雜修復"],
        ["轉軌助手", "支持學習新領域與新任務"],
      ],
      `<div class="fork-source">航空維修的 AI<small>三種假想設計，並非演進順序</small></div>`,
    )}<div class="policy-band">${tag("改變誘因的工具")}${p("採購・補助・稅制・競爭政策・勞工發言權")}</div>${note("電工、教師、專利審查與無障礙工作已有輔助案例；部署也可能走向中央監控。")}`,
    "fork-plate",
  );
  rev(
    43,
    "10｜帶著這些分歧，繼續討論",
    `<div class="last-questions">${[
      ["人", "用了工具，我還留下哪些能力？"],
      ["勞動", "新任務、收入與收益，分給了誰？"],
      ["社群", "誰有力量改規則？誰被排除？"],
      ["制度", "誰設計、採購、管理，又向誰負責？"],
    ]
      .map(([a, b]) => `<div><span>${a}</span><p>${b}</p></div>`)
      .join(
        "",
      )}</div><div class="last-colophon">${art("swallow-colony")}${p("這幾位作者對市場、行動者，<br>甚至工作本身的未來，都不完全同意。")}${rule}${tag("人・勞動・社群・空間・世界")}</div>`,
    "last-plate",
  );
  return slides;
}
