// Minimal static server for Railway (no dependencies).
// Clean URLs: /mehndi -> mehndi.html, /barat -> barat.html
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
};
const PUBLIC = new Set(["index.html", "mehndi.html", "barat.html"]);
const PUBLIC_DIRS = ["css", "js", "assets"];

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/index.html";
  if (!path.extname(p)) p += ".html";
  const rel = path.normalize(p).replace(/^[/\\]+/, "");
  const top = rel.split(/[/\\]/)[0];
  if (!PUBLIC.has(rel) && !PUBLIC_DIRS.includes(top)) return null;
  return path.join(ROOT, rel);
}

http
  .createServer((req, res) => {
    if (req.url === "/health") { res.writeHead(200); return res.end("ok"); }
    const file = resolve(req.url);
    if (!file) { res.writeHead(404); return res.end("Not found"); }
    fs.stat(file, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404); return res.end("Not found"); }
      const ext = path.extname(file).toLowerCase();
      res.writeHead(200, {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Content-Length": st.size,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
      });
      if (req.method === "HEAD") return res.end();
      fs.createReadStream(file).pipe(res);
    });
  })
  .listen(PORT, () => console.log(`Invitation site running on port ${PORT}`));
