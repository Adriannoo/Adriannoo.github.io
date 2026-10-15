'use strict';

const root = document.documentElement;
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
root.classList.add('js');

// Storage is optional: navigation and themes continue to work when it is blocked.
function readTheme() { try { return localStorage.getItem('adriano-portfolio-theme'); } catch { return null; } }
function saveTheme(value) { try { localStorage.setItem('adriano-portfolio-theme', value); } catch { /* No persistence available. */ } }
const themeToggle = document.querySelector('.theme-toggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeToggle.querySelector('use').setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101010' : '#f3f2ef';
}
const savedTheme = readTheme();
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next); saveTheme(next);
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menuToggle.hidden = false;
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('open');
}
menuToggle.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', opened);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  const navLinks = [...navigation.querySelectorAll('a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main>section[id]').forEach(section => sectionObserver.observe(section));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));

const filters = document.querySelector('.filters');
filters.hidden = false;
const projects = [...document.querySelectorAll('.project')];
filters.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  const selected = button.dataset.filter;
  filters.querySelectorAll('button').forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  projects.forEach(project => {
    project.hidden = selected !== 'all' && project.dataset.category !== selected;
    if (!project.hidden) { count++; project.classList.add('visible'); }
  });
  document.querySelector('#project-count').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
});

const details = {
  master: { title: 'Detetizadora Master', category: 'Desktop / Projeto acadêmico', description: 'Sistema de gestão para uma empresa de controle de pragas, desenvolvido em Java Swing com PostgreSQL.', features: ['Cadastros de clientes e funcionários, com validação e máscaras nos campos.', 'Serviços, agenda e permissões de acesso por cargo.', 'Relatórios com resumos de serviços e exportação CSV.', 'Persistência com JPA/Hibernate, migrations com Flyway e testes com JUnit.'], note: 'Os dados das imagens são demonstrativos.', repo: 'ProjetoMensal-SistemaDetetizadora' },
  poke: { title: 'PokeCompanion', category: 'Web / Projeto acadêmico', description: 'Interface para explorar informações sobre Pokémon, com consumo de API e organização de dados no navegador.', features: ['Pokédex com busca, filtros e detalhes dos Pokémon.', 'Comparação e favoritos.', 'Interface responsiva com HTML, CSS e JavaScript.', 'Consumo de API com Fetch e persistência local no navegador.'], note: 'O acesso e os dados locais são demonstrativos; não representam autenticação de um serviço em produção.', repo: 'PokeCompanion' },
  parceiro: { title: 'ParceiroAuto', category: 'Full Stack / Em desenvolvimento', description: 'Projeto Integrador do semestre: um sistema contábil para organizar empresas, contas bancárias e movimentações financeiras.', features: ['API Java com Spring Boot e persistência em PostgreSQL.', 'Interface em Angular, TypeScript e Bootstrap.', 'Categorias e regras de recorrência de movimentações.', 'Validação, migrations com Flyway e documentação OpenAPI.'], note: 'Projeto em desenvolvimento em equipe. A integração entre back-end e front-end está em andamento.', repo: 'ParceiroAuto' },
  carpincho: { title: 'Carpincho', category: 'Web / Projeto acadêmico', description: 'Site institucional de uma oficina automotiva fictícia com catálogo de serviços e demonstração de gestão.', features: ['Catálogo com busca, filtros e detalhes de serviços.', 'CRUD de serviços com autoria e histórico local de alterações.', 'Mapa com Leaflet e OpenStreetMap.', 'Interface responsiva e dados persistidos em localStorage.'], note: 'Cadastro e login são demonstrações locais no navegador, sem servidor de autenticação.', repo: 'PIE-Carpincho' },
  flappy: { title: 'Flappy Bird', category: 'Jogos / Projeto de estudo', description: 'Jogo de estudo em Python e Pygame, inspirado em Flappy Bird, com foco na experiência de jogo e distribuição para Windows.', features: ['Dificuldade progressiva a cada 25 pontos.', 'Menu, histórico, recordes e configurações persistentes.', 'Pausa ao perder foco e contagem para retomar a partida.', 'Empacotamento com PyInstaller e instalador para Windows.'], note: 'Pontuações e histórico são locais. O instalador disponível no repositório é destinado a Windows 10/11 de 64 bits.', repo: 'flappy-bird' },
  snake: { title: 'Snake Game', category: 'Jogos / Projeto de estudo', description: 'Implementação de Snake em Python e Pygame, com modos de dificuldade e acompanhamento de pontuações.', features: ['Modos fácil, normal e difícil com velocidade progressiva.', 'Recordes por modalidade e histórico de partidas.', 'Pausa, contagem de retomada e configurações persistentes.', 'Testes automatizados e distribuição com instalador para Windows.'], note: 'O histórico e as pontuações ficam no computador do jogador.', repo: 'snake-game' },
  bere: { title: 'Mercado Dona Bere', category: 'Terminal / Projeto acadêmico', description: 'Aplicação em C para a gestão local de um mercado, praticando estruturas de dados e gerenciamento manual de memória.', features: ['Cadastros, estoque, carrinho e operações de venda.', 'Abertura, sangria e fechamento de caixa.', 'Listas encadeadas e alocação dinâmica de memória.', 'Persistência em arquivos binários e relatórios de sessão.'], note: 'Aplicação acadêmica de terminal; pagamentos por cartão são demonstrativos.', repo: 'Bere' }
};
const dialog = document.querySelector('#project-dialog');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('.project-details').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const project = details[button.dataset.id];
      if (!project) return;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-description').textContent = project.description;
      document.querySelector('#dialog-note').textContent = project.note;
      const list = document.querySelector('#dialog-features');
      list.replaceChildren(...project.features.map(feature => { const item = document.createElement('li'); item.textContent = feature; return item; }));
      document.querySelector('#dialog-link').href = `https://github.com/Adriannoo/${project.repo}`;
      dialog.showModal(); document.body.classList.add('dialog-open');
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}

