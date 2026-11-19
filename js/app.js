const $ = (s, r = document) => r.querySelector(s);
const carrera = slug => CARRERAS.find(c => c.slug === slug);
const proyectosDe = slug => PROYECTOS.filter(p => p.carrera === slug);
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const param = k => new URLSearchParams(location.search).get(k);
const parrafos = t => String(t || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('');

/* Pantalla de mantenimiento: reemplaza el contenido de la página (entre el encabezado y el pie)
   cuando no se puede conectar con el servicio REST. Reintenta sola cada 30 s y, apenas el
   servicio responde, recarga la página. */
const MANT_REINTENTO_MS = 30000;
function mostrarMantenimiento() {
  const h = $('#header'), f = $('#footer');
  for (let n = h.nextElementSibling; n && n !== f;) { const sig = n.nextElementSibling; n.remove(); n = sig; }
  document.title = 'Sitio en mantenimiento · CENT 35';
  h.insertAdjacentHTML('afterend', `<div class="mant" role="status"><div class="wrap"><div class="mant-card">
    <div class="mant-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg></div>
    <span class="mant-kicker">Sitio en mantenimiento</span>
    <h1>Volvemos en unos minutos</h1>
    <p>Estamos realizando tareas de mantenimiento y en este momento no podemos mostrar los proyectos de nuestros estudiantes. Gracias por tu paciencia.</p>
    <div class="btns"><button type="button" class="btn red" id="mant-retry">Reintentar</button><a class="btn ghost" href="https://cent35.edu.ar" target="_blank" rel="noopener">Sitio del CENT 35</a></div>
    <p class="mant-msg" id="mant-msg" aria-live="polite">Volvemos a intentarlo automáticamente cada 30 segundos.</p>
  </div></div></div>`);
  const btn = $('#mant-retry'), msg = $('#mant-msg');
  let probando = false;
  const probar = async manual => {
    if (probando) return; probando = true;
    if (manual) { btn.disabled = true; btn.textContent = 'Verificando…'; }
    try { await cargarDatos(); location.reload(); }
    catch (e) { if (manual) msg.textContent = 'Todavía no podemos conectar con el servidor. Probá de nuevo en unos minutos.'; }
    finally { probando = false; if (manual) { btn.disabled = false; btn.textContent = 'Reintentar'; } }
  };
  btn.onclick = () => probar(true);
  setInterval(() => probar(false), MANT_REINTENTO_MS);
}

/* Carga los datos de la API; si no se puede conectar, muestra la pantalla de mantenimiento. */
async function conDatos() {
  try { await cargarDatos(); return true; }
  catch (e) { console.error('No se pudo leer la API', e); mostrarMantenimiento(); return false; }
}

function layout(active) {
  $('#header').innerHTML = `<div class="topbar"><div class="wrap">
    <a class="brand" href="index.html"><img class="logo" src="img/logo-cent35-oscuro.png" alt="CENT 35"><span><small>Prof. Julián José Godoy</small><small class="it">Construyendo Futuro</small></span></a>
    <nav class="nav"><a href="index.html" class="${active === 'inicio' ? 'on' : ''}">Inicio</a><a href="index.html#carreras">Carreras</a><a href="index.html#destacados">Destacados</a><a href="https://cent35.edu.ar" target="_blank" rel="noopener">Sitio del CENT 35</a></nav>
  </div></div>`;
  $('#footer').innerHTML = `<footer><div class="wrap">
    <div><b>CENT 35 · Prof. Julián José Godoy</b><p>Centro de Educación Superior Técnica<br>Río Grande y Tolhuin, Tierra del Fuego, Antártida e Islas del Atlántico Sur</p></div>
    <div><b>Proyecto</b><p>Galería de trabajos de los estudiantes<br>de todas las carreras.</p></div></div></footer>`;
}

function tarjeta(p) {
  const c = carrera(p.carrera);
  return `<a class="card" href="proyecto.html?id=${encodeURIComponent(p.id)}">
    <div class="im ${p.miniaturas.length ? '' : 'sin'}">${p.destacado ? '<span class="badge">★ Destacado</span>' : ''}${p.miniaturas.length ? `<img src="${esc(p.miniaturas[0])}" alt="${esc(p.textosAlt[0] || p.titulo)}" loading="lazy">` : ''}</div>
    <div class="bd"><span class="car">${esc(c.corto)} · ${p.anio}</span><h3>${esc(p.titulo)}</h3>
    <span class="al">👤 ${p.alumnos.map(esc).join(' · ')}</span><p class="rs">${esc(p.resumen)}</p>
    <div class="tags">${p.tecnologias.slice(0, 4).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    <span class="more">Ver proyecto →</span></div></a>`;
}

function initCarrusel() {
  const box = $('#slides'); if (!box || !CARRUSEL.length) return;
  box.innerHTML = CARRUSEL.map((s, i) => `<div class="slide ${i ? '' : 'on'}" style="background-image:url('${esc(s.src)}');background-position:${esc(s.pos || 'center')}"></div>`).join('');
  const dots = $('#dots'); const cap = $('#cap');
  dots.innerHTML = CARRUSEL.map((_, i) => `<button aria-label="Imagen ${i + 1}" class="${i ? '' : 'on'}"></button>`).join('');
  let cur = 0, t;
  const go = n => {
    cur = (n + CARRUSEL.length) % CARRUSEL.length;
    box.querySelectorAll('.slide').forEach((e, i) => e.classList.toggle('on', i === cur));
    dots.querySelectorAll('button').forEach((e, i) => e.classList.toggle('on', i === cur));
    cap.innerHTML = `<b>${esc(CARRUSEL[cur].titulo)}</b><span${CARRUSEL[cur].cursiva ? ' class="it"' : ''}>${esc(CARRUSEL[cur].texto)}</span>`;
  };
  const play = () => { clearInterval(t); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) t = setInterval(() => go(cur + 1), 6000); };
  dots.querySelectorAll('button').forEach((b, i) => b.onclick = () => { go(i); play(); });
  $('#prev').onclick = () => { go(cur - 1); play(); }; $('#next').onclick = () => { go(cur + 1); play(); };
  const hero = $('.hero'); hero.addEventListener('mouseenter', () => clearInterval(t)); hero.addEventListener('mouseleave', play);
  go(0); play();
}

