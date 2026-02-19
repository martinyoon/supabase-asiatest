import { getSession, onAuthStateChange, signInWithEmail, signOut, signUpWithEmail } from "./api/authApi.js";
import { createPost, fetchPosts, removePostById, updatePostById } from "./api/postsApi.js";
import { renderAuthStatus, renderPosts, setStatus, toggleEditorAccess } from "./ui/postsView.js";

const form = document.getElementById("postForm");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const submitBtn = document.getElementById("submitBtn");
const refreshBtn = document.getElementById("refreshBtn");
const status = document.getElementById("status");
const postsEl = document.getElementById("posts");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const authState = document.getElementById("authState");

let currentSession = null;
let postsState = [];
let editingPostId = null;
let editingDraft = { title: "", content: "" };

function getPostFormValue() {
  return {
    title: titleInput.value.trim(),
    content: contentInput.value.trim()
  };
}

function getAuthFormValue() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
  };
}

function validatePostInput(post) {
  if (!post.title || !post.content) {
    throw new Error("제목, 내용을 모두 입력해주세요.");
  }
}

function validateAuthInput(auth) {
  if (!auth.email || !auth.password) {
    throw new Error("이메일/비밀번호를 모두 입력해주세요.");
  }
}

function clearEditingState() {
  editingPostId = null;
  editingDraft = { title: "", content: "" };
}

function getVisiblePosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const sortBy = sortSelect.value;

  let visible = [...postsState];

  if (keyword) {
    visible = visible.filter((post) => {
      const bag = `${post.title} ${post.content} ${post.author}`.toLowerCase();
      return bag.includes(keyword);
    });
  }

  visible.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sortBy === "oldest" ? timeA - timeB : timeB - timeA;
  });

  return visible;
}

function renderPostsWithState() {
  const visiblePosts = getVisiblePosts();

  renderPosts(postsEl, visiblePosts, {
    currentUserId: currentSession?.user?.id ?? null,
    editingPostId,
    editingDraft
  });

  const keyword = searchInput.value.trim();
  if (keyword) {
    setStatus(status, `게시글 ${visiblePosts.length}건 (검색: "${keyword}")`);
    return;
  }

  setStatus(status, `게시글 ${visiblePosts.length}건`);
}

function applySessionState(session) {
  currentSession = session;
  renderAuthStatus(authState, session);
  toggleEditorAccess({ form, submitBtn, session });
  signOutBtn.disabled = !session;
  signInBtn.disabled = Boolean(session);
  signUpBtn.disabled = Boolean(session);

  if (!session) {
    clearEditingState();
  }
}

async function loadPosts() {
  try {
    postsState = await fetchPosts();
    renderPostsWithState();
  } catch (error) {
    setStatus(status, `목록 조회 실패: ${error.message}`, "err");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentSession) {
    setStatus(status, "로그인 후 글 등록이 가능합니다.", "err");
    return;
  }

  const post = getPostFormValue();

  try {
    validatePostInput(post);
  } catch (error) {
    setStatus(status, error.message, "err");
    return;
  }

  submitBtn.disabled = true;
  setStatus(status, "등록 중...");

  try {
    await createPost(post);
    form.reset();
    setStatus(status, "글이 등록되었습니다.");
    await loadPosts();
  } catch (error) {
    setStatus(status, `등록 실패: ${error.message}`, "err");
  } finally {
    submitBtn.disabled = false;
  }
});

refreshBtn.addEventListener("click", async () => {
  clearEditingState();
  setStatus(status, "목록 새로고침 중...");
  await loadPosts();
});

searchInput.addEventListener("input", () => {
  if (editingPostId !== null) {
    clearEditingState();
  }
  renderPostsWithState();
});

sortSelect.addEventListener("change", () => {
  if (editingPostId !== null) {
    clearEditingState();
  }
  renderPostsWithState();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "latest";
  if (editingPostId !== null) {
    clearEditingState();
  }
  renderPostsWithState();
});