const copyButton = document.querySelector('.copy-email');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText('adriannoordsj@gmail.com'); status.textContent = 'E-mail copiado.'; }
    catch { status.textContent = 'Não foi possível copiar. Selecione o endereço de e-mail acima.'; }
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Lightweight decorative network, limited to the visible hero and reduced-motion preference.
const canvas = document.querySelector('#constellation');
const context = canvas.getContext('2d');
if (context) {
  let width = 0, height = 0, points = [], frame = null, visible = true, lastTime = 0;
  function resize() {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    points = Array.from({length: width < 760 ? 24 : 52}, () => ({x: Math.random()*width, y: Math.random()*height, vx:(Math.random()-.5)*8, vy:(Math.random()-.5)*8}));
  }
  function draw(time) {
    frame = null;
    if (!visible || document.hidden || motion.matches) return;
    const delta = Math.min((time-lastTime)/1000 || 0, .05); lastTime = time;
    context.clearRect(0, 0, width, height);
    const light = root.dataset.theme === 'light';
    points.forEach(point => {
      point.x += point.vx*delta; point.y += point.vy*delta;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      context.beginPath(); context.arc(point.x, point.y, 1.1, 0, Math.PI*2); context.fillStyle=light?'#4448':'#bbb8'; context.fill();
    });
    for (let a=0; a<points.length; a++) for (let b=a+1; b<points.length; b++) {
      const distance = Math.hypot(points[a].x-points[b].x, points[a].y-points[b].y);
      if (distance < 130) { context.strokeStyle = `rgba(${light?'40,40,40':'200,200,200'},${.16*(1-distance/130)})`; context.lineWidth=.5; context.beginPath(); context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y); context.stroke(); }
    }
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; lastTime = 0;
    if (visible && !document.hidden && !motion.matches) frame=requestAnimationFrame(draw);
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible=entries[0].isIntersecting; sync(); }).observe(canvas);
  document.addEventListener('visibilitychange', sync); motion.addEventListener('change', sync); sync();
}
