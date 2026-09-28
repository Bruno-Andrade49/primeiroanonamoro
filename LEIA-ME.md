# Bruno & Maria Luisa · 1 ano 💙💛

Site estático (HTML + CSS + JS), sem build. As animações usam GSAP + ScrollTrigger + Lenis, que ficam na pasta `vendor/` (funciona mesmo sem CDN).

## Ver no computador

```bash
cd ~/Documents/namoro
python3 -m http.server 5173
```

Depois é só abrir http://localhost:5173

## Onde editar

**Tudo fica em `js/data.js`**: textos dos meses, títulos, legendas das fotos, a carta e a mensagem final.

- **Texto de um mês:** preencha o `texto` do mês. Para separar parágrafos, use `\n\n`.
- **Fotos de um mês:** liste os nomes das fotos em `fotos: [...]`. Até 3 aparecem empilhadas; se houver mais, aparece um botão “+N fotos”.
- **Foto nova:**
  1. Coloque o arquivo em `assets/fotos/nome.jpg`, com no máximo uns 1600px de largura.
  2. Coloque uma cópia menor, de uns 640px, em `assets/fotos/thumbs/nome.jpg`.
  3. Cadastre a foto em `fotos` no `data.js`, com legenda, `alt`, largura (`w`) e altura (`h`).
- **Música:** coloque um mp3 em `assets/` e preencha `musica: "assets/arquivo.mp3"`. Aí aparece o botão de disco no topo, e a música começa quando ela abre a carta.