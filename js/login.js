import { getSession, onAuthStateChange, signInWithEmail } from "./api/authApi.js";

const form = document.getElementById("signInForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInBtn = document.getElementById("signInBtn");
const status = document.getElementById("status");

function redirectToBoard() {
  window.location.href = "./index.html";
}

function setStatus(message, type = "ok") {
  status.textContent = message;
  status.className = type === "err" ? "err" : "";
}

function getFormValue() {
  return {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
  };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { email, password } = getFormValue();
  if (!email || !password) {
    setStatus("이메일/비밀번호를 입력해주세요.", "err");
    return;
  }

  signInBtn.disabled = true;
  setStatus("로그인 중...");

  try {
    await signInWithEmail(email, password);
    setStatus("로그인 성공");
    redirectToBoard();
  } catch (error) {
    setStatus(`로그인 실패: ${error.message}`, "err");
  } finally {
    signInBtn.disabled = false;
  }
});

const { data: authListener } = onAuthStateChange((session) => {
  if (session) {
    redirectToBoard();
  }
});

window.addEventListener("beforeunload", () => {
  authListener.subscription.unsubscribe();
});

(async () => {
  try {
    const session = await getSession();
    if (session) {
      redirectToBoard();
    }
  } catch (error) {
    setStatus(`세션 확인 실패: ${error.message}`, "err");
  }
})();
