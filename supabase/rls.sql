-- ============================================================
-- EasyAPI 行级安全（RLS）兜底策略
--
-- 作用：即使有人拿到浏览器里公开的 publishable key 直接调用
-- Supabase REST API（https://<project>.supabase.co/rest/v1/...），
-- 也无法绕过应用层增删改数据。
--
-- 权限模型：注册已在 Supabase Dashboard 关闭（Allow new users to
-- sign up），账号仅通过 Dashboard → Authentication → Add user 添加，
-- 因此「存在于 auth.users 且已登录」即受信任，写策略直接放行
-- authenticated 角色（与 better-nav 同模型）。
--
-- 使用方法：
--   1. 打开 Supabase Dashboard → SQL Editor（或 psql "$DATABASE_URL"）
--   2. 粘贴执行（2026-11 已在线上库执行过本文件）
-- ============================================================

-- ---------- 1. ea_apis 表 ----------
ALTER TABLE public.ea_apis ENABLE ROW LEVEL SECURITY;

-- 清理该表上所有既有策略，避免旧的宽松策略残留放行匿名写
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ea_apis'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 公开可读（首页 / 接口列表需要对外展示，保持不变）
DROP POLICY IF EXISTS "ea_apis_public_read" ON public.ea_apis;
CREATE POLICY "ea_apis_public_read"
  ON public.ea_apis FOR SELECT
  USING (true);

-- 仅已登录用户可写（注册已关闭，账号都由 Dashboard 添加，登录即受信任）
DROP POLICY IF EXISTS "ea_apis_authenticated_write" ON public.ea_apis;
CREATE POLICY "ea_apis_authenticated_write"
  ON public.ea_apis FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------- 2. ea_categorys 表 ----------
ALTER TABLE public.ea_categorys ENABLE ROW LEVEL SECURITY;

-- 清理该表上所有既有策略，避免旧的宽松策略残留放行匿名写
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ea_categorys'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 公开可读
DROP POLICY IF EXISTS "ea_categorys_public_read" ON public.ea_categorys;
CREATE POLICY "ea_categorys_public_read"
  ON public.ea_categorys FOR SELECT
  USING (true);

-- 仅已登录用户可写
DROP POLICY IF EXISTS "ea_categorys_authenticated_write" ON public.ea_categorys;
CREATE POLICY "ea_categorys_authenticated_write"
  ON public.ea_categorys FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ---------- 3. 接口调用计数 ----------
-- increment_call_count_by_path 由中间件以匿名调用者身份触发（页面/接口计数），
-- 必须改为函数属主身份执行，否则被上面的 RLS 写策略拦截、计数静默失效；
-- SECURITY DEFINER 必须固定 search_path，防止 search_path 劫持提权
ALTER FUNCTION public.increment_call_count SECURITY DEFINER;
ALTER FUNCTION public.increment_call_count SET search_path = public;
ALTER FUNCTION public.increment_call_count_by_path SECURITY DEFINER;
ALTER FUNCTION public.increment_call_count_by_path SET search_path = public;
