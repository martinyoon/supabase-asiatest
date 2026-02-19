export const APP_CONFIG = {
  supabaseUrl: "https://ncqmnjamwhdrnjuwomnf.supabase.co",
  supabaseAnonKey: "sb_publishable_gtbWlbp0mvWpj_jPyYWs4g_FJrhx9QA"
};

export function validateConfig() {
  const { supabaseUrl, supabaseAnonKey } = APP_CONFIG;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase 설정값이 비어 있습니다. js/config.js를 확인해주세요.");
  }

  if (supabaseUrl.includes("YOUR_") || supabaseAnonKey.includes("YOUR_")) {
    throw new Error("Supabase 설정값이 placeholder 상태입니다. js/config.js를 수정해주세요.");
  }
}
