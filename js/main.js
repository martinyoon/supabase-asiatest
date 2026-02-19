import { createPost, fetchPosts, removePostById } from "./api/postsApi.js";
import { renderPosts, setStatus } from "./ui/postsView.js";

const form = document.getElementById("postForm");
const authorInput = document.getElementById("authorInput");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const submitBtn = document.getElementById("submitBtn");
const refreshBtn = document.getElementById("refreshBtn");
const status = document.getElementById("status");
const postsEl = document.getElementById("posts");

function getPostFormValue() {
  return {
    author: authorInput.value.trim(),
    title: titleInput.value.trim(),
    content: contentInput.value.trim()
  };
}

function validatePostInput(post) {
  if (!post.author || !post.title || !post.content) {
    throw new Error("작성자, 제목, 내용을 모두 입력해주세요.");
  }
}

async function loadPosts() {
  try {
    const posts = await fetchPosts();
    renderPosts(postsEl, posts);
    setStatus(status, `게시글 ${posts.length}건`);
  } catch (error) {
    setStatus(status, `목록 조회 실패: ${error.message}`, "err");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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
  setStatus(status, "목록 새로고침 중...");
  await loadPosts();
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
});

loadPosts();
