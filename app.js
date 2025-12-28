// app.js
const btn = document.getElementById("fetch-btn");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {
  result.textContent = "取得中...";

  try {
    const res = await fetch("/api/external-data");
    const json = await res.json();

    // Express で返していた JSON と同じものが入る
    result.textContent = JSON.stringify(json, null, 2);

  } catch (e) {
    result.textContent = "エラーが発生しました";
    console.error(e);
  }
});
