-- ============================================================
-- EasyAPI 行级安全（RLS）兜底策略
--
-- 作用：即使有人拿到浏览器里公开的 anon key 直接调用
-- Supabase REST API（https://<project>.supabase.co/rest/v1/...），
-- 也无法绕过应用层增删改数据。
--
-- 使用方法：
--   1. 打开 Supabase Dashboard → SQL Editor
--   2. 粘贴执行（管理员邮箱已与 .env 中 ADMIN_EMAILS 保持一致；
--      如需调整，请同步修改下方两处邮箱白名单列表）
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

-- 仅管理员可写（增删改全部被拦截，非管理员一律拒绝）
DROP POLICY IF EXISTS "ea_apis_admin_write" ON public.ea_apis;
CREATE POLICY "ea_apis_admin_write"
  ON public.ea_apis FOR ALL
  USING (auth.jwt() ->> 'email' IN ('me@baiwumm.com', 'baiwumm@foxmail.com', '843348394@qq.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('me@baiwumm.com', 'baiwumm@foxmail.com', '843348394@qq.com'));

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

-- 仅管理员可写
DROP POLICY IF EXISTS "ea_categorys_admin_write" ON public.ea_categorys;
CREATE POLICY "ea_categorys_admin_write"
  ON public.ea_categorys FOR ALL
  USING (auth.jwt() ->> 'email' IN ('me@baiwumm.com', 'baiwumm@foxmail.com', '843348394@qq.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('me@baiwumm.com', 'baiwumm@foxmail.com', '843348394@qq.com'));

-- ---------- 3. 补充说明 ----------
-- 若执行 RLS 后发现接口调用计数（call_count）不再增长，
-- 说明 increment_call_count 函数以调用者身份执行被 RLS 拦截，
-- 在 SQL Editor 中执行下面这条语句改为以函数属主身份执行：
--   ALTER FUNCTION public.increment_call_count SECURITY DEFINER;
