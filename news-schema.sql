-- 新闻表
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  featured_image text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_news_slug on news(slug);
create index if not exists idx_news_status on news(status);
create index if not exists idx_news_published_at on news(published_at desc);

alter table news enable row level security;

drop policy if exists "news_public_read" on news;
drop policy if exists "news_auth_all" on news;

create policy "news_public_read"
on news for select to anon
using (status = 'published');

create policy "news_auth_all"
on news for all to authenticated
using (true)
with check (true);
