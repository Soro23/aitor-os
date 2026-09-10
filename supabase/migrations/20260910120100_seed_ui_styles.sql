-- Catalogo inicial de 40 estilos visuales, agrupados en las 6 categorias del
-- enum. Se publican de entrada: el resumen es suficiente para que la seccion
-- tenga sentido, y las imagenes, enlaces y textos largos se completan despues
-- desde el panel de administracion.
insert into public.ui_styles (slug, name, category, summary, is_published, sort_order)
values
  -- 1. Minimalistas y funcionales
  ('minimalism', 'Minimalism', 'minimalistas', 'Reduce la interfaz a lo esencial: mucho espacio en blanco, poca decoración y una jerarquía tipográfica que hace todo el trabajo.', true, 1),
  ('flat-design', 'Flat Design', 'minimalistas', 'Elimina sombras, degradados y texturas en favor de formas planas y color sólido, priorizando legibilidad y velocidad de carga.', true, 2),
  ('material-design', 'Material Design', 'minimalistas', 'Sistema de Google basado en superficies con elevación, sombras coherentes y movimiento con reglas físicas.', true, 3),
  ('fluent-design', 'Fluent Design', 'minimalistas', 'Sistema de Microsoft: profundidad, luz, materiales translúcidos (acrylic, mica) y continuidad entre dispositivos.', true, 4),
  ('swiss-international-style', 'Swiss / International Style', 'minimalistas', 'Retícula estricta, tipografía sans-serif y composición objetiva; la base histórica de casi todo el diseño funcional moderno.', true, 5),
  ('bauhaus', 'Bauhaus', 'minimalistas', 'Formas geométricas primarias, colores básicos y la idea de que la forma sigue a la función.', true, 6),
  ('monochrome-design', 'Monochrome Design', 'minimalistas', 'Una sola familia cromática en toda la interfaz; el contraste y la jerarquía se resuelven con luminosidad, no con color.', true, 7),
  ('grid-based-design', 'Grid-Based Design', 'minimalistas', 'La retícula visible como estructura y como recurso estético, con alineaciones y módulos consistentes.', true, 8),

  -- 2. Modernos y tecnologicos
  ('glassmorphism', 'Glassmorphism', 'modernos', 'Paneles translúcidos con desenfoque de fondo, bordes sutiles y sensación de capas de cristal superpuestas.', true, 9),
  ('neumorphism', 'Neumorphism', 'modernos', 'Elementos que parecen extruidos del propio fondo mediante sombras dobles, suaves y de bajo contraste.', true, 10),
  ('neo-brutalism', 'Neo-Brutalism', 'modernos', 'Bordes gruesos, sombras duras, colores saturados y componentes deliberadamente crudos, pero con estructura.', true, 11),
  ('bento-ui', 'Bento UI', 'modernos', 'Composición en módulos rectangulares de distinto tamaño, como una caja bento; ideal para dashboards y landings de producto.', true, 12),
  ('gradient-design', 'Gradient Design', 'modernos', 'El degradado como elemento principal de identidad: fondos, mallas de color y transiciones cromáticas amplias.', true, 13),
  ('3d-ui', '3D UI', 'modernos', 'Objetos tridimensionales reales o renderizados integrados en la interfaz, a menudo interactivos.', true, 14),
  ('isometric-design', 'Isometric Design', 'modernos', 'Ilustración y escenas en proyección isométrica para explicar sistemas, productos o arquitecturas.', true, 15),
  ('motion-driven-ui', 'Motion-Driven UI', 'modernos', 'El movimiento como estructura narrativa: scroll, transiciones y micro-interacciones guían la lectura.', true, 16),

  -- 3. Expresivos y experimentales
  ('maximalism', 'Maximalism', 'expresivos', 'Saturación deliberada: muchos colores, capas, texturas y elementos compitiendo con energía controlada.', true, 17),
  ('brutalism', 'Brutalism', 'expresivos', 'HTML casi sin estilizar, tipografía por defecto y crudeza intencionada como declaración de principios.', true, 18),
  ('anti-design', 'Anti-Design', 'expresivos', 'Rompe a propósito las convenciones de usabilidad y estética para provocar y llamar la atención.', true, 19),
  ('experimental-design', 'Experimental Design', 'expresivos', 'Interfaces que exploran interacciones, formatos y navegaciones fuera de todo patrón establecido.', true, 20),
  ('broken-grid', 'Broken Grid', 'expresivos', 'Parte de una retícula y la rompe con solapamientos y desalineaciones calculadas para generar tensión visual.', true, 21),
  ('asymmetrical-design', 'Asymmetrical Design', 'expresivos', 'Equilibrio sin simetría: pesos visuales compensados en composiciones deliberadamente descentradas.', true, 22),
  ('typography-driven-design', 'Typography-Driven Design', 'expresivos', 'La tipografía es el contenido y la imagen a la vez: escalas enormes, contrastes fuertes y poco más.', true, 23),
  ('collage-design', 'Collage Design', 'expresivos', 'Mezcla de fotografía recortada, ilustración, texturas y tipografía como si fuera un montaje físico.', true, 24),

  -- 4. Retro y nostalgia digital
  ('y2k-design', 'Y2K Design', 'retro', 'Estética del cambio de milenio: cromados, brillos, burbujas, azules metálicos y optimismo tecnológico.', true, 25),
  ('retro-design', 'Retro Design', 'retro', 'Recupera paletas, tipografías y recursos gráficos de décadas pasadas y los aplica a interfaces actuales.', true, 26),
  ('retro-futurism', 'Retro-Futurism', 'retro', 'El futuro tal y como se imaginaba en el pasado: formas curvas, paletas cálidas y tecnología analógica.', true, 27),
  ('pixel-art', 'Pixel Art', 'retro', 'Gráficos construidos píxel a píxel, con paleta limitada y rejilla visible como parte de la identidad.', true, 28),
  ('8-bit-design', '8-bit Design', 'retro', 'Referencia directa a las consolas de 8 bits: sprites, tipografía de mapa de bits y sonido asociado.', true, 29),
  ('vaporwave', 'Vaporwave', 'retro', 'Pastel, estatuas clásicas, mallas y elementos de interfaz de los 90 recombinados con ironía.', true, 30),
  ('synthwave', 'Synthwave', 'retro', 'Neón sobre fondo oscuro, rejillas en perspectiva, soles con bandas y estética de los 80.', true, 31),
  ('grunge', 'Grunge', 'retro', 'Texturas sucias, rasgados, manchas y composición desordenada con carácter analógico.', true, 32),

  -- 5. Futuristas y ciencia ficcion
  ('cyberpunk', 'Cyberpunk', 'futuristas', 'Neón sobre negro, tipografía condensada, glitch y densidad de información urbana y distópica.', true, 33),
  ('futuristic-sci-fi-ui', 'Futuristic / Sci-Fi UI', 'futuristas', 'Interfaces de ficción científica: paneles técnicos, líneas finas, datos en movimiento y sensación de sistema avanzado.', true, 34),
  ('hud-fui', 'HUD / FUI', 'futuristas', 'Capas de información superpuestas al estilo visor: retículas, marcadores, indicadores y telemetría.', true, 35),
  ('holographic-ui', 'Holographic UI', 'futuristas', 'Superficies iridiscentes y elementos que simulan proyección holográfica flotando sobre el fondo.', true, 36),

  -- 6. Editoriales y artisticos
  ('editorial-design', 'Editorial Design', 'editoriales', 'Aplica el lenguaje de la revista impresa a pantalla: columnas, ritmo tipográfico y fotografía a sangre.', true, 37),
  ('art-deco', 'Art Deco', 'editoriales', 'Geometría simétrica, líneas doradas, motivos repetidos y tipografía de los años 20 y 30.', true, 38),
  ('memphis-design', 'Memphis Design', 'editoriales', 'Formas geométricas dispersas, colores primarios y patrones de los 80 con espíritu lúdico.', true, 39),
  ('organic-biomorphic-design', 'Organic / Biomorphic Design', 'editoriales', 'Formas curvas e irregulares inspiradas en la naturaleza, sin ángulos rectos ni retícula evidente.', true, 40);
