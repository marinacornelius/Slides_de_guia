/* ==========================================================
   navegacao.js · telas, cronômetro, linha do
   tempo, visão geral, notas do instrutor e teclado
   ========================================================== */
const Nav = {
  slides: [], indice: 0, restante: 0, timer: null, rodando: false,
  els: {}
};

function montarTelas() {
  const palco = document.getElementById("palco");
  TELAS.forEach((t, i) => {
    const corpo = [].concat(t.render());
    const s = h("section", { class: "slide " + (t.classe || ""), dataset: { bloco: t.bloco, min: t.min, titulo: t.titulo }, "aria-label": `Tela ${i + 1} de 8: ${t.titulo}` },
      topo(i + 1, t.rotulo, t.intervalo), ...corpo);
    palco.append(s);
    Nav.slides.push(s);
  });
  Nav.els = {
    indicador: document.getElementById("indicadorTela"), cronometro: document.getElementById("cronometro"),
    progresso: document.getElementById("progresso"), tempo: document.getElementById("linha-tempo"),
    proximo: document.getElementById("btnProximo"), notas: document.getElementById("notas"),
    vg: document.getElementById("visao-geral"), vgGrade: document.getElementById("vg-grade"), ajuda: document.getElementById("ajuda")
  };
}

/* ---------- botão "próxima" ---------- */
function atualizarBotao() {
  Nav.els.proximo.textContent = Nav.indice === Nav.slides.length - 1 ? "Fim ✓" : "Próxima tela →";
}

/* ---------- navegação ---------- */
function irPara(i) {
  Nav.slides[Nav.indice].classList.remove("ativo");
  Nav.indice = Math.max(0, Math.min(Nav.slides.length - 1, i));
  const s = Nav.slides[Nav.indice];
  s.classList.add("ativo"); s.scrollTop = 0;
  Nav.els.indicador.textContent = `Tela ${Nav.indice + 1} / ${Nav.slides.length}`;
  Nav.els.progresso.style.width = ((Nav.indice + 1) / Nav.slides.length * 100) + "%";
  Nav.els.progresso.style.background = getComputedStyle(s).getPropertyValue("--acento");
  [...Nav.els.tempo.children].forEach((b, k) => { b.classList.toggle("ativo", k === Nav.indice); b.classList.toggle("feito", k < Nav.indice); });
  try { history.replaceState(null, "", location.search + "#" + (Nav.indice + 1)); } catch (e) { /* ignora */ }
  reiniciarCronometro(); atualizarBotao(); atualizarNotas();
  if (Nav.indice === Nav.slides.length - 1) lancarConfete();
}
function proximo() { if (Nav.indice < Nav.slides.length - 1) irPara(Nav.indice + 1); }
function anterior() { if (Nav.indice > 0) irPara(Nav.indice - 1); }

/* ---------- cronômetro por tela ---------- */
const fmt = (s) => (s < 0 ? "−" : "") + String(Math.floor(Math.abs(s) / 60)).padStart(2, "0") + ":" + String(Math.abs(s) % 60).padStart(2, "0");
function pintarCronometro() {
  const c = Nav.els.cronometro;
  c.textContent = (Nav.rodando ? "⏸ " : "▶ ") + fmt(Nav.restante);
  c.classList.toggle("pausado", !Nav.rodando);
  c.classList.toggle("alerta", Nav.restante <= 60 && Nav.restante >= 0);
  c.classList.toggle("estourou", Nav.restante < 0);
}
function reiniciarCronometro() { Nav.restante = Number(Nav.slides[Nav.indice].dataset.min) * 60; pintarCronometro(); }
function alternarCronometro() {
  Nav.rodando = !Nav.rodando; clearInterval(Nav.timer);
  if (Nav.rodando) Nav.timer = setInterval(() => { Nav.restante--; pintarCronometro(); }, 1000);
  pintarCronometro();
}

/* ---------- linha do tempo proporcional aos 120 minutos ---------- */
function montarLinhaTempo() {
  TELAS.forEach((t, i) => Nav.els.tempo.append(h("button", {
    type: "button", class: "trecho", style: `flex-grow:${t.min};--c:var(--b${t.bloco})`,
    "aria-label": `Ir para a tela ${i + 1}: ${t.titulo} (${t.min} min)`, title: `${i + 1}. ${t.titulo} · ${t.min} min`,
    onclick: () => irPara(i) }, String(i + 1))));
}

/* ---------- visão geral (G) ---------- */
const NOMES_BLOCO = ["Acolhida", "Bloco 1", "Bloco 2", "Bloco 3", "Bloco 4"];
function montarVisaoGeral() {
  TELAS.forEach((t, i) => Nav.els.vgGrade.append(h("button", { type: "button", class: "vg-item", style: `--c:var(--b${t.bloco})`,
    onclick: () => { fecharVisaoGeral(); irPara(i); } },
    h("span", { class: "n" }, `TELA ${i + 1} · ${t.intervalo}`), h("span", { class: "t" }, t.titulo), h("span", { class: "m" }, `${NOMES_BLOCO[t.bloco]} · ${t.min} min`))));
  document.getElementById("fechar-vg").addEventListener("click", fecharVisaoGeral);
}
function abrirVisaoGeral() { Nav.els.vg.hidden = false; Nav.els.vgGrade.children[Nav.indice].focus(); }
function fecharVisaoGeral() { Nav.els.vg.hidden = true; }

/* ---------- notas do instrutor (N) ---------- */
function atualizarNotas() {
  const t = TELAS[Nav.indice];
  Nav.els.notas.replaceChildren(h("strong", null, `📝 Notas do instrutor · Tela ${Nav.indice + 1}`), h("ul", null, t.notas.map(n => h("li", null, n))),
    h("span", { class: "ref" }, `Micro-Roteiro · Página ${t.pagina}`));
}
function alternarNotas() { Nav.els.notas.hidden = !Nav.els.notas.hidden; }
function alternarAjuda() { Nav.els.ajuda.hidden = !Nav.els.ajuda.hidden; }

/* ---------- teclado ---------- */
document.addEventListener("keydown", (ev) => {
  const alvo = ev.target;
  if (alvo && (alvo.tagName === "INPUT" || alvo.tagName === "TEXTAREA")) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  const k = ev.key;
  if (!Nav.els.vg.hidden) { if (k === "Escape") fecharVisaoGeral(); return; }
  const emBotao = alvo && (alvo.tagName === "BUTTON" || alvo.tagName === "LI");
  if (k === "ArrowRight" || k === "PageDown") { ev.preventDefault(); proximo(); }
  else if (k === " " && !emBotao) { ev.preventDefault(); proximo(); }
  else if (k === "ArrowLeft" || k === "PageUp") { ev.preventDefault(); anterior(); }
  else if (k === "Home") irPara(0);
  else if (k === "End") irPara(Nav.slides.length - 1);
  else if (/^[1-8]$/.test(k)) irPara(Number(k) - 1);
  else if (k === "g" || k === "G" || k === "Escape") abrirVisaoGeral();
  else if (k === "p" || k === "P") alternarCronometro();
  else if (k === "r" || k === "R") reiniciarCronometro();
  else if (k === "n" || k === "N") alternarNotas();
  else if (k === "?" || k === "h" || k === "H") alternarAjuda();
  else if (k === "f" || k === "F") { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});

/* ---------- # na URL (botão voltar, links diretos) ---------- */
window.addEventListener("hashchange", () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= Nav.slides.length && n - 1 !== Nav.indice) irPara(n - 1);
});
