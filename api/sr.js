// api/sr.js
export default async function handler(req, res) {
  try {
    // クエリ取得: /api/sr?uid=802982999&lang=jp
    const uid = req.query.uid;
    const lang = req.query.lang || "jp";

    if (!uid) {
      return res.status(400).json({ error: "uid is required. e.g. /api/sr?uid=802982999" });
    }

    // 外部APIへ（サーバー側で）アクセス
    const url = `https://api.mihomo.me/sr_info_parsed/${encodeURIComponent(uid)}?lang=${encodeURIComponent(lang)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      // 外部APIのエラーを分かりやすく返す
      const text = await response.text().catch(() => "");
      return res.status(response.status).json({
        error: "Upstream API error",
        status: response.status,
        body: text.slice(0, 500),
      });
    }

    const data = await response.json();

    // 例: “あなたのスコア計算” も API 側でやるならここでOK
    // (characters[0].relics[0].level + 1) / 16 * 50
    const relicLevel = data?.characters?.[0]?.relics?.[0]?.level;
    const score =
      typeof relicLevel === "number" ? (((relicLevel + 1) / 16) * 50).toFixed(1) : null;

    // フロントへ返す
    return res.status(200).json({
      uid,
      lang,
      score,
      character0: data?.characters?.[0] ?? null,
      raw: data, // 必要なら。重いなら消してOK
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || String(err),
    });
  }
}
