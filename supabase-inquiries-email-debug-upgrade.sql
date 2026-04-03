-- 询价邮件通知配置补充
-- 新增可配置发件邮箱（如已在 Resend 验证域名，可填写 noreply@yourdomain.com）

INSERT INTO site_config (key, value, updated_at)
VALUES (
  'inquiry_notice_from_email',
  'onboarding@resend.dev',
  NOW()
)
ON CONFLICT (key)
DO UPDATE SET updated_at = NOW();
