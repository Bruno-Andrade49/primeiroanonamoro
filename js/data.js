/* =====================================================================
   CONTEÚDO DO SITE: para editar textos e fotos, mexa só neste arquivo 💛
   ---------------------------------------------------------------------
   • As fotos ficam em assets/fotos/ (e as miniaturas em assets/fotos/thumbs/).
   • Cada mês aponta para as fotos pelo nome do arquivo, sem o ".jpg".
   • Um "texto" vazio mostra o aviso "texto deste mês em breve…".
   • Para quebrar o texto em parágrafos, use "\n\n".
   ===================================================================== */

window.NAMORO = {
  ele: "Bruno",
  ela: "Maria Luisa",
  inicio: "2025-10-02T00:00:00-03:00",

  // Caminho de uma música (ex.: "assets/nossa-musica.mp3").
  // Se ficar vazio, o botão de música não aparece.
  musica: "",

  subtitulo: "Um ano de nós, e ainda é só o primeiro capítulo.",

  // Fotos que se revezam dentro do coração no topo do site
  capa: ["festa-abraco", "igreja", "sorriso", "ceu-azul", "arvore-natal"],

  fotos: {
    "festa-abraco": { legenda: "coladinhos", alt: "Bruno e Maria Luisa abraçados em uma festa à noite, ela de vestido azul", w: 1200, h: 1600, pos: "50% 45%" },
    "igreja":       { legenda: "de azul, a mais linda", alt: "Os dois de mãos dadas no corredor de uma igreja enfeitada com flores brancas", w: 1200, h: 1600, pos: "50% 50%" },
    "festa-luzes":  { legenda: "arrumadinhos", alt: "Os dois sob luminárias de palha e flores lilás em uma festa", w: 1200, h: 1548, pos: "50% 45%" },
    "cabine":       { legenda: "4 poses, 1 amor", alt: "Tirinha de cabine de fotos com quatro poses dos dois", w: 1200, h: 1600, pos: "50% 50%" },
    "festa-beijo":  { legenda: "beijinho roubado", alt: "Bruno dando um beijo na bochecha da Maria Luisa, que sorri de olhos fechados", w: 960, h: 1280, pos: "50% 40%" },
    "natal-luzes":  { legenda: "luzinhas de Natal", alt: "Selfie dos dois em frente a um túnel de luzes de Natal", w: 1200, h: 1600, pos: "50% 40%" },
    "arvore-natal": { legenda: "brilhando mais que a árvore", alt: "Os dois se olhando em frente a uma árvore de Natal gigante de luzes douradas", w: 1200, h: 1600, pos: "50% 70%" },
    "carnaval":     { legenda: "bloco de dois", alt: "Selfie dos dois sorrindo com abadás coloridos de carnaval", w: 900, h: 1600, pos: "50% 30%" },
    "show-beijo":   { legenda: "no meio da multidão, só você", alt: "Bruno beijando a bochecha da Maria Luisa em um show", w: 1200, h: 1600, pos: "50% 45%" },
    "van-gogh":     { legenda: "dentro de um quadro", alt: "Os dois de costas em uma exposição imersiva com amendoeiras em flor", w: 1200, h: 1600, pos: "50% 50%" },
    "filme":        { legenda: "em filme, do jeitinho que foi", alt: "Foto analógica dos dois rindo abraçados", w: 1067, h: 1600, pos: "50% 40%" },
    "por-do-sol":   { legenda: "o céu combinando com a gente", alt: "Selfie dos dois em frente a um lago no pôr do sol", w: 1600, h: 900, pos: "42% 60%" },
    "ceu-azul":     { legenda: "azul que nem a gente", alt: "Selfie dos dois com o céu azul ao fundo, ela com a cabeça no ombro dele", w: 900, h: 1600, pos: "50% 30%" },
    "cenario":      { legenda: "cenário de filme", alt: "Os dois em frente a uma fachada amarela com portas vermelhas", w: 1200, h: 1600, pos: "50% 45%" },
    "academia":     { legenda: "treino a dois", alt: "Selfie no espelho da academia", w: 1200, h: 1600, pos: "35% 55%" },
    "sofa":         { legenda: "preguicinha boa", alt: "Selfie dos dois deitados, sorrindo", w: 1600, h: 1200, pos: "62% 45%" },
    "sorriso":      { legenda: "meu sorriso favorito", alt: "Selfie dos dois bem sorridentes em casa", w: 1600, h: 1200, pos: "55% 40%" },
    "beijinho":     { legenda: "bochecha preferida", alt: "Bruno beijando a bochecha da Maria Luisa em casa", w: 900, h: 1600, pos: "45% 40%" },
    "careta":       { legenda: "os mais sérios do mundo", alt: "Os dois fazendo careta com a língua para fora", w: 1600, h: 1200, pos: "55% 40%" },
  },

  // Linha do tempo: um item por mês.
  // PROVISÓRIO: títulos e fotos abaixo são só um rascunho para visualizar
  // o layout. Troque pelos textos e fotos reais de cada mês.
  meses: [
    { mes: "Outubro",   ano: 2025, titulo: "O começo de nós",      texto: "", fotos: ["ceu-azul", "por-do-sol"] },
    { mes: "Novembro",  ano: 2025, titulo: "Descobrindo você",     texto: "", fotos: ["filme", "van-gogh"] },
    { mes: "Dezembro",  ano: 2025, titulo: "Nosso primeiro Natal", texto: "", fotos: ["arvore-natal", "natal-luzes", "cabine"] },
    { mes: "Janeiro",   ano: 2026, titulo: "Um ano novo a dois",   texto: "", fotos: ["igreja", "festa-luzes", "festa-abraco"] },
    { mes: "Fevereiro", ano: 2026, titulo: "Bloco de dois",        texto: "", fotos: ["carnaval"] },
    { mes: "Março",     ano: 2026, titulo: "No meio da multidão",  texto: "", fotos: ["show-beijo"] },
    { mes: "Abril",     ano: 2026, titulo: "Parceiros pra tudo",   texto: "", fotos: ["academia"] },
    { mes: "Maio",      ano: 2026, titulo: "Os dias comuns",       texto: "", fotos: ["sofa", "sorriso"] },
    { mes: "Junho",     ano: 2026, titulo: "Arraiá do amor",       texto: "", fotos: ["cenario"] },
    { mes: "Julho",     ano: 2026, titulo: "Rindo à toa",          texto: "", fotos: ["careta"] },
    { mes: "Agosto",    ano: 2026, titulo: "Cada vez mais nós",    texto: "", fotos: ["beijinho"] },
    { mes: "Setembro",  ano: 2026, titulo: "Quase um ano",         texto: "", fotos: ["festa-beijo"] },
  ],

  // RASCUNHO da carta: troque pelas suas palavras (cada item é um parágrafo).
  carta: [
    "Faz um ano que a minha vida ganhou as nossas cores: o azul e o amarelo que, de repente, viraram nossos.",
    "Obrigado por cada risada, cada careta, cada abraço apertado e por transformar os dias mais comuns nos meus preferidos.",
    "Se eu pudesse voltar no tempo, escolheria você de novo em cada mês dessa linha do tempo. E vou continuar escolhendo em todos os que ainda vêm.",
    "Feliz 1 ano, meu amor. Eu te amo.",
  ],

  // Mensagem que aparece quando ela aperta o botão no final do site
  final: "Eu te amo, Maria Luisa. Hoje, amanhã e em todos os próximos capítulos.",
};
