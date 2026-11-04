/* ==========================================================
   dom.js · ajudantes para montar a página com o DOM
   h("div", {class: "x"}, "texto", outroElemento)
   ========================================================== */
function h(tag, props, ...filhos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === false || v == null) continue;
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  filhos.flat(Infinity).forEach(f => {
    if (f == null || f === false) return;
    el.append(f.nodeType ? f : document.createTextNode(f));
  });
  return el;
}

/* atalhos de texto */
const forte = (...f) => h("strong", null, ...f);
const arq = (...f) => h("code", { class: "arq" }, ...f);
const tecla = (...f) => h("kbd", null, ...f);
const destaque = (...f) => h("span", { class: "destaque" }, ...f);

/* marca um elemento para aparecer no passo a passo (tecla S) */
const passo = (el) => { el.classList.add("passo"); return el; };

/* imagem da pasta img/ */
const imagem = (arquivo, classe, alt = "") =>
  h("img", { src: "img/" + arquivo, class: classe, alt, "aria-hidden": alt ? false : "true", loading: "lazy", onerror: (e) => e.target.remove() });
const icone = (nome, tam = 36) => h("img", { src: `img/icone-${nome}.svg`, class: "icone", width: tam, height: tam, alt: "", "aria-hidden": "true" });

/* lista numerada de passos; alvos[i] liga o passo a um elemento de pré-visualização */
function listaPassos(itens, classe = "") {
  return h("ol", { class: "passos " + classe }, itens.map(conteudo => passo(h("li", { tabindex: "0" }, h("span", { class: "txt" }, conteudo)))));
}

/* cartão genérico */
function cartao(tipo, rotulo, ...conteudo) {
  return passo(h("div", { class: "cartao " + tipo }, rotulo && h("span", { class: "rotulo" }, rotulo), ...conteudo));
}

/* barra superior de cada tela */
function topo(n, rotulo, intervalo) {
  return h("div", { class: "topo" },
    h("span", { class: "eyebrow" }, "Tela ", h("span", { class: "num" }, String(n)), "de 8 · " + rotulo, h("span", { class: "tempo" }, "· " + intervalo)),
    h("span", { class: "marca" }, h("img", { src: "img/logo-painel-verde.svg", alt: "" }), "Painel Verde · SNCT 2026"));
}

/* checkpoint de vitória: clique para cumprir (feedback + sticker) */
function checkpoint(...conteudo) {
  const el = passo(h("button", { type: "button", class: "checkpoint", "aria-pressed": "false", title: "Clique quando a turma cumprir o checkpoint" },
    h("span", { class: "selo" }, "✓"), h("span", { class: "rotulo" }, "Checkpoint"), h("span", null, ...conteudo)));
  el.addEventListener("click", () => {
    const feito = el.classList.toggle("feito");
    el.setAttribute("aria-pressed", String(feito));
    if (feito) mostrarSticker();
  });
  return el;
}

/* ---------- editor de código com realce de sintaxe, nº de linha e botão copiar ---------- */
const TOKENS = /(<!--.*?-->|\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(\b(?:const|let|var|function|return|if|else)\b)|(--[\w-]+)|(\b[\w-]+(?=:\s))|(<\/?[a-zA-Z0-9]+)|(=>)/g;
const CLASSES = ["", "tk-c", "tk-s", "tk-k", "tk-v", "tk-p", "tk-t", "tk-k"];
function colorirLinha(linha) {
  const frag = document.createDocumentFragment();
  let ultimo = 0, m;
  TOKENS.lastIndex = 0;
  while ((m = TOKENS.exec(linha))) {
    if (m.index > ultimo) frag.append(linha.slice(ultimo, m.index));
    const grupo = m.findIndex((v, i) => i > 0 && v !== undefined);
    frag.append(h("span", { class: CLASSES[grupo] }, m[0]));
    ultimo = m.index + m[0].length;
    if (m[0] === "") TOKENS.lastIndex++;
  }
  if (ultimo < linha.length) frag.append(linha.slice(ultimo));
  return frag;
}

function blocoCodigo(nomeArquivo, texto, opcoes = {}) {
  const code = h("code");
  const btn = h("button", { type: "button", class: "btn-copiar", "aria-label": "Copiar este código" }, "Copiar");
  const wrap = h("div", { class: "editor" },
    h("div", { class: "editor-topo" }, h("i"), h("i"), h("i"), h("span", { class: "nome" }, nomeArquivo), btn),
    h("pre", { "aria-label": "Código de " + nomeArquivo }, code));
  let atual = texto;
  wrap.definir = (novo, destacar = opcoes.destacar || [], erro = []) => {
    atual = novo;
    code.replaceChildren(...novo.split("\n").map((l, i) =>
      h("span", { class: "l" + (destacar.includes(i + 1) ? " hl" : "") + (erro.includes(i + 1) ? " erro" : "") }, colorirLinha(l), "​")));
  };
  btn.addEventListener("click", () => copiarTexto(atual, btn, "Copiar"));
  wrap.definir(texto);
  return passo(wrap);
}

function copiarTexto(texto, botao, rotuloOriginal) {
  const ok = () => {
    botao.classList.add("copiado");
    botao.firstChild.textContent = "Copiado ✓ ";
    setTimeout(() => { botao.classList.remove("copiado"); botao.firstChild.textContent = rotuloOriginal; }, 1400);
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(texto).then(ok, () => {});
  else {
    const t = h("textarea", { "aria-hidden": "true" }); t.value = texto; document.body.append(t); t.select();
    try { document.execCommand("copy"); ok(); } catch (e) { /* sem permissão: ignora */ }
    t.remove();
  }
}

/* janela de navegador (pré-visualização) */
function navegador(url, ...conteudo) {
  return h("div", { class: "navegador" },
    h("div", { class: "navegador-topo" }, h("i"), h("i"), h("i"), h("span", { class: "url" }, url)),
    h("div", { class: "navegador-corpo" }, ...conteudo));
}