async function initHome() {
  layout('inicio');
  $('#careers').innerHTML = '<div class="empty"><b>Cargando…</b></div>';
  if (!await conDatos('#careers')) return;
  initCarrusel();
  $('#careers').innerHTML = CARRERAS.map(c => {
    const n = proyectosDe(c.slug).length;
    return `<a class="career ${n ? 'has' : ''}" href="carrera.html?c=${c.slug}"><span class="cod ico" style="--ico:url(${new URL('img/carreras/' + c.slug + '.png', document.baseURI).href})" role="img" aria-label="${esc(c.corto)}"></span><div><h3>${esc(c.nombre)}</h3><small>${n ? n + ' proyecto' + (n > 1 ? 's' : '') : 'Próximamente'}</small></div></a>`;
  }).join('');
  const dest = PROYECTOS.filter(p => p.destacado);
  $('#destacados-grid').innerHTML = dest.length ? dest.map(tarjeta).join('') : '<div class="empty"><b>Aún no hay proyectos destacados</b></div>';
}

async function initCarrera() {
  layout('');
  $('#lista').innerHTML = '<div class="empty"><b>Cargando…</b></div>';
  if (!await conDatos('#main')) return;
  const c = carrera(param('c'));
  if (!c) { $('#main').innerHTML = '<div class="wrap"><div class="empty" style="margin-top:40px"><b>Carrera no encontrada</b><a class="btn red" href="index.html">Volver al inicio</a></div></div>'; return; }
  document.title = c.corto + ' · Proyectos CENT 35';
  $('#titulo').textContent = c.nombre;
  const todos = proyectosDe(c.slug);
  const anios = [...new Set(todos.map(p => p.anio))].sort((a, b) => b - a);
  $('#cuenta').textContent = todos.length + (todos.length === 1 ? ' proyecto publicado' : ' proyectos publicados');
  $('#anio').innerHTML = '<option value="">Todos los años</option>' + anios.map(a => `<option>${a}</option>`).join('');
  $('#otras').innerHTML = CARRERAS.map(x => `<a href="carrera.html?c=${x.slug}" class="${x.slug === c.slug ? 'on' : ''}">${esc(x.corto)}</a>`).join('');
  const render = () => {
    const q = $('#q').value.trim().toLowerCase(), a = $('#anio').value;
    const lista = todos.filter(p => (!a || String(p.anio) === a) &&
      (!q || [p.titulo, p.resumen, p.alumnos.join(' '), p.tecnologias.join(' ')].join(' ').toLowerCase().includes(q)))
      .sort((x, y) => (y.destacado - x.destacado) || (y.anio - x.anio));
    const dest = lista.filter(p => p.destacado), resto = lista.filter(p => !p.destacado);
    let h = '';
    if (!todos.length) h = '<div class="empty"><b>Todavía no hay proyectos de esta carrera</b>Pronto vas a poder ver acá los trabajos finales de los estudiantes.</div>';
    else if (!lista.length) h = '<div class="empty"><b>Sin resultados</b>Probá con otra búsqueda o año.</div>';
    else {
      if (dest.length) h += `<div class="sec-h"><h2>Proyectos destacados</h2></div><div class="grid">${dest.map(tarjeta).join('')}</div>`;
      if (resto.length) h += `<div class="sec-h" style="margin-top:44px"><h2>${dest.length ? 'Todos los proyectos' : 'Proyectos'}</h2></div><div class="grid">${resto.map(tarjeta).join('')}</div>`;
    }
    $('#lista').innerHTML = h;
  };
  $('#q').addEventListener('input', render); $('#anio').addEventListener('change', render); render();
}

