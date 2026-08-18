-- Vocabularios fijos definidos por el concepto del sitio (project-concept.md).
create type public.project_status as enum (
  'idea',
  'en_desarrollo',
  'beta',
  'finalizado',
  'paused'
);

create type public.garden_note_status as enum (
  'seed',
  'growing',
  'evergreen'
);

create type public.garden_note_category as enum (
  'sistemas',
  'desarrollo',
  'ia',
  'ideas'
);

create type public.resource_type as enum (
  'herramienta',
  'libreria',
  'curso',
  'libro',
  'repo',
  'doc',
  'prompt',
  'snippet'
);

-- No fijado explicitamente en project-concept.md (solo el ejemplo "Status:
-- Experiment") — vocabulario razonable derivado de ese ejemplo.
create type public.lab_experiment_status as enum (
  'experiment',
  'working',
  'archived'
);

-- now_items: "Trabajando en / Aprendiendo / Explorando" (project-concept.md).
create type public.now_item_category as enum (
  'building',
  'learning',
  'exploring'
);

-- stack_items: categorias y niveles de uso (project-concept.md).
create type public.stack_category as enum (
  'desarrollo',
  'sistemas',
  'infraestructura',
  'ia'
);

create type public.stack_usage_level as enum (
  'daily',
  'frequent',
  'learning',
  'exploring'
);
