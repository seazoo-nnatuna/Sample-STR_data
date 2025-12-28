const btn = document.getElementById("fetch-btn");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {
  result.textContent = "取得中...";

  try {
    const res = await fetch("/api/external-data");
    const json = await res.json();

    result.textContent = JSON.stringify(json, null, 2);
  } catch (e) {
    result.textContent = `表示エラー: ${e.message}`;
    console.error(e);
  }
});
