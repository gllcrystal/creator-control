# 创作者中控工作台 · Creator Control

一个**自媒体创作者的全局中控仪表盘 + 统一导航网关**。所有高价值数据（任务/灵感/日记/项目/知识库）永久存在你自己的 **Notion** 与 **滴答清单** 里，工作台只做**只读聚合展示** + 统一跳转，绝不自建完整数据库。

> 设计原则：数据只读 · 真机可用 · 像原生 App 一样（PWA）· 可永久在线部署

---

## ✨ 功能

- **主页仪表盘**：今日三件事、目标进度、能量曲线等只读聚合卡片
- **时间与事件**：滴答今日任务（点击完成 / 长按跳计时）、习惯与时间视图跳转
- **灵感收集中枢**：🫧 气泡式灵感 / 日记 / 信息摄入三个切换 Tab；支持小红书 / GitHub 自动扒取并打 `AI·内容` 标签，做成你的专属 Newsletter
- **自媒体项目进度**：项目卡片 + 发布复盘详情页
- **学以致用**：爆款拆解链接，反向同步回 Notion
- **🤖 真·AI 对话**：内置 AI 抽屉，接入你自己的大模型（OpenAI / DeepSeek / Moonshot 等 OpenAI 兼容接口），多轮对谈选题、复盘、脚本
- **底部快捷栏**：⚡ 灵光一现（随手记灵感，同步 Notion）/ 📝 新建日记 / ⏱ 计时器（跳滴答）/ 🤖 AI
- **PWA**：可「添加到主屏幕」当作 App 使用

---

## 🚀 一键部署到 Vercel（永久在线，永不休眠）

### 方式一：一键部署按钮（推荐）

先把本仓库推到你的 GitHub，然后点下面的按钮（把下面链接里的 `<你的用户名>/<仓库名>` 换成你的）：

```
https://vercel.com/new/clone?repository-url=https://github.com/<你的用户名>/<仓库名>
```

> Vercel 会自动识别：`index.html` 作为静态站点，`api/cors.js` 作为 Serverless 函数（CORS 代理）。

### 方式二：手动部署

```bash
# 1. 克隆 / 上传本目录到 GitHub
# 2. 打开 https://vercel.com/import
# 3. 选择该仓库 → 框架选 "Other" → Deploy
# 完成！你会得到一个 *.vercel.app 的永久链接
```

部署后，工作台自带**同源 CORS 代理** `/api/cors`，无需任何额外配置即可在浏览器里直接拉取 Notion / 滴答 / AI 数据。

---

## ⚙️ 首次配置（在 App 内完成）

打开工作台 → 右上角 **⚙️ 设置**：

| 配置项 | 作用 | 去哪找 |
|--------|------|--------|
| **Notion Integration Token** | 拉取你的 Notion 数据 | [notion.so/my-integrations](https://www.notion.so/my-integrations) 新建集成后复制 `secret_...`；并在每个数据库「··· → Connections」里添加该集成 |
| **各数据库 ID** | 灵感库 / 日记 / 项目 / 信息摄入 / 拆解 / 知识库 | 打开数据库页面，浏览器地址栏最后那串 32 位字符串 |
| **滴答清单 Access Token** | 拉取任务 / 时间数据 | 滴答开放 API 后台生成 |
| **AI API Key / Base / 模型** | 启用真·AI 对话 | 你自己的 OpenAI / DeepSeek / Moonshot Key |

> 🔒 所有凭证**仅存你本地浏览器（localStorage）**，经同源代理转发，**不上传任何服务器**。

---

## 📁 项目结构

```
index.html          # 单文件工作台（前端全部逻辑）
api/cors.js         # Vercel Edge 函数：同源 CORS 代理（关键，让浏览器能直连外部 API）
manifest.webmanifest# PWA 清单（添加到主屏幕）
icon.svg            # 应用图标（🫧 气泡）
server.js           # 本地预览用：静态托管 + 同源代理（仅开发时使用）
vercel.json         # 线上部署配置（SPA 回退）
```

---

## 💡 本地预览

```bash
node server.js        # 然后访问 http://localhost:8000
```

---

## 📱 当 App 用（手机）

- **iPhone**：Safari 打开 → 分享 → 「添加到主屏幕」
- **Android**：Chrome 打开 → 菜单 → 「安装应用 / 添加到主屏幕」

之后从桌面点开就是全屏独立窗口，无浏览器地址栏，体验等同原生 App。
