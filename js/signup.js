import { getSession, signUpWithEmail } from "./api/authApi.js";

const form = document.getElementById("signUpForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signUpBtn = document.getElementById("signUpBtn");
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

  signUpBtn.disabled = true;
  setStatus("회원가입 중...");

  try {
    await signUpWithEmail(email, password);
    setStatus("회원가입 완료. 이메일 인증 후 로그인 페이지에서 로그인하세요.");
  } catch (error) {
    setStatus(`회원가입 실패: ${error.message}`, "err");
  } finally {
    signUpBtn.disabled = false;
  }
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
