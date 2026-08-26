import { createClient } from "@/lib/supabase/server";

const BUCKET = "project-images";

function extensionOf(fileName: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName);
  return match ? match[1].toLowerCase() : "bin";
}

function pathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}

export const projectImagesRepository = {
  async upload(file: File, projectId: string, kind: "cover" | "screenshot"): Promise<string> {
    const supabase = await createClient();
    const path = `${projectId}/${kind}-${crypto.randomUUID()}.${extensionOf(file.name)}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || undefined,
    });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  async remove(publicUrl: string): Promise<void> {
    const path = pathFromPublicUrl(publicUrl);
    if (!path) return;

    const supabase = await createClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  },
};
