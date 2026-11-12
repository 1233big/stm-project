// 站内链接检查
// 扫描根目录所有 html 的 href/src，确认指向的文件真实存在
// 用法：node scripts/check-links.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = /^(https?:|mailto:|tel:|data:|javascript:|#)/i;

const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
const problems = [];
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const re = /(?:href|src)\s*=\s*"([^"]+)"/gi;
  let m;

  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (IGNORE.test(raw)) continue;
    // 跳过 JS 拼出来的地址，例如 ' + course.u + '
    if (/['"`$+{}\s]/.test(raw)) continue;

    const ref = raw.split('#')[0].split('?')[0];
    if (!ref) continue;

    let target = ref;
    try {
      target = decodeURIComponent(ref);
    } catch (e) {
      // 非法转义就按原文找
    }

    checked++;
    if (!fs.existsSync(path.resolve(ROOT, target))) {
      problems.push(`${page} → ${raw}`);
    }
  }
}

console.log(`检查 ${pages.length} 个页面，共 ${checked} 条站内引用`);

if (problems.length) {
  console.error(`\n发现 ${problems.length} 条失效引用：`);
  problems.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}

console.log('全部通过');
