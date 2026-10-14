// 生词本云端同步层：把星级 / 已背 / 删除状态存到 Supabase。
// 未配置 config.js 或网络不可用时，自动退回到 localStorage，不影响本机使用。
(function () {
  var client = null;
  var table = "vocab_state";

  async function init() {
    var cfg = window.APP_CONFIG || {};
    table = cfg.table || table;
    var url = (cfg.supabaseUrl || "").trim();
    var key = (cfg.supabaseAnonKey || "").trim();
    var notConfigured = !url || !key || url.indexOf("YOUR-PROJECT") >= 0 || key.indexOf("YOUR-ANON") >= 0;
    if (notConfigured) return false;
    if (window.supabase && window.supabase.createClient) {
      client = window.supabase.createClient(url, key);
    }
    return !!client;
  }

  // 返回 { word: {stars, archived, deleted, updated_at} }；失败返回 null
  async function fetchAll() {
    if (!client) return null;
    try {
      var res = await client.from(table).select("word,stars,archived,deleted,updated_at");
      if (res.error) { console.warn("[sync] fetch error", res.error.message); return null; }
      var map = {};
      (res.data || []).forEach(function (r) { map[r.word] = r; });
      return map;
    } catch (e) {
      console.warn("[sync] fetch failed", e);
      return null;
    }
  }

  function push(word, stars, archived, deleted, ts) {
    if (!client) return Promise.resolve();
    return client.from(table)
      .upsert(
        { word: word, stars: stars, archived: archived, deleted: deleted, updated_at: new Date(ts).toISOString() },
        { onConflict: "word" }
      )
      .then(function (res) {
        if (res.error) console.warn("[sync] push error", res.error.message);
      });
  }

  window.VocabSync = { init: init, fetchAll: fetchAll, push: push };
})();
