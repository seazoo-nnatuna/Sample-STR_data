export default async function handler(req, res) {
  const url = "https://api.mihomo.me/sr_info_parsed/802982999?lang=jp";

  try {
    const upstream = await fetch(url, {
      headers: {
        accept: "application/json",
        // ブラウザっぽいヘッダを付ける（効く場合がある）
        "user-agent": "Mozilla/5.0 (compatible; MyVercelFunction/1.0)",
        "accept-language": "ja,en;q=0.8",
      },
    });

    const text = await upstream.text(); // 先に文字列で読む（JSONでもHTMLでも対応できる）

    // 外部APIが失敗していたら、ステータスと本文をそのまま返す
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "外部APIエラー",
        upstreamStatus: upstream.status,
        upstreamBody: text,
        url,
      });
    }

    // 成功時だけJSONにパース
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "外部APIの返却がJSONではありません",
        upstreamBody: text.slice(0, 500),
        url,
      });
    }

    // キャッシュ（叩く回数を減らす）
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      error: "外部APIへのリクエストに失敗しました",
      message: e?.message || String(e),
      url,
    });
  }
}
