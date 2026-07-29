// Cloudflare Worker · 极简 CORS 代理
// 部署：在 Cloudflare Workers 新建，粘贴本文件并部署，得到 *.workers.dev
// 使用：在设置「数据源代理」填入 https://你的.workers.dev/?url=
const ALLOW = ["content-type", "authorization", "notion-version", "accept"];

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get("url");
    if (!target) return new Response("missing ?url=", { status: 400 });

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
        },
      });
    }

    const headers = {};
    for (const k of ALLOW) {
      const v = req.headers.get(k);
      if (v) headers[k] = v;
    }

    try {
      const r = await fetch(target, { method: req.method, headers });
      const ct = r.headers.get("content-type") || "application/json";
      return new Response(await r.text(), {
        status: r.status,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "content-type": ct,
        },
      });
    } catch (e) {
      return new Response("proxy error: " + e.message, { status: 502 });
    }
  },
};
