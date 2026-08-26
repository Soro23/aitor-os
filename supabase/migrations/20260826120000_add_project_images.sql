-- Imagen principal de un proyecto.
alter table public.projects add column cover_image_url text;

-- Bucket publico para imagenes de proyectos (imagen principal + capturas de
-- pantalla). Publico en lectura: las rutas usan UUID no adivinable, y las
-- capturas ya se sirven como <img src> directo. Escritura solo admin.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "project_images_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-images');

create policy "project_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "project_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

create policy "project_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
