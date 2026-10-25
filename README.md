# Velvet Alibi

A six-act, turn-based theatre escape for All Tools Allowed #3, theme TRICK. Created25October2026, entirely new work for this edition.

Leave one double on your tile, walk away, and trade places. Doubles hold marked switches, keep matching curtains open and block ushers' red sightlines. Only the real performer collects tickets and exits. Six distinct acts; keyboard/touch arrow controls, undo, restart, optional shortest hints, optional synthesized tones, no timer or stored progress.

Run `python -m http.server 4193` here and open http://127.0.0.1:4193. Tests: `npm test` with Node; no installation or dependencies. `engine.js` exports pure transitions and a finite BFS solver. State includes real/double positions and collected ticket mask. Unsafe moves are refused without changing state. Only uppercase A/B are curtains; lowercase a/b switches open their matching curtain while either character occupies them. Starting doubles in some acts are intentional.

OpenAI Codex generated the design, implementation, CSS art, synthesized-audio code, tests and writing under Aditya Mittal's authorization. No outside assets, fonts, packages, runtime model or old competition source incorporated. MIT license. Agent verification is not human playtesting or a claim of independent human coding.

Buildless static site. Upload index.html, style.css, engine.js, ui.js, LICENSE and this README as a root-level ZIP to itch.io and mark playable in browser. Test the hosted frame after upload. No secrets, network requests, analytics or personal-data storage in the game. Source link in footer points to the public repository.
