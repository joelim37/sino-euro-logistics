-- 询价表单第二轮升级
-- 1) 增加附件字段
-- 2) 增加询价邮件通知收件邮箱配置

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS attachment_urls TEXT;

INSERT INTO site_config (key, value, updated_at)
VALUES (
  'inquiry_notice_email',
  '',
  NOW()
)
ON CONFLICT (key)
DO UPDATE SET updated_at = NOW();
