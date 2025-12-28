// api/external-data.js
export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.mihomo.me/sr_info_parsed/802982999?lang=jp"
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "外部APIエラー",
      });
    }

    const data = await response.json();

    // JSONをそのまま返す（Expressの res.json(jsonData) と同じ）
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({
      error: "外部APIへのリクエストに失敗しました",
    });
  }
}
