import Link from "next/link";
import Image from "next/image";
import { ClipCard } from "@/components/ui/ClipCard/ClipCard";
import { uiStylesRepository } from "@/server/repositories/ui-styles.repository";
import { UI_STYLE_CATEGORY_VALUES } from "@/lib/validation/ui-style.schema";
import { uiStyleCategoryLabel, uiStyleCategoryDescription } from "@/lib/ui-style-labels";
import { SectionIntro } from "../../_components/SectionIntro";
import { EmptyNotice } from "../../_components/EmptyNotice";
import styles from "./page.module.css";

const INTRO_DESCRIPTION =
  "Catálogo de estilos visuales de interfaz agrupados por familia: qué define a cada uno, cómo se ve y cuándo tiene sentido usarlo. Lo mantengo como referencia propia a la hora de decidir la dirección visual de un proyecto.";

export default async function UiStylesPage() {
  const uiStyles = await uiStylesRepository.findPublished();

  const intro = (
    <SectionIntro
      eyebrow="Garden · Estilos UI"
      title="Estilos UI"
      description={INTRO_DESCRIPTION}
      accent="violet"
      meta={uiStyles.length > 0 ? `${uiStyles.length} estilos` : undefined}
    />
  );

  if (uiStyles.length === 0) {
    return (
      <>
        {intro}
        <EmptyNotice message="Todavía no hay estilos publicados." accent="violet" />
      </>
    );
  }

  return (
    <>
      {intro}
      <div className={styles.stack}>
        {UI_STYLE_CATEGORY_VALUES.map((category) => {
          const stylesInCategory = uiStyles.filter((style) => style.category === category);
          if (stylesInCategory.length === 0) return null;

          return (
            <section key={category} className={styles.section}>
              <h2 className={styles.categoryTitle}>{uiStyleCategoryLabel(category)}</h2>
              <p className={styles.categoryDescription}>{uiStyleCategoryDescription(category)}</p>
              <div className={styles.grid}>
                {stylesInCategory.map((style) => (
                  <Link
                    key={style.id}
                    href={`/garden/estilos-ui/${style.slug}`}
                    className={styles.cardLink}
                  >
                    <ClipCard title={style.name} accent="violet">
                      {style.coverImageUrl ? (
                        <div className={styles.coverWrap}>
                          <Image
                            src={style.coverImageUrl}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : null}
                      {style.summary ? <p className={styles.summary}>{style.summary}</p> : null}
                    </ClipCard>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
