document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("diary-form");

  if (editForm) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const logs = JSON.parse(localStorage.getItem("diaryLogs") || "[]");
    const target = logs.find((log) => log.id === id);

    if (!target) {
      alert("この世界に、その記憶は存在していないようだ");
      window.location.href = "index.html";
      return;
    }

    // 入力フォームに既存データをセット
    editForm.date.value = target.date;
    editForm.title.value = target.title;
    editForm.content.value = target.content;

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");
const removeImageBtn = document.getElementById("remove-image-btn");

// 画像があれば表示
if (target.image) {
  imagePreview.src = target.image;
  imagePreview.style.display = "block";
  removeImageBtn.style.display = "inline-block";
}

// 画像選択でプレビュー表示
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.style.display = "block";
      removeImageBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }
});

let imageRemoved = false

// 削除ボタン処理
removeImageBtn.addEventListener("click", () => {
  imagePreview.src = "";
  imagePreview.style.display = "none";
  removeImageBtn.style.display = "none";
  imageRemoved = true; // ← 削除されたことを明示する
});


    // submit 処理
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 値の更新
      target.date = editForm.date.value;
      target.title = editForm.title.value;
      target.content = editForm.content.value;

      const file = imageInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          target.image = reader.result; // Base64で保存
          saveAndRedirect();
        };
        reader.readAsDataURL(file);
      } else if (imageRemoved) {
    target.image = ""; // ← 削除されているなら画像を空にする
    saveAndRedirect();
  } else {
    saveAndRedirect(); // 画像変更なしで保存
  }

      function saveAndRedirect() {
        const updatedLogs = logs.map((log) => (log.id === id ? target : log));
        localStorage.setItem("diaryLogs", JSON.stringify(updatedLogs));
        localStorage.setItem("notice", "updated"); // 通知表示用
        window.location.href = "summary.html";
      }
    });
  }
});
