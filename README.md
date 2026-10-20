# Little Keys — Learn piano, one note at a time

A gentle, bilingual piano-reading game for beginners. Play with a mouse, touch screen, or computer keyboard. Progress stays in this browser; no account or backend is required.

**Live app:** https://paulpowang.github.io/learning-piano-101/

## Features

- 16 guided lessons: middle C, higher treble notes, bass clef, sharps, flats and naturals.
- 12 purchasable songs with two-line scrolling scores, Pip's hopping note guide and flowers for completed notes.
- Tokens, six badges, and purchasable garden decorations. First completions earn rewards once; hints never reduce rewards.
- English and Traditional Chinese, keyboard-label settings, and free play in middle and bass registers.
- No countdowns, lives or wrong-note penalties. No Google login or cloud synchronization in this version.

## Development

Requires a current Node.js LTS release.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Serve the application over HTTP rather than opening index.html directly because the app uses JavaScript modules.

```sh
npm run check
npm test
npx playwright test --workers=2
npm run build
```

Browser tests use locally installed Microsoft Edge. See DEVELOPMENT.md for further details.

## Deployment

GitHub Actions builds the current root-level source into `dist/` and deploys it to GitHub Pages on pushes to `main`. The build copies only the six browser assets plus `.nojekyll`. Generated `dist/` files are not committed. Pages source is **GitHub Actions**.

The obsolete NoteNest archive and generated prototype are no longer used. The root-level JavaScript, HTML and CSS are the source of truth.

## 繁體中文

Little Keys 提供 16 個循序漸進的識譜關卡與 12 首可購買的練習曲。支援滑鼠、觸控及電腦鍵盤，可切換英文／繁體中文。進度、token 與收藏僅儲存在目前瀏覽器；此版本沒有登入或跨裝置同步。