postsEl.addEventListener("click", async (e) => {
  const target = e.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = Number(target.dataset.id);
  if (!id) {
    return;
  }

  if (!currentSession) {
    setStatus(status, "로그인 후 사용 가능합니다.", "err");
    return;
  }

  if (target.classList.contains("deleteBtn")) {
    const shouldDelete = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    target.disabled = true;
    setStatus(status, "삭제 중...");

    try {
      await removePostById(id);
      setStatus(status, "삭제되었습니다.");
      await loadPosts();
    } catch (error) {
      setStatus(status, `삭제 실패: ${error.message}`, "err");
      target.disabled = false;
    }

    return;
  }

  if (target.classList.contains("editBtn")) {
    const targetPost = postsState.find((post) => post.id === id);
    if (!targetPost) {
      setStatus(status, "대상 게시글을 찾을 수 없습니다.", "err");
      return;
    }

    editingPostId = id;
    editingDraft = { title: targetPost.title, content: targetPost.content };
    renderPostsWithState();
    return;
  }

  if (target.classList.contains("cancelEditBtn")) {
    clearEditingState();
    renderPostsWithState();
    setStatus(status, "수정을 취소했습니다.");
    return;
  }

  if (target.classList.contains("saveEditBtn")) {
    const titleEl = postsEl.querySelector(`.inlineTitleInput[data-id="${id}"]`);
    const contentEl = postsEl.querySelector(`.inlineContentInput[data-id="${id}"]`);

    if (!(titleEl instanceof HTMLInputElement) || !(contentEl instanceof HTMLTextAreaElement)) {
      setStatus(status, "수정 입력창을 찾을 수 없습니다.", "err");
      return;
    }

    const title = titleEl.value.trim();
    const content = contentEl.value.trim();

    if (!title || !content) {
      setStatus(status, "제목/내용은 비워둘 수 없습니다.", "err");
      return;
    }

    target.disabled = true;
    setStatus(status, "수정 중...");

    try {
      await updatePostById(id, { title, content });
      clearEditingState();
      setStatus(status, "수정되었습니다.");
      await loadPosts();
    } catch (error) {
      setStatus(status, `수정 실패: ${error.message}`, "err");
      target.disabled = false;
    }
  }
});

signUpBtn.addEventListener("click", async () => {
  const auth = getAuthFormValue();

  try {
    validateAuthInput(auth);
  } catch (error) {
    setStatus(status, error.message, "err");
    return;
  }

  signUpBtn.disabled = true;
  setStatus(status, "회원가입 중...");

  try {
    await signUpWithEmail(auth.email, auth.password);
    setStatus(status, "회원가입 요청 완료. 이메일 인증 후 로그인하세요.");
  } catch (error) {
    setStatus(status, `회원가입 실패: ${error.message}`, "err");
  } finally {
    signUpBtn.disabled = false;
  }
});

signInBtn.addEventListener("click", async () => {
  const auth = getAuthFormValue();

  try {
    validateAuthInput(auth);
  } catch (error) {
    setStatus(status, error.message, "err");
    return;
  }

  signInBtn.disabled = true;
  setStatus(status, "로그인 중...");

  try {
    await signInWithEmail(auth.email, auth.password);
    setStatus(status, "로그인 성공");
  } catch (error) {
    setStatus(status, `로그인 실패: ${error.message}`, "err");
  } finally {
    signInBtn.disabled = false;
  }
});

signOutBtn.addEventListener("click", async () => {
  signOutBtn.disabled = true;
  setStatus(status, "로그아웃 중...");

  try {
    await signOut();
    setStatus(status, "로그아웃 완료");
  } catch (error) {
    setStatus(status, `로그아웃 실패: ${error.message}`, "err");
    signOutBtn.disabled = false;
  }
});

const { data: authListener } = onAuthStateChange(async (session) => {
  applySessionState(session);
  await loadPosts();
});

window.addEventListener("beforeunload", () => {
  authListener.subscription.unsubscribe();
});

async function bootstrap() {
  try {
    const session = await getSession();
    applySessionState(session);
  } catch (error) {
    setStatus(status, `세션 확인 실패: ${error.message}`, "err");
  }

  await loadPosts();
}

bootstrap();
