/**
 * ICDirectory — static Publisher-themed site.
 *
 * A thin Worker in front of the static assets so we can force
 * `Cache-Control: no-store` on HTML shells. Without it, Cloudflare's edge
 * caches the HTML and a stale copy keeps serving old markup after a deploy
 * (e.g. holding on to a broken asset reference). Fingerprinted CSS/JS/images
 * keep their own long-lived caching via _headers.
 */
export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);
    let res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      const nf = await env.ASSETS.fetch(new URL("/404.html", url.origin));
      res = new Response(nf.body, { status: 404, headers: nf.headers });
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("text/html")) {
      res = new Response(res.body, res);
      res.headers.set("cache-control", "no-store, must-revalidate");
    }
    return res;
  },
};
