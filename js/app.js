const $ = (s, r = document) => r.querySelector(s);
const carrera = slug => CARRERAS.find(c => c.slug === slug);
const proyectosDe = slug => PROYECTOS.filter(p => p.carrera === slug);
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const param = k => new URLSearchParams(location.search).get(k);

function layout(active) {
  $('#header').innerHTML = `<div class="topbar"><div class="wrap">
    <a class="brand" href="index.html"><img class="logo" src="img/logo-cent35.png" alt="CENT 35"><span><small>Prof. José Julián Godoy</small><small>Proyectos finales</small></span></a>
    <nav class="nav"><a href="index.html" class="${active === 'inicio' ? 'on' : ''}">Inicio</a><a href="index.html#carreras">Carreras</a><a href="index.html#destacados">Destacados</a><a href="https://cent35.edu.ar" target="_blank" rel="noopener">Sitio del CENT 35</a></nav>
  </div></div>`;
  $('#footer').innerHTML = `<footer><div class="wrap">
    <div><b>CENT 35 · Prof. José Julián Godoy</b><p>Instituto de Educación Superior Técnica<br>Río Grande, Tierra del Fuego, Antártida e Islas del Atlántico Sur</p></div>
    <div><b>Proyectos finales</b><p>Galería de trabajos de los estudiantes<br>de todas las carreras.</p></div></div></footer>`;
}

function tarjeta(p) {
  const c = carrera(p.carrera);
  return `<a class="card" href="proyecto.html?id=${encodeURIComponent(p.id)}">
    <div class="im">${p.destacado ? '<span class="badge">★ Destacado</span>' : ''}<img src="${esc(p.imagenes[0])}" alt="${esc(p.titulo)}" loading="lazy"></div>
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
    cap.innerHTML = `<b>${esc(CARRUSEL[cur].titulo)}</b><span>${esc(CARRUSEL[cur].texto)}</span>`;
  };
  const play = () => { clearInterval(t); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) t = setInterval(() => go(cur + 1), 6000); };
  dots.querySelectorAll('button').forEach((b, i) => b.onclick = () => { go(i); play(); });
  $('#prev').onclick = () => { go(cur - 1); play(); }; $('#next').onclick = () => { go(cur + 1); play(); };
  const hero = $('.hero'); hero.addEventListener('mouseenter', () => clearInterval(t)); hero.addEventListener('mouseleave', play);
  go(0); play();
}

function initHome() {
  layout('inicio');
  initCarrusel();
  $('#careers').innerHTML = CARRERAS.map(c => {
    const n = proyectosDe(c.slug).length;
    return `<a class="career ${n ? 'has' : ''}" href="carrera.html?c=${c.slug}"><span class="cod">${c.codigo}</span><div><h3>${esc(c.nombre)}</h3><small>${n ? n + ' proyecto' + (n > 1 ? 's' : '') : 'Próximamente'}</small></div></a>`;
  }).join('');
  const dest = PROYECTOS.filter(p => p.destacado);
  $('#destacados-grid').innerHTML = dest.length ? dest.map(tarjeta).join('') : '<div class="empty"><b>Aún no hay proyectos destacados</b></div>';
}

function initCarrera() {
  layout('');
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

function initProyecto() {
  layout('');
  const p = PROYECTOS.find(x => x.id === param('id'));
  if (!p) { $('#main').innerHTML = '<div class="wrap"><div class="empty" style="margin-top:40px"><b>Proyecto no encontrado</b><a class="btn red" href="index.html">Volver al inicio</a></div></div>'; return; }
  const c = carrera(p.carrera); document.title = p.titulo + ' · CENT 35';
  $('#crumb').innerHTML = `<a href="index.html">Inicio</a> › <a href="carrera.html?c=${c.slug}">${esc(c.corto)}</a> › ${esc(p.titulo)}`;
  $('#titulo').textContent = p.titulo; $('#sub').textContent = p.resumen;
  $('#gal').innerHTML = `<div class="gal-main" id="gm"><img id="gi" src="${esc(p.imagenes[0])}" alt="${esc(p.titulo)}"></div>
    <div class="thumbs">${p.imagenes.map((s, i) => `<button class="${i ? '' : 'on'}" data-i="${i}"><img src="${esc(s)}" alt="Imagen ${i + 1}"></button>`).join('')}</div>`;
  $('#info').innerHTML = `<h4>Alumnos</h4><ul>${p.alumnos.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
    <h4>Carrera</h4><p>${esc(c.nombre)}</p><h4>Año</h4><p>${p.anio}</p>
    ${p.docente ? `<h4>Docente</h4><p>${esc(p.docente)}</p>` : ''}
    <h4>Tecnologías</h4><div class="tags">${p.tecnologias.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    ${(p.enlaces || []).map(l => `<a class="btn red" style="margin-top:16px" target="_blank" rel="noopener" href="${esc(l.url)}">${esc(l.texto)}</a>`).join('')}`;
  $('#txt').innerHTML = `<h2>Sobre el proyecto</h2><p>${esc(p.descripcion)}</p>${p.objetivos ? `<h2 style="margin-top:22px">Objetivos</h2><ul>${p.objetivos.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}`
    + '<div class="note">Proyecto de prueba con datos ficticios, generado para demostración del sitio.</div>';
  const gi = $('#gi');
  document.querySelectorAll('.thumbs button').forEach(b => b.onclick = () => {
    gi.src = p.imagenes[b.dataset.i];
    document.querySelectorAll('.thumbs button').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#gm').onclick = () => { $('#lbi').src = gi.src; $('#lb').classList.add('on'); };
  $('#lb').onclick = () => $('#lb').classList.remove('on');
  document.addEventListener('keydown', e => e.key === 'Escape' && $('#lb').classList.remove('on'));
}
