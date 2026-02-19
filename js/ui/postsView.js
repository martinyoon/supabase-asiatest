const COLORS = {
  ok: "#9cb0d0",
  err: "#f87171"
};

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function setStatus(statusEl, message, type = "ok") {
  statusEl.textContent = message;
  statusEl.style.color = type === "err" ? COLORS.err : COLORS.ok;
}

export function renderPosts(postsEl, posts) {
  if (!posts.length) {
    postsEl.innerHTML = '<div class="empty">아직 등록된 게시글이 없습니다.</div>';
    return;
  }

  postsEl.innerHTML = posts
    .map(
      (post) => `
      <article class="post">
        <div class="post-head">
          <h3 class="post-title">${escapeHtml(post.title)}</h3>
          <button class="deleteBtn" data-id="${post.id}" type="button">삭제</button>
        </div>
        <div class="post-info">작성자: ${escapeHtml(post.author)} | 등록일: ${formatDate(post.created_at)}</div>
        <div class="post-content">${escapeHtml(post.content)}</div>
      </article>
    `
    )
    .join("");
}
