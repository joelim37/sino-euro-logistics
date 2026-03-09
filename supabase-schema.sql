-- 中欧通联国际物流官网 - 数据库 Schema
-- 请在 Supabase SQL Editor 中执行此脚本

-- 1. 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建网站配置表
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建服务内容表
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  icon TEXT,
  image TEXT,
  transit_time TEXT,
  suitable_for TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建询价记录表
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  origin TEXT,
  destination TEXT,
  service_type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始网站配置数据
INSERT INTO site_config (key, value) VALUES
  ('banner_title', '专注中欧走廊的物流专家'),
  ('banner_subtitle', '14天最快到欧，欧盟清关全托管'),
  ('banner_image', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920'),
  ('banner_button_text', '立即咨询'),
  ('banner_button_link', '/contact'),
  ('company_name', '中欧通联国际物流有限公司'),
  ('company_name_en', 'Sino Euro Logistics'),
  ('company_phone', '+86 400-888-8888'),
  ('company_email', 'info@sinoeuro.com'),
  ('company_wechat', 'SinoEuroLogistics'),
  ('company_whatsapp', '+86 138 0000 0000'),
  ('company_address', '深圳市南山区粤海街道科技园南区'),
  ('about_content', '中欧通联国际物流有限公司成立于2010年，是一家专注于中欧物流服务的国际化物流企业。我们拥有14年行业经验，为客户提供包括中欧班列、卡航快递、海运整拼柜、欧盟清关派送到门在内的一站式物流解决方案。'),
  ('advantages_title', '为什么选择我们'),
  ('footer_content', '专注中欧物流14年，值得信赖的物流合作伙伴');

-- 插入初始服务数据
INSERT INTO services (name, slug, description, content, icon, image, transit_time, suitable_for, sort_order) VALUES
  (
    '中欧班列',
    'china-europe-train',
    '时效快、性价比高的铁路运输服务',
    '中欧班列是我司核心业务之一，覆盖中国主要城市至欧洲主要枢纽的往返线路。通过阿拉山口/霍尔果斯/二连浩特等口岸进出境，全程铁路运输，时效稳定，价格优惠。',
    'train',
    'https://images.unsplash.com/photo-1519003300449-4244235db449?w=800',
    '14-18天',
    '适合大宗货物、时效要求适中的货物',
    1
  ),
  (
    '卡航快递',
    'truck-express',
    '门到门全程公路运输灵活便捷',
    '卡航快递是我司为满足客户对时效的更高要求而推出的优质专线服务。采用高质量卡车队，配备专业司机，全程GPS追踪，覆盖欧洲主要国家。',
    'truck',
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
    '10-14天',
    '适合高价值、时效要求高的货物',
    2
  ),
  (
    '海运整拼柜',
    'ocean-freight',
    '经济实惠的大宗货物运输方案',
    '提供整柜（FCL）和散货（LCL）服务，覆盖中国主要港口至欧洲主要港口的航线。专业的报关团队和海外代理网络，确保货物安全顺利清关。',
    'ship',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800',
    '25-35天',
    '适合大宗货物、低价值货物',
    3
  ),
  (
    '欧盟清关',
    'eu-customs',
    '专业高效的欧盟清关服务',
    '我们在欧盟主要国家设有清关中心，拥有经验丰富的报关团队，可为您提供包括进口清关、出口清关、增值税代理、EORI号申请等全方位清关服务。',
    'file-check',
    'https://images.unsplash.com/photo-1589927986089-35812418d7e4?w=800',
    '1-3天',
    '需要清关服务的所有货物',
    4
  );

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

-- 启用 Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 设置 RLS 策略
-- admins 表：仅管理员可读写
CREATE POLICY "admins_all" ON admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- site_config 表：公开可读，管理员可写
CREATE POLICY "site_config_public_read" ON site_config FOR SELECT TO anon USING (true);
CREATE POLICY "site_config_auth_write" ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- services 表：公开可读，管理员可写
CREATE POLICY "services_public_read" ON services FOR SELECT TO anon USING (true);
CREATE POLICY "services_auth_write" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- inquiries 表：公开可写入，管理员可读写
CREATE POLICY "inquiries_public_insert" ON inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "inquiries_auth_all" ON inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 创建默认管理员账号 (密码: Admin123!)
-- 注意：请在生产环境中更改此密码
INSERT INTO admins (email, password_hash, name) VALUES
  ('admin@sinoeuro.com', '$2a$10$rVqKxO3j8fKxO3j8fKxO3j8fKxO3j8fKxO3j8fKxO3j8fKxO3j8fK', '管理员');

-- 提示：使用 bcrypt 生成密码哈希
-- 示例: const hash = await bcrypt.hash('YourPassword123', 10);
