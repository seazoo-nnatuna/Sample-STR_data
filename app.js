const result = document.getElementById("result");
result.textContent = "取得中...";

(async () => {
  try {
    const res = await fetch("https://api.mihomo.me/sr_info_parsed/802982999?lang=jp");
    const text = await res.text();
    result.textContent = text.slice(0, 500); // まずは生テキスト確認
  } catch (e) {
    result.textContent = "失敗: " + e.message;
  }
})();
