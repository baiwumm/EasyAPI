-- ============================================================
-- EasyAPI 行级安全（RLS）兜底策略
--
-- 作用：即使有人拿到浏览器里公开的 anon key 直接调用
-- Supabase REST API（https://<project>.supabase.co/rest/v1/...），
-- 也无法绕过应用层增删改数据。
--
-- 覆盖范围（全部经 anon key 直接走 PostgREST 的表）：
--   ea_apis / ea_categorys   首页与后台管理
--   ea_postal_code           邮编查询
--   ea_license_plate         车牌归属地查询
--   ea_country_code          国际区号查询
--
-- 使用方法：
--   1. 打开 Supabase Dashboard → SQL Editor
--   2. 粘贴执行（管理员邮箱已与 .env 中 ADMIN_EMAILS 保持一致；
--      如需调整，只需改下方 admin_emails 数组一处）
-- ============================================================

DO $$
DECLARE
  -- 管理员邮箱白名单（与 .env 的 ADMIN_EMAILS 保持一致）
  admin_emails TEXT[] := ARRAY[
    'me@baiwumm.com',
    'baiwumm@foxmail.com',
    '843348394@qq.com'
  ];
  -- 渲染成 'a@x.com','b@y.com' 形式，供 IN (...) 子句拼接
  email_list TEXT;
  tbl TEXT;
  pol RECORD;
BEGIN
  SELECT string_agg(quote_literal(e), ',') INTO email_list
  FROM unnest(admin_emails) AS e;

  FOREACH tbl IN ARRAY ARRAY[
    'ea_apis',
    'ea_categorys',
    'ea_postal_code',
    'ea_license_plate',
    'ea_country_code'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

    -- 清理该表上所有既有策略，避免旧的宽松策略残留放行匿名写
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = tbl
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
    END LOOP;

    -- 公开可读：首页 / 接口列表 / 字典查询都走匿名 anon key，需保持不变
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (true)',
      tbl || '_public_read', tbl
    );

    -- 仅管理员可写：增删改全部被拦截，非管理员一律拒绝
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL'
      || ' USING (auth.jwt() ->> ''email'' IN (' || email_list || '))'
      || ' WITH CHECK (auth.jwt() ->> ''email'' IN (' || email_list || '))',
      tbl || '_admin_write', tbl
    );
  END LOOP;
END $$;

-- ---------- 接口调用计数 ----------
-- increment_call_count 由中间件以匿名调用者身份触发（页面/接口计数），
-- 必须改为函数属主身份执行，否则被上面的 RLS 写策略拦截、计数静默失效；
-- SECURITY DEFINER 必须固定 search_path，防止 search_path 劫持提权
ALTER FUNCTION public.increment_call_count SECURITY DEFINER;
ALTER FUNCTION public.increment_call_count SET search_path = public;
