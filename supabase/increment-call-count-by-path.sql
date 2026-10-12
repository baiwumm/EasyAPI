-- increment_call_count_by_path：接口调用计数（F1/C5 整改，2026-10）
--
-- 相对旧 increment_call_count(row_id, inc) 的变化：
-- - 增量固定 +1（旧函数由中间件传随机 1~10，不是真实调用量）
-- - 按 path 直接 update（旧流程每个 /api GET 先查一次 ea_apis 拿 id 再计数，
--   两轮 DB 往返；本函数对未收录 path 天然 no-op，单轮往返）
--
-- 中间件以匿名调用者身份触发，必须 SECURITY DEFINER 绕过 RLS 写策略
-- （旧函数 prosecdef=true 已人工确认，本函数保持同款安全姿态），
-- 并固定 search_path，防止 search_path 劫持提权。
--
-- 上线顺序：先在 Supabase Dashboard SQL Editor 执行本文件，再部署配套代码
-- （src/proxy.ts 的中间件已同步改调本函数，函数不存在时仅计数报错、不影响接口响应）。
create or replace function public.increment_call_count_by_path(p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
  update public.ea_apis
  set call_count = call_count + 1,
      last_called = now()
  where path = p_path;
$$;

-- 旧函数确认不再被调用后可在 Dashboard 手动删除
-- （参数签名以 pg_proc 实际定义为准）：
-- drop function public.increment_call_count;
