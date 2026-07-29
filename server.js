// 一体服务器：静态托管工作台 + 内置 CORS 代理（/api/cors）
// 用途：在沙箱预览或自托管时，让前端浏览器能直接拉取 Notion / 滴答 API（同源，无跨域问题）
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "/workspace";
const PORT = process.env.PORT || 8000;
const ALLOW = ["content-type", "authorization", "notion-version", "accept"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  // 防目录穿越
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end("forbidden"); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); res.end("404 not found"); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function proxy(req, res) {
  const u = new URL(req.url, "http://localhost");
  const target = u.searchParams.get("url");
  if (!target || !/^https?:\/\//.test(target)) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("missing ?url=");
    return;
  }
  const headers = {};
  for (const k of ALLOW) { const v = req.headers[k]; if (v) headers[k] = v; }
  const body =
    req.method === "POST"
      ? (() => { let b = ""; req.on("data", (c) => (b += c)); return new Promise((r) => req.on("end", () => r(b))); })()
      : Promise.resolve(undefined);
  body.then((b) =>
    fetch(target, { method: req.method, headers, body: b })
  ).then((r) => {
    const ct = r.headers.get("content-type") || "application/json";
    res.writeHead(r.status, {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "content-type": ct,
    });
    return r.text();
  }).then((txt) => res.end(txt))
   .catch((e) => { res.writeHead(502); res.end("proxy error: " + e.message); });
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
    });
    res.end();
    return;
  }
  if (req.url.startsWith("/api/cors")) { proxy(req, res); return; }
  serveStatic(req, res);
});

server.listen(PORT, "0.0.0.0", () => console.log("serving on " + PORT));
