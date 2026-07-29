# 真机使用 & 部署说明（手机可用 · 真实数据）

> 目标：让你在电脑和手机浏览器里都能打开这个工作台，并**直接拉取你真实的 Notion / 滴答数据**。
> 关键障碍：Notion / 滴答 API 默认**不允许浏览器直连（CORS）**，所以需要一个极简代理转发请求。下方提供一键部署方案。

---

## 一、为什么需要代理（CORS）

浏览器出于安全，会阻止前端直接 `fetch('https://api.notion.com/...')`（CORS 报错）。
解决方式：部署一个只做「转发 + 加 CORS 头」的代理，前端把目标 URL 当参数传过去：

```
前端 → 你的代理(加 Access-Control-Allow-Origin) → Notion / 滴答 API
```

仓库已内置两种代理，选一个部署即可：

| 方案 | 文件 | 适合人群 |
|------|------|----------|
| **Vercel**（推荐，和静态站点一起部署） | `api/cors.js` | 有 GitHub 账号，想一处托管 |
| **Cloudflare Workers** | `proxy/cloudflare-worker.js` | 已有 CF 账号，或想要独立域名 |

---

## 二、Vercel 一键部署（推荐）

1. 把本仓库推到 GitHub。
2. 在 [vercel.com](https://vercel.com) 用 GitHub 导入该仓库。
   - 框架预设选 **Other / 静态**，输出目录留空（默认根目录）。
   - `api/cors.js` 会被 Vercel 自动识别为 Serverless Function，地址为 `https://你的项目.vercel.app/api/cors`。
3. 部署完成后拿到地址，进入工作台 ⚙️ 设置：
   - **数据源代理** 填：`https://你的项目.vercel.app/api/cors?url=`
4. 填好 Notion Token、6 个数据库 ID、滴答 Token，保存即可拉真实数据。

> 也可以纯静态托管 `index.html` 到 GitHub Pages / Netlify，代理单独部署到 Vercel/CF，二者地址不同没关系，只要在设置里填对代理地址即可。

---

## 三、Cloudflare Workers 部署

1. 登录 [workers.cloudflare.com](https://workers.cloudflare.com) → 新建 Worker。
2. 清空默认代码，粘贴 `proxy/cloudflare-worker.js`，部署。
3. 得到 `https://你的子域.workers.dev`。
4. 工作台设置里 **数据源代理** 填：`https://你的子域.workers.dev/?url=`

---

## 四、获取凭证

| 凭证 | 获取方式 |
|------|----------|
| **Notion Token** | Notion → 设置 → 连接 → 开发 → 新建 Integration，复制 `secret_...`；并到每个数据库「连接」该 Integration |
| **数据库 ID** | 打开任意 Notion 数据库网页，URL 中 `notion.so/<workspace>/<这串32位hex>?v=` 里的 32 位即 ID |
| **滴答 Token** | 滴答清单 → 设置 → 第三方集成 / 开放 API → 创建 Token（OAuth 或直接生成访问令牌） |

---

## 五、手机上使用

- **添加到主屏幕**：在手机浏览器打开部署好的站点 → Safari「分享 → 添加到主屏幕」/ Chrome「菜单 → 安装应用」。
  因已配置 `manifest.webmanifest` 与 `apple-touch-icon`，它会以**全屏 App** 形态打开，不显示浏览器地址栏。
- 底部快捷栏（灵光一现 / 新建日记 / 计时器 / 唤起 AI）在手机上常驻，单手可操作。
- 已做安全区（刘海/底部白条）适配，不会被挡。
- 凭证仅存你手机/电脑浏览器的 `localStorage`，**不上传任何服务器**（代理也只转发，不留存）。

---

## 六、隐私与安全提示

- 代理会转发带 `Authorization` 的请求头到 Notion/滴答；这是必要行为，但请**仅自己使用**该代理，或加一个简单的密钥校验（在 `cors.js` 里校验 `?key=你的密钥`）。
- 不要把自己未脱敏的代理地址公开分享，避免他人盗用你的 Token 额度。
- 如需更强隔离，可把代理与前端都部署在自己域名下并开启 HTTPS。
