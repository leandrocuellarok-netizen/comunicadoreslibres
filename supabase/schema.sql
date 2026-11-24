-- Comunicadores Libres: central editorial database
-- Run this entire script in Supabase SQL Editor.

create table if not exists public.articles (
  id text primary key,
  title text not null,
  category text not null,
  author text not null default 'Redacción',
  date date not null default current_date,
  excerpt text not null default '',
  body text not null default '',
  published boolean not null default false,
  featured boolean not null default false,
  image text,
  "imageAlt" text,
  "imageCredit" text,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

drop policy if exists "Authenticated editors can insert articles" on public.articles;
create policy "Authenticated editors can insert articles"
on public.articles for insert
to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated editors can update articles" on public.articles;
create policy "Authenticated editors can update articles"
on public.articles for update
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated editors can delete articles" on public.articles;
create policy "Authenticated editors can delete articles"
on public.articles for delete
to authenticated
using (auth.role() = 'authenticated');

-- Public image bucket. Only authenticated editors may upload, replace or delete files.
insert into storage.buckets (id, name, public)
values ('cl-article-images', 'cl-article-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view article images" on storage.objects;
create policy "Public can view article images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'cl-article-images');

drop policy if exists "Authenticated editors can upload article images" on storage.objects;
create policy "Authenticated editors can upload article images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cl-article-images');

drop policy if exists "Authenticated editors can update article images" on storage.objects;
create policy "Authenticated editors can update article images"
on storage.objects for update
to authenticated
using (bucket_id = 'cl-article-images')
with check (bucket_id = 'cl-article-images');

drop policy if exists "Authenticated editors can delete article images" on storage.objects;
create policy "Authenticated editors can delete article images"
on storage.objects for delete
to authenticated
using (bucket_id = 'cl-article-images');
