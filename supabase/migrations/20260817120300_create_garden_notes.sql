create table public.garden_notes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category public.garden_note_category not null,
  status public.garden_note_status not null default 'seed',
  content text,
  examples text,
  commands text,
  references_text text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_garden_notes_is_published on public.garden_notes (is_published);
create index idx_garden_notes_category on public.garden_notes (category);
create index idx_garden_notes_slug on public.garden_notes (slug);

create trigger set_garden_notes_updated_at
  before update on public.garden_notes
  for each row
  execute function public.set_updated_at();

alter table public.garden_notes enable row level security;

create policy "garden_notes_select_published"
  on public.garden_notes for select
  to anon, authenticated
  using (is_published = true);

create policy "garden_notes_admin_all"
  on public.garden_notes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Relacion N:N auto-referenciada entre notas ("notas relacionadas").
create table public.garden_note_relations (
  note_id uuid not null references public.garden_notes (id) on delete cascade,
  related_note_id uuid not null references public.garden_notes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (note_id, related_note_id),
  constraint garden_note_relations_no_self_relation check (note_id <> related_note_id)
);

alter table public.garden_note_relations enable row level security;

create policy "garden_note_relations_select_published"
  on public.garden_note_relations for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.garden_notes n
      where n.id = garden_note_relations.note_id and n.is_published = true
    )
    and exists (
      select 1 from public.garden_notes n
      where n.id = garden_note_relations.related_note_id and n.is_published = true
    )
  );

create policy "garden_note_relations_admin_all"
  on public.garden_note_relations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
