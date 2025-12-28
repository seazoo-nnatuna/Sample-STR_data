const btn = document.getElementById("sync-btn");
const input = document.getElementById("uid-input");
const result = document.getElementById("result-area");

btn.addEventListener("click", async () => {
  const uid = input.value.trim();

  if (!uid) {
    result.textContent = "UIDを入力してください";
    return;
  }

  result.textContent = "取得中...";

  try {
    // ★ APIからJSONを取得
    const res = await fetch(`/api/sr?uid=${encodeURIComponent(uid)}&lang=jp`);
    const json = await res.json();

    // ★ HTMLに表示
    result.textContent = JSON.stringify(json, null, 2);

  } catch (e) {
    result.textContent = "エラーが発生しました";
    console.error(e);
  }
});
