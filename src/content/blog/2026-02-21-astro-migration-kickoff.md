---
title: "Astro 遷移 Kickoff：從 Jekyll 到可擴充內容架構"
description: "記錄本次部落格遷移的第一步：先穩定內容層，再逐步引入互動功能。"
pubDate: "2026-02-21T09:00:00+08:00"
updatedDate: "2026-02-21T10:30:00+08:00"
draft: false
tags: ["Astro", "Migration", "GitHub Pages"]
category: "工程實作"
cover: "images/posts/astro-cover.svg"
coverAlt: "Astro migration cover illustration"
lang: "zh-TW"
canonicalURL: "https://mashbean.net/blog/2026-02-21-astro-migration-kickoff/"
author: "Mashbean"
series: "Blog Migration"
seriesOrder: 1
---

這是新的 Astro 架構第一篇文章，目標很明確：

1. 先確保內容遷移穩定。
2. 不在第一天把互動功能全部塞滿。
3. 保留 GitHub Pages + GitHub Actions 的部署習慣。

## 技術決策（MVP）

- Framework: Astro
- Type system: TypeScript
- Styling: Tailwind CSS
- Content source: Markdown（先不用 MDX）
- Deployment: GitHub Pages (Actions)

## 代碼區塊樣式測試

```ts
export function hello(name: string): string {
  return `Hello, ${name}`;
}
```
