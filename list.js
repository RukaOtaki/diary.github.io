document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("diary-list");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  // ✅ 通知メッセージの表示
  const notice = localStorage.getItem("notice");
  if (notice) {
    const message = document.createElement("div");
    message.className = "notice-message";
    message.textContent =
      notice === "saved" ? "記録完了。選ばれし記憶は封呪の書に刻まれた。" :
      notice === "updated" ? "記憶の構造が再構築された。" :
      notice === "deleted" ? "記憶の断章は葬られ、静かに歴史から消え去った" :
      "";

    document.body.appendChild(message);
    localStorage.removeItem("notice");

    // 数秒後にフェードアウトして削除
    setTimeout(() => {
      message.style.transition = "opacity 0.5s ease";
      message.style.opacity = "0";
      setTimeout(() => message.remove(), 500);
    }, 2000);
  }

  if (list) {
    let logs;
    try {
      logs = JSON.parse(localStorage.getItem("diaryLogs") || "[]");
    } catch (error) {
      console.error("ローカルストレージのdiaryLogsを解析中にエラーが発生しました:", error);
      logs = [];
    }

    const renderLogs = (data) => {
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = '<p class="text-gray-500">「探し求めし記憶は、今はまだこの書には存在しないようだ──」</p>';
        return;
      }

      data.forEach((log) => {
        const entry = document.createElement("div");
        entry.className = "diary-card";

        entry.innerHTML = `
          <div class="text-xs text-gray-500 font-serif">${log.date}</div>
          <h2 class="text-xl font-semibold font-playfair text-[#3e3e3e] mb-2">${log.title}</h2>
          ${log.image ? `<img src="${log.image}" alt="日記画像" class="w-full max-h-48 object-cover mb-3 rounded shadow" />` : ""}
          <p class="text-sm text-gray-800 font-serif mb-3">
            ${log.content.length > 50 ? log.content.slice(0, 50) + "..." : log.content}
          </p>

    <!-- 編集と削除ボタン -->
    <div class="flex gap-3 mt-2 diary-actions">
      <a href="edit.html?id=${log.id}" class="diary-edit-button" aria-label="この日記を編集">
        記憶の再構築
      </a>
      <button onclick="deleteEntry(${log.id})" class="diary-delete-button" aria-label="この日記を削除">
         記憶の消滅
      </button>
    </div>
        `;

        list.appendChild(entry);
      });
    };

    const updateView = () => {
      // searchInput と sortSelect がnullの場合に備えて安全に処理
      const keyword = searchInput ? searchInput.value.toLowerCase() : "";
      const sortOrder = sortSelect ? sortSelect.value : "desc";

      let filtered = logs.filter(
        (log) =>
          log.title.toLowerCase().includes(keyword) ||
          log.content.toLowerCase().includes(keyword)
      );

      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (isNaN(dateA) || isNaN(dateB)) {
          console.warn(`ログの日付形式が不正:`, a.date, b.date);
          return 0;
        }

        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      renderLogs(filtered);
    };

    // 初期表示
    updateView();

    // searchInputが存在する場合に入力イベントを登録
    if (searchInput) {
      searchInput.addEventListener("input", updateView);
    }

    // sortSelectが存在する場合に変更イベントを登録
    if (sortSelect) {
      sortSelect.addEventListener("change", updateView);
    }
  }
});

// ✅ 画像クリックで拡大表示
document.addEventListener("click", (e) => {
  // Diaryカード内の画像がクリックされた場合
  if (e.target.tagName === "IMG" && e.target.closest(".diary-card")) {
    const src = e.target.src;
    if (!src) return; // srcが空の場合は何もしない
    showImageOverlay(src);
  }
});

function showImageOverlay(src) {
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";

  const img = document.createElement("img");
  img.src = src;

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // クリックで閉じる
  overlay.addEventListener("click", () => {
    overlay.remove();
  });
}

// ✅ 削除処理
function deleteEntry(id) {
  const confirmDelete = confirm("記憶の消滅。それは存在の否定── 本当に実行しますか？」");
  if (!confirmDelete) return; // キャンセルの場合処理を中断

  const logs = JSON.parse(localStorage.getItem("diaryLogs") || "[]");
  const updated = logs.filter((log) => log.id !== id);
  localStorage.setItem("diaryLogs", JSON.stringify(updated));
  localStorage.setItem("notice", "deleted");
  location.reload(); // ページを再読み込みして変更を反映
}