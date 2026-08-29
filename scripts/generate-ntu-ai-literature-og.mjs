import sharp from "sharp";
import { fileURLToPath } from "node:url";

const output = new URL("../public/decks/ntu-ai-literature-workshop/assets/og.png", import.meta.url);
const outputPath = fileURLToPath(output);
const svg = String.raw`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#15151a"/>
  <circle cx="1060" cy="120" r="240" fill="#282331"/>
  <circle cx="1060" cy="120" r="150" fill="#a995ff" fill-opacity="0.18"/>
  <path d="M0 532H1200" stroke="#a995ff" stroke-opacity="0.42" stroke-width="2"/>
  <text x="76" y="76" fill="#b9ff5a" font-family="Arial, PingFang TC, sans-serif" font-size="22" font-weight="700" letter-spacing="3">AI 文學創作工作坊 · 臺大文學院</text>
  <text x="76" y="174" fill="#ffffff" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="62" font-weight="700">我們距離機器會夢見</text>
  <text x="76" y="254" fill="#a995ff" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="76" font-weight="700">電子羊</text>
  <text x="362" y="254" fill="#ffffff" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="62" font-weight="700">的時代有多近？</text>
  <text x="76" y="353" fill="#d2d0d8" font-family="PingFang TC, Noto Sans TC, sans-serif" font-size="28">文學獎評選爭議、合成工具賞析、匿名同儕審查實驗</text>
  <g transform="translate(76 427)">
    <rect width="280" height="62" rx="6" fill="#24242c" stroke="#44444e"/>
    <text x="22" y="39" fill="#ffffff" font-family="PingFang TC, sans-serif" font-size="20" font-weight="600">作品 × 工具 × 判斷程序</text>
  </g>
  <text x="76" y="579" fill="#95929f" font-family="Arial, PingFang TC, sans-serif" font-size="20">2026.09.02 · 臺文所 530 教室</text>
  <text x="1124" y="579" fill="#b9ff5a" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="700">MASHBEAN.NET</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath);
console.log(outputPath);
