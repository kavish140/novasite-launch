import { createServer } from "node:http";
import { readFileSync } from "node:fs";

// Loopback-only, read-only review of prepared content. No credentials or remote calls.
const server = createServer((request, response) => {
  if (request.method !== "GET") { response.writeHead(405); response.end("Read-only review"); return; }
  const url = new URL(request.url, "http://127.0.0.1:8790");
  if (url.pathname !== "/") { response.writeHead(404); response.end("Not found"); return; }
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" });
  response.end(readFileSync("content/editorial-20261020-followup/review.html"));
});
server.listen(8790, "127.0.0.1", () => console.log("Editorial review: http://127.0.0.1:8790/"));
