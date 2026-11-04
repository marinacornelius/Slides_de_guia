# Slides-Guia · Painel Verde Garopaba (Curso 2) · SNCT 2026

Slides-Guia de **8 telas** da oficina *Painel Verde de Garopaba* (Programação para a Internet 2 · IFSC Câmpus Garopaba).
HTML + Bootstrap 5 + JavaScript puro, sem build: abre com duplo clique no `index.html` ou em GitHub Pages.

## Como usar

| Tecla | Ação |
|---|---|
| `←` `→` ou `Espaço` | navegar |
| `1`–`8` | ir direto à tela |
| `G` | visão geral das 8 telas |
| `N` | notas do instrutor (com a página do Micro-Roteiro) |
| `P` | cronômetro: iniciar / pausar (mostra tela, bloco e total da oficina) |
| `R` / `Shift`+`R` | zera a tela atual / zera a oficina inteira |
| `F` | tela cheia · `?` atalhos |

- `?modo=aluno`: todas as telas em coluna (celular/estudo).
- `?pesquisa=https://...`: define o QR da pesquisa de satisfação (Tela 8, Frente 4).
- `Ctrl+P`: imprime/gera PDF (A4 paisagem, 1 tela por página). Cópia pronta em `pdf/`.

## As 8 telas

| # | Tela | Tempo | Interação |
|---|---|---|---|
| 1 | Acolhida | 00–10 | QR do painel pronto, agenda, cartões verde/vermelho |
| 2 | Sala no Moodle | 10–15 | chave com copiar, passos que acendem o Moodle simulado |
| 3 | Bloco 1 · Título e cores | 15–35 | título e cor ao vivo: código e prévia mudam juntos |
| 4 | Bloco 2A · Novo ecoponto | 35–55 | botão “Esqueça a vírgula” mostra o erro mais comum |
| 5 | Bloco 2B · Filtros e mapa | 55–70 | celular simulado com os filtros |
| 6 | Bloco 3 · GitHub Pages | 70–95 | 4 etapas clicáveis + endereço `.github.io` ao vivo |
| 7 | Bloco 4 · QR Code e Mural | 95–110 | gerador de QR com download em PNG |
| 8 | Encerramento | 110–120 | conquistas, confete, QR da pesquisa |

Regras de projeção (6 m): máx. 12 linhas de código por tela · texto ≥ 1.35rem · código ≥ 20 px · a escala acompanha a tela.

## Estrutura

```
index.html          casca da página
css/estilo.css      tema, componentes, impressão
fonts/              Plus Jakarta Sans e JetBrains Mono (locais)
js/config.js        links (painel demo, Moodle, pesquisa)
js/dom.js           helper h() e componentes (editor de código, cartões)
js/componentes.js   QR Code, gerador, simulador, confete
js/telas.js         conteúdo das 8 telas
js/navegacao.js     passo a passo, timer, teclado, visão geral
js/app.js           inicialização
img/                fotos, GIFs e ícones
pdf/                cópia offline
```

## Créditos

- Foto de capa: *Panoramic view of Garopaba beach*, Heylenny, CC BY-SA 4.0 (Wikimedia Commons). Foto do encerramento: *Praia Vermelha, Garopaba*, Fronteira, CC BY-SA 4.0 (Wikimedia Commons).
- GIFs: [GIPHY](https://giphy.com) (selo FIZ IFSC do canal [@ifsc](https://giphy.com/ifsc)).
- Bibliotecas: Bootstrap 5.3.3, qrcodejs 1.0.0.
