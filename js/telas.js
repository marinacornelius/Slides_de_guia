/* ==========================================================
   telas.js · conteúdo das 8 telas (Tabela 3 do roteiro · Curso 2)
   Cada tela: bloco (cor), min (duração), intervalo, pagina do
   Micro-Roteiro, notas do instrutor (tecla N) e render().
   Regras de projeção: <= 12 linhas de código · texto >= 1.35rem
   ========================================================== */

/* liga cada passo (li) a um elemento da pré-visualização: ao passar o mouse/foco, o alvo acende */
function ligarFoco(lista, alvos) {
  [...lista.children].forEach((li, i) => {
    const alvo = alvos[i];
    if (!alvo) return;
    const on = () => alvo.classList.add("foco");
    const off = () => alvo.classList.remove("foco");
    li.addEventListener("mouseenter", on); li.addEventListener("mouseleave", off);
    li.addEventListener("focus", on); li.addEventListener("blur", off);
  });
  return lista;
}

const numero = (n, rotulo) => h("span", { class: "numero" }, h("b", null, n), rotulo);

const TELAS = [
  /* ---------------- TELA 1 · ACOLHIDA ---------------- */
  {
    rotulo: "Acolhida", titulo: "Acolhida", bloco: 0, min: 10, intervalo: "00–10 min", pagina: 1, classe: "capa",
    notas: ["Receba a turma com esta tela já projetada.", "Peça para apontarem a câmera do celular para o QR: é o resultado que vão construir.",
            "Avise que o apoio de bancada circula pela sala durante os blocos práticos."],
    render: () => [
      h("div", { class: "capa-grade" },
        h("div", null,
          h("h1", null, "Painel Verde de Garopaba", h("span", { class: "destaque" }, "no ar em 120 minutos")),
          h("p", { class: "lead" }, "Coleta seletiva e ecopontos · ", forte("SNCT 2026"), " · IFSC Câmpus Garopaba. Hoje você publica ", forte("o seu site"), " e o abre no celular por QR Code."),
          passo(h("div", { class: "numeros" }, numero("4", "blocos práticos"), numero("0", "instalações"), numero("1", "site seu, no ar")))),
        passo(h("div", { class: "qr-card" },
          caixaQr(CONFIG.painelDemo, 300, false),
          h("p", { class: "legenda" }, "📱 Aponte a câmera e veja o painel pronto"),
          h("p", { class: "link-curto" }, CONFIG.painelDemo.replace("https://", ""))))),
      passo(h("div", { class: "agenda", "aria-label": "Agenda da oficina" },
        [["Acolhida", "00–15 min", 0], ["Bloco 1", "15–35 min", 1], ["Bloco 2", "35–70 min", 2], ["Bloco 3", "70–95 min", 3], ["Bloco 4", "95–110 min", 4], ["Fim", "110–120 min", 0]]
          .map(([t, m, b]) => h("div", { class: "etapa", style: `--c:${["#3ddc84", "#5db4ff", "#b79bff", "#ffb35c", "#ff8db3"][b]}` }, t, h("small", null, m))))),
      h("p", { class: "credito" }, "Foto: Heylenny · CC BY-SA 4.0 · ", h("a", { href: "https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Garopaba_beach.jpg", target: "_blank", rel: "noopener" }, "Wikimedia Commons"))
    ]
  },

  /* ---------------- TELA 2 · MOODLE ---------------- */
  {
    rotulo: "Sala no Moodle", titulo: "Sala no Moodle", bloco: 0, min: 5, intervalo: "10–15 min", pagina: 1,
    notas: ["Mostre o caminho na tela do professor e espere todos entrarem.", "A chave SNCT2026 copia com um clique.",
            "Quem não achou o PDF: ele está na Seção 0 (Geral)."],
    render: () => {
      const linha = (ic, t) => h("div", { class: "mock-linha" }, h("span", { class: "ic" }, ic), t);
      const titulo = h("p", { class: "mock-titulo" }, "SNCT 2026 — Oficina: Painel Verde Garopaba");
      const pdf = linha("📄", "Micro-Roteiro (PDF)");
      const zip = linha("📦", "starter-kit-painel-verde.zip");
      const chave = chipCopiar("SNCT2026");
      const lista = listaPassos([
        ["Acesse ", forte("moodle.ifsc.edu.br"), " e abra a sala do ", forte("Curso 2")],
        ["Chave de inscrição: ", chave],
        ["Na ", forte("Seção 0"), ": abra o ", forte("Micro-Roteiro (PDF)")],
        ["Na ", forte("Seção 1"), ": baixe ", arq("starter-kit-painel-verde.zip")]
      ]);
      ligarFoco(lista, [titulo, chave, pdf, zip]);
      return [
        h("h2", { class: "titulo" }, "Entre na ", destaque("sala do Curso 2"), " no Moodle"),
        h("div", { class: "corpo c2" },
          h("div", { class: "pilha" }, lista),
          h("div", { class: "pilha" },
            passo(navegador("moodle.ifsc.edu.br/course/view.php?id=2664", titulo,
              h("div", { class: "mock-sec" }, "Seção 0 · Geral"), pdf,
              h("div", { class: "mock-sec" }, "Seção 1"), zip,
              h("div", { class: "mock-sec" }, "Seção 4"), linha("💬", "Mural do Curso 2"))),
            passo(h("div", { class: "cartao dica", style: "display:flex;align-items:center;gap:1.4rem" },
              caixaQr(CONFIG.moodle, 120, true),
              h("div", null, h("span", { class: "rotulo" }, "Prefere o celular?"), "Aponte a câmera para abrir a sala do Curso 2 no Moodle IFSC.")))))
      ];
    }
  },

  /* ---------------- TELA 3 · BLOCO 1 ---------------- */
  {
    rotulo: "Bloco 1", titulo: "Bloco 1 · Título e cores", bloco: 1, min: 20, intervalo: "15–35 min", pagina: 1,
    notas: ["Mostre a pasta extraída antes de abrir o index.html.", "Use os controles da tela para decidir título e cor, depois cada um edita o seu arquivo.",
            "Checkpoint: todos apertam F5 e enxergam o próprio título."],
    render: () => {
      let titulo = "Onde Descartar em Garopaba?", cor = "#15803d";
      const html = () => `<span class="selo-ambiental">SNCT 2026 · Garopaba Sustentavel</span>\n<h1>${titulo}</h1>`;
      const css = () => `:root {\n  --verde-principal: ${cor};\n  --fundo-pagina: #f0fdf4;\n  --fundo-cartao: #ffffff;\n  --texto-escuro: #1e293b;\n}`;
      const edHtml = blocoCodigo("index.html", html(), { destacar: [2] });
      const edCss = blocoCodigo("css/estilo.css", css(), { destacar: [2] });
      const previa = h("div", { class: "previa-site", style: `--cor:${cor}` },
        h("div", { class: "cab" }, h("small", null, "SNCT 2026"), h("strong", null, titulo)),
        h("div", { class: "cards" }, h("span"), h("span"), h("span")));
      const campoTitulo = h("input", { type: "text", id: "campoTitulo", value: titulo, maxlength: "40", "aria-label": "Título do seu painel" });
      const seletor = h("input", { type: "color", id: "campoCor", value: cor, "aria-label": "Cor principal" });
      const atualizar = () => {
        titulo = campoTitulo.value || "Seu título aqui"; cor = seletor.value;
        edHtml.definir(html(), [2]); edCss.definir(css(), [2]);
        previa.style.setProperty("--cor", cor); previa.querySelector("strong").textContent = titulo;
      };
      campoTitulo.addEventListener("input", atualizar); seletor.addEventListener("input", atualizar);
      return [
        h("h2", { class: "titulo" }, "Baixe o kit e personalize ", destaque("título e cores")),
        h("div", { class: "corpo c2" },
          h("div", { class: "pilha" },
            listaPassos([
              ["Extraia ", arq("starter-kit-painel-verde.zip")],
              ["Abra ", arq("index.html"), " com duplo clique"],
              ["Edite o título no ", arq("index.html")],
              ["Troque a cor no ", arq("css/estilo.css")]
            ], "compacto"),
            passo(h("pre", { class: "cartao arvore", "aria-label": "Estrutura de pastas" },
              "starter-kit-painel-verde/\n├─ ", h("b", null, "index.html"), "\n├─ css/", h("b", null, "estilo.css"), "\n├─ js/app.js\n└─ README.md"))),
          h("div", { class: "pilha" },
            passo(h("div", { class: "controles" },
              h("label", { for: "campoTitulo" }, "Título"), campoTitulo, h("label", { for: "campoCor" }, "Cor"), seletor)),
            edHtml, edCss, passo(previa))),
        checkpoint("Salve, aperte ", tecla("F5"), " e veja ", forte("o seu título e a sua cor"), " no navegador.")
      ];
    }
  },

  /* ---------------- TELA 4 · BLOCO 2A ---------------- */
  {
    rotulo: "Bloco 2A", titulo: "Bloco 2A · Novo ecoponto", bloco: 2, min: 20, intervalo: "35–55 min", pagina: 2,
    notas: ["Digite junto com a turma, narrando cada linha em voz alta.", "Clique em “Esqueça a vírgula” para mostrar o erro mais comum antes de ele acontecer.",
            "Lembre: a categoria precisa ser igual ao texto de um botão."],
    render: () => {
      const corpo = (ok) => `        mapaUrl: "https://maps.app.goo.gl/r5PxGL6jaeWf9rwJ7"\n    }${ok ? "," : ""}\n    {\n        nome: "Meu Ecoponto",\n        bairro: "Meu Bairro",\n        categoria: "Oleo",\n        horario: "Sabados, 09h as 13h",\n        mapaUrl: "https://maps.google.com/?q=Garopaba"\n    }\n];`;
      const editor = blocoCodigo("js/app.js · fim da lista LOCAIS_COLETA", corpo(true), { destacar: [2] });
      const resultado = h("div", { class: "pilha" });
      let ok = true;
      const botao = h("button", { type: "button", class: "btn-acao perigo" }, "💥 Esqueça a vírgula");
      const pintar = () => {
        editor.definir(corpo(ok), ok ? [2] : [], ok ? [] : [2]);
        resultado.replaceChildren(...(ok
          ? [h("div", { class: "eco-card" }, icone("reciclaveis", 34), h("div", null, h("strong", null, "Ponto Verde IFSC"), h("span", null, "Campo D'Una · Seg a Sex"))),
             h("div", { class: "eco-card novo" }, icone("oleo", 34), h("div", null, h("strong", null, "Meu Ecoponto"), h("span", null, "Meu Bairro · Sábados, 09h às 13h")))]
          : [h("div", { class: "painel-erro" }, h("code", null, "SyntaxError: Unexpected token '{'"), "A lista inteira parou de funcionar. Volte e coloque a vírgula!")]));
        botao.textContent = ok ? "💥 Esqueça a vírgula" : "🩹 Corrigir";
        botao.classList.toggle("perigo", ok);
      };
      botao.addEventListener("click", () => { ok = !ok; pintar(); });
      pintar();
      return [
        h("h2", { class: "titulo" }, "Cadastre um ", destaque("novo ecoponto"), " no array"),
        h("p", { class: "sub" }, "Em ", arq("js/app.js"), " · lista ", arq("LOCAIS_COLETA"), " · ", forte("no final"), ", antes do ", arq("];")),
        h("div", { class: "corpo c2c" },
          h("div", { class: "pilha" }, editor,
            passo(h("div", { style: "display:flex;align-items:center;gap:1.4rem" }, botao,
              h("span", { style: "font-size:1.45rem" }, forte("Erro nº 1:"), " esquecer a vírgula depois do ", arq("}"))))),
          h("div", { class: "pilha" },
            passo(h("div", { class: "cartao" }, h("span", { class: "rotulo" }, "Resultado no painel"), resultado)),
            cartao("", "Categoria igual ao botão", h("div", { class: "etiquetas" }, CATEGORIAS.slice(1).map(([c]) => h("span", null, icone(c.toLowerCase(), 26), c)))))),
        checkpoint("Salve, aperte ", tecla("F5") , " e o ", forte("seu ecoponto"), " aparece em um novo cartão.")
      ];
    }
  },

  /* ---------------- TELA 5 · BLOCO 2B ---------------- */
  {
    rotulo: "Bloco 2B", titulo: "Bloco 2B · Filtros e mapa", bloco: 2, min: 15, intervalo: "55–70 min", pagina: 2,
    notas: ["Deixe a turma clicar no simulador antes de explicar o .filter().", "Peça que cada um abra o link do Google Maps do próprio ecoponto.",
            "Se o filtro “Oleo” ficar vazio, é porque ainda não há item dessa categoria: volte à Tela 4."],
    render: () => [
      h("h2", { class: "titulo" }, "Teste os ", destaque("filtros"), " e o link do ", destaque("Google Maps")),
      h("div", { class: "corpo c2b" },
        h("div", { class: "pilha" },
          blocoCodigo("index.html · cada botão", `<button class="btn-filtro"\n  onclick="filtrarEcopontos('Vidro')">Vidro</button>`, { destacar: [2] }),
          blocoCodigo("js/app.js · o filtro", `const filtrados = categoriaEscolhida === "Todos"\n    ? LOCAIS_COLETA\n    : LOCAIS_COLETA.filter(item => item.categoria === categoriaEscolhida);`, { destacar: [3] }),
          cartao("dica", "Como funciona", arq(".filter()"), " guarda ", forte("só"), " os locais cuja categoria é igual ao botão clicado.")),
        h("div", { class: "pilha" }, simuladorFiltro(), passo(h("p", { class: "dica-clique" }, "👆 Clique em “Oleo de Cozinha”: ainda não há nenhum!")))),
      checkpoint("Todos os filtros respondem e o ", forte("mapa abre no local certo"), ".")
    ]
  },

  /* ---------------- TELA 6 · BLOCO 3 ---------------- */
  {
    rotulo: "Bloco 3", titulo: "Bloco 3 · GitHub Pages", bloco: 3, min: 25, intervalo: "70–95 min", pagina: 3,
    notas: ["Momento de mais dúvidas: circule pela sala e use os cartões de ajuda.", "Se aparecer 404, quase sempre o index.html está dentro de uma pasta.",
            "O Pages leva cerca de 1 minuto: aproveite para pausar e perguntar quem já terminou.",
            "Clique em cada etapa para marcar o avanço da turma."],
    render: () => {
      const dados = [
        ["Crie o repositório", [forte("github.com"), " → ", forte("New repository"), " · nome ", arq("painel-verde"), " · ", forte("Public")]],
        ["Envie os arquivos", [forte("uploading an existing file"), " → arraste ", arq("index.html"), ", ", arq("css/"), " e ", arq("js/"), " → ", forte("Commit")]],
        ["Ative o Pages", [forte("Settings → Pages"), " → Branch ", arq("main"), " ", arq("/(root)"), " → ", forte("Save")]],
        ["Abra o endereço", ["Aguarde ~1 min e abra o link ", arq(".github.io")]]
      ];
      const barra = h("span");
      const feitos = new Set();
      const cards = dados.map(([t, d], i) => {
        const b = h("button", { type: "button", class: "etapa-card", "aria-pressed": "false" }, h("div", { class: "n" }, String(i + 1)), h("h3", null, t), h("p", null, ...d));
        b.addEventListener("click", () => {
          const on = b.classList.toggle("feito"); b.setAttribute("aria-pressed", String(on));
          b.firstChild.textContent = on ? "✓" : String(i + 1);
          on ? feitos.add(i) : feitos.delete(i);
          barra.style.width = (feitos.size / 4 * 100) + "%";
          if (feitos.size === 4) mostrarSticker();
        });
        return passo(b);
      });
      const usuario = h("input", { class: "input-usuario", value: "SEU-USUARIO", maxlength: "30", "aria-label": "Seu usuário do GitHub" });
      const url = h("p", { class: "url-viva" });
      const pintarUrl = () => url.replaceChildren("https://", h("span", { class: "u" }, usuario.value || "SEU-USUARIO"), ".github.io/painel-verde/");
      usuario.addEventListener("input", pintarUrl); pintarUrl();
      return [
        h("h2", { class: "titulo" }, "Suba no ", destaque("GitHub"), " e ative o ", destaque("Pages")),
        h("div", { class: "etapas" }, cards),
        passo(h("div", { class: "progresso-etapas", role: "progressbar", "aria-label": "Etapas concluídas pela turma" }, barra)),
        h("div", { class: "corpo c2b", style: "align-items:start" },
          passo(h("div", { class: "cartao com-gif" },
            imagem("terra.gif", "", "Planeta Terra sorrindo"),
            h("div", null, h("span", { class: "rotulo" }, "Seu endereço no mundo"), usuario, url, h("span", { class: "cred" }, "GIF via GIPHY")))),
          cartao("alerta", "Erro 404?", arq("index.html"), " precisa estar na ", forte("raiz"), " do repositório, não dentro de uma pasta. Confira também se o Pages está em ", arq("main"), ".")),
        checkpoint("Seu painel abre em ", forte(".github.io"), ", e não pelo arquivo do computador.")
      ];
    }
  },

  /* ---------------- TELA 7 · BLOCO 4 ---------------- */
  {
    rotulo: "Bloco 4", titulo: "Bloco 4 · QR Code e Mural", bloco: 4, min: 15, intervalo: "95–110 min", pagina: 4,
    notas: ["Cada aluno cola a própria URL .github.io no gerador.", "Peça que testem o QR no celular do colega ao lado.",
            "O Mural do Curso 2 fica na Seção 4 do Moodle e é criado pelas Frentes 1 e 4: confirme que ele existe antes da oficina.", "Se aparecer o aviso amarelo, falta o link do Mural: abra os slides com ?mural=LINK."],
    render: () => [
      h("h2", { class: "titulo" }, "Gere o ", destaque("QR Code"), " e poste no ", destaque("Mural")),
      h("div", { class: "corpo c2b" },
        h("div", { class: "pilha" },
          listaPassos([
            ["Cole a ", forte("URL .github.io"), " do seu painel no gerador"],
            ["Clique em ", forte("Baixar PNG")],
            ["No Moodle (", forte("Seção 4"), "), abra o ", CONFIG.mural ? h("a", { href: CONFIG.mural, target: "_blank", rel: "noopener" }, forte("Mural do Curso 2")) : forte("Mural do Curso 2"), " e poste ", forte("QR + link")],
            ["Teste no ", forte("celular de um colega"), " 📱"]
          ]),
          cartao("dica", "Dica", "Se o QR abrir em branco, volte à Tela 6: o link ainda não está no ar."),
          !CONFIG.mural && h("div", { class: "aviso-config" }, "⚠️ Falta o link do Mural na Seção 4 (Frentes 1 e 4). Use ", h("code", null, "?mural=LINK"), " na URL.")),
        h("div", { class: "pilha" }, geradorQr())),
      checkpoint("O Painel Verde abre no ", forte("celular de outra pessoa"), " pelo QR Code.")
    ]
  },

  /* ---------------- TELA 8 · ENCERRAMENTO ---------------- */
  {
    rotulo: "Encerramento", titulo: "Encerramento e pesquisa", bloco: 0, min: 10, intervalo: "110–120 min", pagina: 4, classe: "final",
    notas: ["Agradeça e peça para escanearem o QR da pesquisa de satisfação.", "Marque as conquistas com a turma: cada clique é uma vitória.",
            "Se o QR não aparece, falta o link da Frente 4: use ?pesquisa=LINK na URL."],
    render: () => {
      const total = 3;
      const lista = h("ul", { class: "conquistas" });
      const anel = h("div", { class: "anel" }, h("b", null, "0/3"));
      ["Personalizou o Painel Verde", "Cadastrou um ecoponto de Garopaba", "Publicou na internet e gerou o QR Code"].forEach(t => {
        const li = h("li", { tabindex: "0", role: "checkbox", "aria-checked": "false" }, h("span", { class: "caixa" }, "✓"), t);
        const alternar = () => {
          const marcado = li.classList.toggle("feito");
          li.setAttribute("aria-checked", String(marcado));
          const n = lista.querySelectorAll(".feito").length;
          anel.style.setProperty("--p", n / total * 100); anel.firstChild.textContent = `${n}/${total}`;
          if (marcado) mostrarSticker();
          if (n === total) lancarConfete();
        };
        li.addEventListener("click", alternar);
        li.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); alternar(); } });
        lista.append(li);
      });
      const caixa = h("div", { class: "qr-caixa" });
      const temQr = criarQr(caixa, CONFIG.pesquisa, 220);
      return h("div", { class: "corpo c2c", style: "align-items:center" },
        h("div", { class: "pilha", style: "gap:1.6rem" },
          h("h2", { class: "titulo" }, "Missão cumprida! ", h("br"), destaque("Conte como foi.")),
          h("p", { class: "sub", style: "margin:0" }, "Responda a ", forte("pesquisa de satisfação"), " (2 minutos). O link também está na ", forte("Seção 4"), " da sala do Curso 2."),
          passo(h("div", { class: "linha-anel" }, anel, h("strong", { style: "font-size:1.5rem" }, "Marque o que você conquistou hoje:"))),
          passo(lista)),
        h("div", { class: "final-lado" },
          passo(h("div", { class: "qr-card", style: "animation:none" }, caixa, h("p", { class: "legenda" }, "📱 Pesquisa de satisfação"),
            !temQr && h("div", { class: "aviso-config" }, "⚠️ Falta o link da pesquisa (Frente 4). Use ", h("code", null, "?pesquisa=LINK"), " na URL."))),
          passo(h("div", { class: "linha-gif" },
            h("div", { class: "tile" }, imagem("futuro-verde.gif", "", "O futuro é verde"), h("span", { class: "cred" }, "GIF via GIPHY")),
            h("div", { class: "tile foguete" }, imagem("foguete-ifsc.gif", "", "Foguete do IFSC"), h("span", { class: "cred" }, "GIF via GIPHY"))))));
    }
  }
];

/* chave copiável (Tela 2) */
function chipCopiar(texto) {
  const b = h("button", { type: "button", class: "chip-copiar", title: "Copiar chave" }, texto + " ", h("span", { "aria-hidden": "true" }, "⧉"));
  const original = b.firstChild.textContent;
  b.addEventListener("click", () => copiarTexto(texto, b, original));
  return b;
}
