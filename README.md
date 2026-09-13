# LeetGold

把 CodeTop 高频算法题做成黄金矿工风格的手机闯关游戏。

> 当前状态：公开内测。题目、交互与学习路径仍会持续优化。

## 在线体验

[开始开采 CodeTop 100](https://algogo-codetop-100.noemazhao.chatgpt.site/)

## 核心玩法

- 按哈希与滑动窗口、链表、二叉树、动态规划等主题组织 CodeTop 高频题。
- 每个单元先结合具体题干讲清核心概念。
- 用逐步动画展示变量、数据结构和关键代码的变化。
- 通过代码排序、变量含义选择、关键代码选择与手写填空完成学习闭环。
- 答错后立即显示正确答案，并要求重做同一道题直到掌握。
- 通关获得金币，学习进度保存在当前浏览器中。

## 本地开发

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 技术栈

- React 19
- TypeScript
- vinext / Vite
- Cloudflare Workers 兼容构建

## 内测反馈

欢迎通过 GitHub Issues 反馈题干、题解动画、交互体验或移动端显示问题。提交问题时请注明题目编号、操作步骤和使用的设备。

## 内容说明

题目内容用于算法学习，题干采用依据公开题意重新表述的学习版摘要。LeetCode 与 CodeTop 的名称及相关商标归其各自权利人所有。
