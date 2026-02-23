# Facebook 半自動同步（個人檔案）

每次發完 Facebook 新文後，複製該篇貼文網址，執行：

```bash
npm run fb:sync -- --url "https://www.facebook.com/..."
```

如果本機遇到 Facebook 憑證鏈問題，可加上：

```bash
npm run fb:sync -- --url "https://www.facebook.com/..." --insecure
```

腳本會更新：

- `/Users/mashbean/Codex/src/data/facebook-latest.json`

過濾規則：

- 排除分享貼文
- 排除置頂貼文
- 只接受純文字或含圖片貼文

注意：

- 這是「半自動」流程，不依賴 Facebook API 權限與 RSSHub。
- 你需提供單篇貼文網址，腳本不會自動掃整個時間軸。
- 可選手動覆蓋數字：`--likes 123 --comments 45 --shares 6`
