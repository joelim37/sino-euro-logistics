-- 在线询价表单字段升级
-- 执行位置：Supabase SQL Editor

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS cargo_name TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS hs_code TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS package_type TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS dimensions TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS transport_mode TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS delivery_mode TEXT;

INSERT INTO site_config (key, value, updated_at)
VALUES (
  'inquiry_transport_options',
  '中欧班列
卡航快递
海运整拼柜
派送到门
项目货物运输
欧盟清关
其他',
  NOW()
)
ON CONFLICT (key)
DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