async function initProyecto() {
  layout('');
  if (!await conDatos('#main')) return;
  const p = PROYECTOS.find(x => x.id === param('id'));
  if (!p) { $('#main').innerHTML = '<div class="wrap"><div class="empty" style="margin-top:40px"><b>Proyecto no encontrado</b><a class="btn red" href="index.html">Volver al inicio</a></div></div>'; return; }
  const c = carrera(p.carrera); document.title = p.titulo + ' · CENT 35';
  $('#crumb').innerHTML = `<a href="index.html">Inicio</a> › <a href="carrera.html?c=${c.slug}">${esc(c.corto)}</a> › ${esc(p.titulo)}`;
  $('#titulo').textContent = p.titulo; $('#sub').textContent = p.resumen;
  $('#gal').innerHTML = p.imagenes.length
    ? `<div class="gal-main" id="gm"><img id="gi" src="${esc(p.imagenes[0])}" alt="${esc(p.textosAlt[0] || p.titulo)}"></div>
    ${p.imagenes.length > 1 ? `<div class="thumbs">${p.miniaturas.map((s, i) => `<button class="${i ? '' : 'on'}" data-i="${i}"><img src="${esc(s)}" alt="${esc(p.textosAlt[i] || 'Imagen ' + (i + 1))}"></button>`).join('')}</div>` : ''}`
    : '<div class="gal-main sin"></div>';
  $('#info').innerHTML = `<h4>Alumnos</h4><ul>${p.alumnos.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
    <h4>Carrera</h4><p>${esc(c.nombre)}</p><h4>Año</h4><p>${p.anio}</p>
    ${p.materia ? `<h4>Materia</h4><p>${esc(p.materia)}</p>` : ''}
    ${p.docente ? `<h4>Docente</h4><p>${esc(p.docente)}</p>` : ''}
    ${p.tecnologias.length ? `<h4>Tecnologías</h4><div class="tags">${p.tecnologias.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
    ${(p.enlaces || []).map(l => `<a class="btn red" style="margin-top:16px" target="_blank" rel="noopener" href="${esc(l.url)}">${esc(l.texto)}</a>`).join('')}`;
  $('#txt').innerHTML = `<h2>Sobre el proyecto</h2>${parrafos(p.descripcion || p.resumen)}${p.objetivos.length ? `<h2 style="margin-top:22px">Objetivos</h2><ul>${p.objetivos.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}`
    + (p.esPrueba ? '<div class="note">Proyecto de prueba con datos ficticios, generado para demostración del sitio.</div>' : '');
  const gi = $('#gi');
  if (gi) {
    document.querySelectorAll('.thumbs button').forEach(b => b.onclick = () => {
      gi.src = p.imagenes[b.dataset.i];
      document.querySelectorAll('.thumbs button').forEach(x => x.classList.toggle('on', x === b));
    });
    $('#gm').onclick = () => { $('#lbi').src = gi.src; $('#lb').classList.add('on'); };
  }
  $('#lb').onclick = () => $('#lb').classList.remove('on');
  document.addEventListener('keydown', e => e.key === 'Escape' && $('#lb').classList.remove('on'));
}
