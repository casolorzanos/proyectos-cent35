/* ============================================================
   CLIENTE DE LA API (Oracle ORDS) - Proyectos Finales CENT 35
   Lee los servicios REST del módulo "cent35" y arma las mismas
   estructuras que usa app.js: CARRERAS, PROYECTOS y CARRUSEL.
   Los endpoints son de solo lectura y públicos (CORS habilitado
   para https://casolorzanos.github.io).
   ============================================================ */

const API_BASE = 'https://g1803fb32fe4f7e-sigi.adb.us-ashburn-1.oraclecloudapps.com/ords/cent35/cent35/';

/* Carrusel de respaldo: se usa solo si la API no tiene slides activos. */
const CARRUSEL_POR_DEFECTO = [
  { src: 'img/carrusel/1-cordillera.svg', titulo: 'CENT 35 · Río Grande', texto: 'Río Grande - Tolhuin,\nConstruyendo Futuro', cursiva: true, pos: 'center' },
  { src: 'img/carrusel/2-costa.svg', titulo: 'Formación técnica superior', texto: 'Carreras con salida laboral en la provincia', pos: 'center' },
  { src: 'img/carrusel/3-bosque.svg', titulo: 'Proyectos con identidad fueguina', texto: 'Tecnología aplicada a problemas locales', pos: 'center' },
  { src: 'img/carrusel/4-noche.svg', titulo: 'Más de 30 años formando técnicos', texto: 'Desde 1988 en Río Grande', pos: 'center' }
];

let CARRERAS = [], PROYECTOS = [], CARRUSEL = [];

/* Trae todas las páginas de una colección ORDS ({items, hasMore, limit, offset}). */
async function apiLista(recurso) {
  const items = [];
  let offset = 0;
  for (let i = 0; i < 50; i++) {
    const r = await fetch(`${API_BASE}${recurso}?offset=${offset}`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`${recurso}: HTTP ${r.status}`);
    const j = await r.json();
    items.push(...(j.items || []));
    if (!j.hasMore) return items;
    offset += j.limit || (j.items || []).length || 1;
  }
  throw new Error(`${recurso}: demasiadas páginas`);
}

const urlImagen = id => `${API_BASE}imagenes/${id}`;
const urlMiniatura = id => `${API_BASE}imagenes/${id}/miniatura`;
const urlSlide = id => `${API_BASE}carrusel/${id}`;

/* Prolija un nombre: quita espacios sobrantes y pasa a "Título" las palabras escritas TODO EN MAYÚSCULAS. */
function nombreLimpio(t) {
  return String(t).trim().split(/\s+/).map(w => (w.length > 1 && w === w.toUpperCase()) ? w.charAt(0) + w.slice(1).toLowerCase() : w).join(' ');
}

/* Agrupa filas por id_proyecto, ordenadas por "orden". */
function porProyecto(filas, mapa) {
  const out = new Map();
  filas.slice().sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)).forEach(f => {
    if (!out.has(f.id_proyecto)) out.set(f.id_proyecto, []);
    out.get(f.id_proyecto).push(mapa(f));
  });
  return out;
}

let _datos = null;
/* Carga todo una sola vez por página. Lanza error si la API no responde. */
function cargarDatos() {
  if (_datos) return _datos;
  _datos = (async () => {
    const [carreras, proyectos, alumnos, tecnologias, objetivos, imagenes, carrusel] = await Promise.all(
      ['carreras', 'proyectos', 'alumnos', 'tecnologias', 'objetivos', 'imagenes', 'carrusel'].map(apiLista));

    const mAlumnos = porProyecto(alumnos, a => nombreLimpio(`${a.nombres || ''} ${a.apellidos || ''}`));
    const mTec = porProyecto(tecnologias, t => t.nombre);
    const mObj = porProyecto(objetivos, o => o.texto);
    const mImg = porProyecto(imagenes, i => ({ id: i.id_imagen, alt: i.texto_alt }));

    CARRERAS = carreras.map(c => ({ slug: c.slug, codigo: c.codigo, nombre: c.nombre, corto: c.corto }));
    PROYECTOS = proyectos.map(p => {
      const imgs = mImg.get(p.id_proyecto) || [];
      return {
        id: String(p.id_proyecto),
        carrera: p.carrera_slug,
        titulo: p.titulo,
        anio: p.anio,
        resumen: p.resumen || '',
        descripcion: p.descripcion || '',
        destacado: Number(p.destacado) === 1,
        esPrueba: Number(p.es_prueba) === 1,
        materia: p.materia || '',
        docente: p.docente || '',
        alumnos: mAlumnos.get(p.id_proyecto) || [],
        tecnologias: mTec.get(p.id_proyecto) || [],
        objetivos: mObj.get(p.id_proyecto) || [],
        imagenes: imgs.map(i => urlImagen(i.id)),
        miniaturas: imgs.map(i => urlMiniatura(i.id)),
        textosAlt: imgs.map(i => i.alt || '')
      };
    });
    CARRUSEL = carrusel.length
      ? carrusel.slice().sort((a, b) => a.orden - b.orden).map(s => ({ src: urlSlide(s.id_slide), titulo: s.titulo, texto: s.texto || '', pos: s.posicion || 'center' }))
      : CARRUSEL_POR_DEFECTO;
  })();
  _datos.catch(() => { _datos = null; }); // permite reintentar
  return _datos;
}
