// api/sr.js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, retries = 2) {
  let lastErr;

  for (let i = 0; i <= retries; i++) {
    try {
      const resp = await fetch(url, { headers: { accept: "application/json" } });
      if (resp.ok) return resp;

      // 500系は混雑の可能性があるのでリトライ対象にする
      if (resp.status >= 500 && resp.status <= 599 && i < retries) {
        await sleep(500 * (i + 1)); // 0.5s, 1.0s...
        continue;
      }

      return resp; // それ以外はそのまま返す
    } catch (e) {
      lastErr = e;
      if (i < retries) {
        await sleep(500 * (i + 1));
        continue;
      }
    }
  }

  throw lastErr || new Error("fetch failed");
}

export default async function handler(req, res) {
  const uid = req.query.uid;
  const lang = req.query.lang || "jp";

  if (!uid) return res.status(400).json({ error: "uid is required" });

  const url = `https://api.mihomo.me/sr_info_parsed/${encodeURIComponent(uid)}?lang=${encodeURIComponent(lang)}`;

  try {
    const upstream = await fetchWithRetry(url, 2);

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return res.status(upstream.status).json({
        error: "Upstream API error",
        status: upstream.status,
        body: text,
      });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({
      error: "Upstream fetch failed",
      message: e?.message || String(e),
    });
  }
}
