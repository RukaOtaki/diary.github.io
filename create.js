document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("diary-form");

  if (!form) return;

  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("image-preview");
  const removeImageBtn = document.getElementById("remove-image-btn");
  let imageRemoved = false; // 削除フラグ

  // プレビューのリセット関数
  function resetPreview() {
    imagePreview.src = "";
    imagePreview.style.display = "none";
    removeImageBtn.style.display = "none";
    imageRemoved = true;
  }

  // ファイル選択時の画像プレビュー
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.src = reader.result;
        imagePreview.style.display = "block";
        removeImageBtn.style.display = "inline-block";
        imageRemoved = false;
      };
      reader.readAsDataURL(file);
    } else {
      resetPreview(); // キャンセルなどでファイルが空になった時
    }
  });

  // 画像削除ボタンの処理
removeImageBtn.addEventListener("click", () => {
  imageInput.value = "";
  resetPreview();
  imageRemoved = true; // ← これを追加
});

  // フォーム送信処理
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = form.date.value;
    const title = form.title.value;
    const content = form.content.value;
    const imageFile = imageInput.files[0];

    if (imageFile && !imageRemoved) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBase64 = reader.result;
        saveDiary({ id: Date.now(), date, title, content, image: imageBase64 });
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveDiary({ id: Date.now(), date, title, content, image: null });
    }
  });

  // 日記データを保存
  function saveDiary(diary) {
    const logs = JSON.parse(localStorage.getItem("diaryLogs") || "[]");
    logs.unshift(diary);
    localStorage.setItem("diaryLogs", JSON.stringify(logs));
    localStorage.setItem("notice", "saved");
    window.location.href = "summary.html";
  }
});
