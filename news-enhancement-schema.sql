-- 新闻增强字段
alter table news add column if not exists featured_image_alt text;
alter table news add column if not exists og_image text;

-- 首页新闻显示数量配置（如不存在可插入默认值）
insert into site_config (key, value)
values ('home_news_count', '3')
on conflict (key) do nothing;
