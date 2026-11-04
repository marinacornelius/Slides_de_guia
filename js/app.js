/* ==========================================================
   app.js · inicialização (carregado por último)
   ========================================================== */
montarTelas();
montarLinhaTempo();
montarVisaoGeral();

document.getElementById("btnAnterior").addEventListener("click", anterior);
document.getElementById("btnProximo").addEventListener("click", proximo);
document.getElementById("cronometro").addEventListener("click", alternarCronometro);
document.getElementById("btnAjuda").addEventListener("click", alternarAjuda);

const inicio = parseInt(location.hash.slice(1), 10);
const comHash = inicio >= 1 && inicio <= Nav.slides.length;
irPara(comHash ? inicio - 1 : 0);
