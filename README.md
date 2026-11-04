# Fichines

Página que reúne los juegos de Scila Feuersturm:

- [Gat-Huno](https://gat-huno.onrender.com): gatos que se pelean en las terrazas.
- [Martian Arts](https://martian-arts.onrender.com): marcianos que pelean con artes marciales.
- [Facón y Pampa](https://facon-y-pampa.onrender.com): duelos de esgrima criolla.

Todo está en `public/index.html` (las capturas van incrustadas). En Render: Static Site, sin build command, con `public` como publish directory.
# Fichines

## Amigos del taller · Forma Marcial

Juego de ritmo de Wing Tsun en `public/forma-marcial/`, inspirado en la mecánica de Nono Farmer. HTML, CSS y JavaScript sin build. Publicar `public` como antes en Render. Para probar: `python3 -m http.server 8080 --directory public`.

- Flechas que se desplazan hacia el círculo: flechas del teclado, WASD o botones táctiles.
- Dos velocidades (80 y 96 BPM), secuencia de 64 movimientos, puntaje, rachas y energía. La partida siempre permite terminar la forma.
- Dos personajes originales en pixel art, con poses basadas en la secuencia y el video suministrados. No se incluye ni publica el video de referencia.
- Música original sintetizada en el navegador y efectos independientes, desactivables.
- P o Escape pausa. Al salir de la pestaña o perder foco se pausa automáticamente.
- Al completar: clase gratis, enlace y QR local a https://www.instagram.com/irkadefact/. QR decodificado y verificado.
- No recoge datos; el récord se guarda en localStorage del navegador.
- `engine.js`: reloj y juicios; `sequence.js`: secuencia; `game.js`: escena, controles y audio; `style.css`: diseño.
