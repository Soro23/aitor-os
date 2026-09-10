/**
 * Sube en bloque las imágenes de los estilos UI al bucket `ui-style-images`.
 *
 * Cada archivo debe llamarse como el slug del estilo (glassmorphism.png,
 * 8-bit-design.webp, ...). Por defecto la imagen se guarda como portada; con
 * --gallery se añade a la galería del estilo en su lugar.
 *
 * Uso:
 *   node --env-file=.env.local scripts/upload-ui-style-images.mjs <carpeta> [opciones]
 *
 * Opciones:
 *   --gallery    Añade a ui_style_images en vez de fijar la portada.
 *   --force      Sobrescribe la portada aunque el estilo ya tenga una.
 *   --dry-run    Enumera lo que haría, sin subir ni escribir nada.
 *
 * Usa la service role key (bypassa RLS): script de administración, nunca
 * importar esto desde la app.
 */
import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "ui-style-images";
const MAX_IMAGES_PER_UI_STYLE = 12;
const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((arg) => arg.startsWith("--")));
const sourceDir = args.find((arg) => !arg.startsWith("--"));

const isGallery = flags.has("--gallery");
const isForce = flags.has("--force");
const isDryRun = flags.has("--dry-run");

if (!sourceDir) {
  console.error("Falta la carpeta de origen.\n");
  console.error("  node --env-file=.env.local scripts/upload-ui-style-images.mjs <carpeta>");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. ¿Has pasado --env-file=.env.local?",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: "public" },
  auth: { autoRefreshToken: false, persistSession: false },
});

async function loadStylesBySlug() {
  const { data, error } = await supabase.from("ui_styles").select("id, slug, cover_image_url");
  if (error) throw error;
  return new Map(data.map((style) => [style.slug, style]));
}

async function uploadFile(filePath, styleId, kind) {
  const extension = extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) throw new Error(`Extensión no soportada: ${extension}`);

  const body = await readFile(filePath);
  const path = `${styleId}/${kind}-${randomUUID()}${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function main() {
  const stylesBySlug = await loadStylesBySlug();
  const files = (await readdir(sourceDir))
    .filter((file) => extname(file).toLowerCase() in CONTENT_TYPES)
    .sort();

  if (files.length === 0) {
    console.error(`No hay imágenes soportadas en ${sourceDir} (png, jpg, webp, avif).`);
    process.exit(1);
  }

  let uploaded = 0;
  let skipped = 0;
  const failures = [];

  for (const file of files) {
    const slug = basename(file, extname(file));
    const style = stylesBySlug.get(slug);

    if (!style) {
      console.warn(`· ${file} — sin estilo con slug "${slug}", se omite`);
      skipped += 1;
      continue;
    }

    if (!isGallery && style.cover_image_url && !isForce) {
      console.log(`· ${slug} — ya tiene portada, se omite (usa --force para sobrescribir)`);
      skipped += 1;
      continue;
    }

    if (isDryRun) {
      console.log(`· ${slug} — ${isGallery ? "se añadiría a la galería" : "sería la portada"}`);
      continue;
    }

    try {
      const imageUrl = await uploadFile(join(sourceDir, file), style.id, isGallery ? "gallery" : "cover");

      if (isGallery) {
        const { count, error: countError } = await supabase
          .from("ui_style_images")
          .select("id", { count: "exact", head: true })
          .eq("ui_style_id", style.id);
        if (countError) throw countError;

        if (count >= MAX_IMAGES_PER_UI_STYLE) {
          throw new Error(`ya tiene ${count} imágenes (máximo ${MAX_IMAGES_PER_UI_STYLE})`);
        }

        const { error } = await supabase
          .from("ui_style_images")
          .insert({ ui_style_id: style.id, image_url: imageUrl, sort_order: count ?? 0 });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ui_styles")
          .update({ cover_image_url: imageUrl })
          .eq("id", style.id);
        if (error) throw error;
      }

      console.log(`✓ ${slug}`);
      uploaded += 1;
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error(`✗ ${slug} — ${detail}`);
      failures.push(slug);
    }
  }

  console.log(
    `\n${isDryRun ? "Simulación" : "Hecho"}: ${uploaded} subidas, ${skipped} omitidas, ${failures.length} con error.`,
  );
  if (failures.length > 0) {
    console.error(`Fallaron: ${failures.join(", ")}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error inesperado:", error instanceof Error ? error.message : error);
  process.exit(1);
});
