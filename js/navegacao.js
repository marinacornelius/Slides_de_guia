/* ==========================================================
   navegacao.js · telas, cronômetro, linha do
   tempo, visão geral, notas do instrutor e teclado
   ========================================================== */
const Nav = {
  slides: [], indice: 0, usado: [], ultimo: 0, timer: null, rodando: false,
  els: {}
};
const CHAVE_TEMPO = "painelverde.tempo-usado";

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
  Nav.els.indTela = h("b", null, "Tela 1 / 8");
  Nav.els.indTotal = h("small", null, "");
  Nav.els.indicador.replaceChildren(Nav.els.indTela, Nav.els.indTotal);
  Nav.usado = lerTempoUsado();
}

/* ---------- botão "próxima" ---------- */
function atualizarBotao() {
  Nav.els.proximo.textContent = Nav.indice === Nav.slides.length - 1 ? "Fim ✓" : "Próxima tela →";
}

/* ---------- navegação ---------- */
function irPara(i) {
  tique();   /* os segundos já corridos ficam na tela que está saindo */
  Nav.slides[Nav.indice].classList.remove("ativo");
  Nav.indice = Math.max(0, Math.min(Nav.slides.length - 1, i));
  const s = Nav.slides[Nav.indice];
  s.classList.add("ativo"); s.scrollTop = 0;
  Nav.els.indTela.textContent = `Tela ${Nav.indice + 1} / ${Nav.slides.length}`;
  Nav.els.progresso.style.width = ((Nav.indice + 1) / Nav.slides.length * 100) + "%";
  Nav.els.progresso.style.background = getComputedStyle(s).getPropertyValue("--acento");
  [...Nav.els.tempo.children].forEach((b, k) => { b.classList.toggle("ativo", k === Nav.indice); b.classList.toggle("feito", k < Nav.indice); });
  try { history.replaceState(null, "", location.search + "#" + (Nav.indice + 1)); } catch (e) { /* ignora */ }
  pintarCronometro(); atualizarBotao(); atualizarNotas();
  if (Nav.indice === Nav.slides.length - 1) lancarConfete();
}
function proximo() { if (Nav.indice < Nav.slides.length - 1) irPara(Nav.indice + 1); }
function anterior() { if (Nav.indice > 0) irPara(Nav.indice - 1); }

/* ---------- cronômetro: tela, bloco e oficina inteira ----------
   O tempo gasto fica guardado por tela (Nav.usado, em segundos).
   Assim voltar a uma tela não zera nada, e as contas de bloco e de
   total saem da mesma fonte. A contagem usa o relógio (Date.now),
   então não atrasa se a aba ficar em segundo plano.                    */
const fmt = (s) => (s < 0 ? "−" : "") + String(Math.floor(Math.abs(s) / 60)).padStart(2, "0") + ":" + String(Math.abs(s) % 60).padStart(2, "0");
const segTela = (i) => TELAS[i].min * 60;
const soma = (lista, f) => lista.reduce((a, i) => a + f(i), 0);

/* telas vizinhas do mesmo bloco: Acolhida (1-2), Bloco 1 (3), Bloco 2 (4-5), Bloco 3 (6), Bloco 4 (7), Encerramento (8) */
function telasDoBloco(i) {
  const b = TELAS[i].bloco;
  let a = i, z = i;
  while (a > 0 && TELAS[a - 1].bloco === b) a--;
  while (z < TELAS.length - 1 && TELAS[z + 1].bloco === b) z++;
  return Array.from({ length: z - a + 1 }, (_, k) => a + k);
}
const nomeDoBloco = (i) => (TELAS[i].bloco ? NOMES_BLOCO[TELAS[i].bloco] : (i < 2 ? "Acolhida" : "Encerramento"));

function lerTempoUsado() {
  try {
    const v = JSON.parse(sessionStorage.getItem(CHAVE_TEMPO));
    if (Array.isArray(v) && v.length === TELAS.length && v.every(n => Number.isFinite(n))) return v;
  } catch (e) { /* sem armazenamento: começa do zero */ }
  return TELAS.map(() => 0);
}
function guardarTempoUsado() { try { sessionStorage.setItem(CHAVE_TEMPO, JSON.stringify(Nav.usado)); } catch (e) { /* ignora */ } }

function tique() {
  if (!Nav.rodando) return;
  const n = Math.floor((Date.now() - Nav.ultimo) / 1000);
  if (n < 1) return;
  Nav.ultimo += n * 1000;
  Nav.usado[Nav.indice] += n;
  guardarTempoUsado(); pintarCronometro();
}

function pintarCronometro() {
  const i = Nav.indice, grupo = telasDoBloco(i);
  const restTela = segTela(i) - Nav.usado[i];
  const restBloco = soma(grupo, segTela) - soma(grupo, k => Nav.usado[k]);
  const restTotal = soma(TELAS.map((_, k) => k), segTela) - soma(TELAS.map((_, k) => k), k => Nav.usado[k]);
  const c = Nav.els.cronometro;
  c.replaceChildren(
    h("span", { class: "c-tela" }, (Nav.rodando ? "⏸ " : "▶ ") + fmt(restTela)),
    h("span", { class: "c-bloco" + (restBloco < 0 ? " estourou" : "") }, `${nomeDoBloco(i)} · ${fmt(restBloco)}`));
  c.title = `Tela: ${fmt(restTela)} · ${nomeDoBloco(i)}: ${fmt(restBloco)} · Oficina: ${fmt(restTotal)}. Clique ou tecle P para ${Nav.rodando ? "pausar" : "iniciar"}`;
  c.classList.toggle("pausado", !Nav.rodando);
  c.classList.toggle("alerta", restTela <= 60 && restTela >= 0);
  c.classList.toggle("estourou", restTela < 0);
  Nav.els.indTotal.textContent = `Faltam ${fmt(restTotal)}`;
  Nav.els.indTotal.classList.toggle("estourou", restTotal < 0);
  [...Nav.els.tempo.children].forEach((b, k) => {
    b.style.setProperty("--p", Math.min(100, Nav.usado[k] / segTela(k) * 100) + "%");
    b.classList.toggle("passou", Nav.usado[k] > segTela(k));
  });
}
/* R zera a tela atual · Shift+R zera a oficina inteira */
function reiniciarCronometro(tudo) {
  if (tudo) Nav.usado = TELAS.map(() => 0); else Nav.usado[Nav.indice] = 0;
  Nav.ultimo = Date.now(); guardarTempoUsado(); pintarCronometro();
}
function alternarCronometro() {
  tique(); Nav.rodando = !Nav.rodando; clearInterval(Nav.timer);
  if (Nav.rodando) { Nav.ultimo = Date.now(); Nav.timer = setInterval(tique, 250); }
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
  else if (k === "r" || k === "R") reiniciarCronometro(ev.shiftKey);
  else if (k === "n" || k === "N") alternarNotas();
  else if (k === "?" || k === "h" || k === "H") alternarAjuda();
  else if (k === "f" || k === "F") { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});

/* ---------- # na URL (botão voltar, links diretos) ---------- */
window.addEventListener("hashchange", () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= Nav.slides.length && n - 1 !== Nav.indice) irPara(n - 1);
});
