/* 从 105天逐日任务表.html 的 PLAN 数组生成 assets/plan-data.js
   用法：node scripts/build-plan-data.js
   改了 105 天表的内容或标签后必须重跑一次，否则总控台的今日清单会和表里不一致。 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, '105天逐日任务表.html'), 'utf8');

const start = html.indexOf('const PLAN = [');
const end = html.indexOf('\n];', start) + 3;
if (start < 0 || end < 3) throw new Error('没找到 PLAN 数组');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(html.slice(start, end) + '\nthis.PLAN = PLAN;', ctx);
const PLAN = ctx.PLAN;

const START = new Date(2026, 10, 2); // 2026-11-02，与 PLAN 第一周对齐
const pad = n => ('0' + n).slice(-2);
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

const courses = {
  M1: { n: '数字电子技术基础', u: 'https://www.bilibili.com/video/BV1vPuP6bEmW/', t: '数制 / 门电路 / 组合与时序逻辑' },
  M2: { n: '王道 计算机组成原理', u: 'https://www.bilibili.com/video/BV1ps4y1d73V/', t: '数据表示：补码、IEEE754' },
  M3: { n: '江协科技 STM32 入门', u: 'https://www.bilibili.com/video/BV1th411z7sn/', t: '按当天外设找对应集' },
  M4: { n: '故障速查手册', u: '故障速查手册.html', t: '卡住时先查这里', internal: true },
  M5: { n: '（画板无课）', u: '', t: '照原理图与手册，不动手没法学' }
};

let cursor = new Date(START);
const days = [];

PLAN.forEach(wk => {
  (wk.days || []).forEach((day, di) => {
    days.push({
      k: iso(cursor), di,
      w: wk.w, mod: wk.mod, theme: wk.theme, h: day.h,
      t: day.t, st: day.st,
      tasks: (day.ta || []).map((x, ti) => ({ x, k: (day.tp || '')[ti] || '杂' }))
    });
    cursor.setDate(cursor.getDate() + 1);
  });
});

const header = '/* 自动生成，请勿手改。改 105天逐日任务表.html 后运行 node scripts/build-plan-data.js 重新生成。*/\n';
const body = 'window.PLAN_DATA = ' + JSON.stringify({
  start: '2026-11-02',
  end: days[days.length - 1].k,
  courses, days
}) + ';\n';

fs.writeFileSync(path.join(root, 'assets/plan-data.js'), header + body, 'utf8');
console.log('days', days.length, 'tasks', days.reduce((a, d) => a + d.tasks.length, 0),
  'range', days[0].k, '→', days[days.length - 1].k);
