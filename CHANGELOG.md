# 更新日志

本文件的格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [1.0.0] - 2026-11-12

首个版本：14 个页面全部完成，站点公开上线。

### Added

- 方向层：成长路线图、软硬件全栈学习计划、就业达标补充路线
- 执行层：15 周逐周任务清单、105 天逐日任务表、学练双线
- 反馈层：打卡日历、每周复盘周报
- 资料层：学习资源库、项目库、面试题库、故障速查手册、器材采购清单
- `index.html` 站点首页，作为 GitHub Pages 的导航入口
- `.nojekyll`，让 Pages 直接输出静态文件
- `scripts/build-plan-data.js`：从逐日任务表生成 `assets/plan-data.js`
- `scripts/check-links.js` 与对应 CI：检查站内引用是否指向真实文件

### Fixed

- `assets/theme.css` 中 `.wrap` 缺少 `box-sizing: border-box`，导致所有页面在
  `width:100%` 叠加左右内边距后横向溢出约 90px、右侧内容被裁切

[Unreleased]: https://github.com/1233big/stm-project/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/1233big/stm-project/releases/tag/v1.0.0
