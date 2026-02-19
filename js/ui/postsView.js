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

export function renderAuthStatus(authStateEl, session) {
  if (!session) {
    authStateEl.textContent = "로그인 안됨";
    return;
  }

  authStateEl.textContent = `로그인: ${session.user.email}`;
}

export function toggleEditorAccess({ form, submitBtn, session }) {
  const disabled = !session;

  Array.from(form.elements).forEach((el) => {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) {
      if (el.id === "refreshBtn") {
        return;
      }

      if (el.id === "submitBtn") {
        el.disabled = disabled;
        return;
      }

      el.disabled = disabled;
    }
  });

  submitBtn.disabled = disabled;
}

export function renderPosts(postsEl, posts, options = {}) {
  const { currentUserId = null, editingPostId = null, editingDraft = { title: "", content: "" } } = options;

  if (!posts.length) {
    postsEl.innerHTML = '<div class="empty">아직 등록된 게시글이 없습니다.</div>';
    return;
  }

  postsEl.innerHTML = posts
    .map((post) => {
      const isOwner = Boolean(currentUserId) && post.user_id === currentUserId;
      const isEditing = isOwner && editingPostId === post.id;

      let ownerActions = "";
      let contentHtml = `<div class="post-content">${escapeHtml(post.content)}</div>`;

      if (isOwner && !isEditing) {
        ownerActions =
          `<div class="post-actions">` +
          `<button class="editBtn" data-id="${post.id}" type="button">수정</button>` +
          `<button class="deleteBtn" data-id="${post.id}" type="button">삭제</button>` +
          `</div>`;
      }

      if (isEditing) {
        ownerActions =
          `<div class="post-actions">` +
          `<button class="saveEditBtn" data-id="${post.id}" type="button">저장</button>` +
          `<button class="cancelEditBtn" data-id="${post.id}" type="button">취소</button>` +
          `</div>`;

        contentHtml = `
          <div class="inline-edit">
            <input class="inlineTitleInput" data-id="${post.id}" type="text" maxlength="120" value="${escapeHtml(editingDraft.title)}" />
            <textarea class="inlineContentInput" data-id="${post.id}" maxlength="2000">${escapeHtml(editingDraft.content)}</textarea>
          </div>
        `;
      }

      return `
      <article class="post" data-id="${post.id}">
        <div class="post-head">
          <h3 class="post-title">${escapeHtml(post.title)}</h3>
          ${ownerActions}
        </div>
        <div class="post-info">작성자: ${escapeHtml(post.author)} | 등록일: ${formatDate(post.created_at)}</div>
        ${contentHtml}
      </article>
      `;
    })
    .join("");
}
