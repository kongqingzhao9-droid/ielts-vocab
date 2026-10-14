// 云端同步配置（方案三）
// 1. 在 supabase.com 免费注册并新建项目；
// 2. 项目设置 -> API Keys 里复制 Project URL 和 publishable key（或旧的 anon public key），填到下面两处；
// 3. 把 work/supabase_setup.sql 在 Supabase 的 SQL Editor 里跑一遍。
// 注意：publishable / anon 本来就是给浏览器用的公开 key，不是 secret / service_role key。
window.APP_CONFIG = {
  supabaseUrl: "https://ohdmljoknmkpqshmqhus.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZG1sam9rbm1rcHFzaG1xaHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NzA4NDEsImV4cCI6MjEwNzU0Njg0MX0.4Q8uNwdmJprRmWm3cqEyJBSik86DsOiVHTkW2WDboDY",
  table: "vocab_state"
};
