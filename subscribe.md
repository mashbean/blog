---
layout: page
title: RSS 訂閱
permalink: /subscribe/
---

<section class="subscribe-panel" data-reveal>
  <h1>訂閱這個部落格</h1>
  <p>如果你使用 RSS Reader，建議先選閱讀器，再貼上 Feed URL。</p>

  <ol class="subscribe-steps">
    <li><strong>選一個閱讀器：</strong>Feedly、Inoreader、NetNewsWire 都可以。</li>
    <li><strong>匯入 Feed URL：</strong>複製下面網址貼到閱讀器的「Add Feed」。</li>
    <li><strong>確認更新頻率：</strong>預設會抓最新文章與摘要。</li>
  </ol>

  <div class="subscribe-feed-box">
    <label for="rss-feed-url"><strong>Feed URL</strong></label>
    <code id="rss-feed-url">{{ '/feed.xml' | absolute_url }}</code>
    <button id="rss-copy-btn" class="page-chip" type="button">複製 Feed URL</button>
    <p id="rss-copy-status" class="subscribe-note" aria-live="polite"></p>
  </div>

  <div class="subscribe-actions">
    <a class="page-chip" href="https://feedly.com/i/subscription/feed/{{ '/feed.xml' | absolute_url | uri_escape }}" target="_blank" rel="noopener noreferrer">用 Feedly 開啟</a>
    <a class="page-chip" href="https://www.inoreader.com/?add_feed={{ '/feed.xml' | absolute_url | uri_escape }}" target="_blank" rel="noopener noreferrer">用 Inoreader 開啟</a>
    <a class="page-chip" href="{{ '/feed.xml' | relative_url }}" target="_blank" rel="noopener noreferrer">查看原始 XML</a>
  </div>

  <p class="subscribe-note">看到 XML 原始內容是正常的；一般讀者應透過 RSS Reader 閱讀，而不是直接看 XML。</p>
</section>
