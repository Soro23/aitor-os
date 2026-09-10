-- Permite marcar un lead como spam desde el selector de fase del pipeline,
-- reutilizando el mismo enum en vez de crear un campo is_spam separado:
-- "spam" es una fase terminal mas, igual que "perdido".
alter type public.lead_pipeline_status add value 'spam';
