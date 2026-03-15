# Preview Workflow (Local / A)

這份流程用在「不影響正式站」的前端檢查。

## 1) 建立或切換分支

```bash
cd /Users/mashbean/Codex/Blog
git switch -c codex/fb-migration-sprint
```

如果分支已存在：

```bash
git switch codex/fb-migration-sprint
```

## 2) 啟動本機預覽

```bash
cd /Users/mashbean/Codex/Blog
npm run dev
```

打開終端顯示的網址（通常是 `http://localhost:4321`）。

## 3) 檢查前先跑品質檢查（建議）

```bash
cd /Users/mashbean/Codex/Blog
npm run check
```

必要時可加：

```bash
npm run build
```

## 4) 結束預覽

在 `npm run dev` 的終端按 `Ctrl + C`。

## 最小日常流程（建議）

1. `git switch codex/你的分支`
2. 修改程式
3. `npm run check`
4. `npm run dev` 看本機 UI
5. 確認後再 commit / push（仍不會動到正式版）

## 備註

- 你現在在分支上跑本機網址，**不會影響正式網站**。
- 只有 merge 到 `main`（或你正式發佈）才會影響正式版。
