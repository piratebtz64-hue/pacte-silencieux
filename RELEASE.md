# Release v1.0.0

Première publication automatique du dépôt « pacte-silencieux ». Cette release est un placeholder créé par Copilot.

## Détails
- Commit: https://github.com/piratebtz64-hue/pacte-silencieux/commit/0f23a6a1e2920acc40840448046f12b1d4434e43
- Pages branch: `gh-pages` (fichier `index.html` ajouté)
- Site (prévu): https://piratebtz64-hue.github.io/pacte-silencieux/

## Notes
Personnalise cette release en éditant ce fichier ou en créant une vraie release via l'interface GitHub ou la CLI :

- Avec GitHub CLI :
  gh release create v1.0.0 --title "v1.0.0" --notes "Première publication (placeholder)"

- Avec l'API :
  curl -X POST -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github+json" \
    https://api.github.com/repos/piratebtz64-hue/pacte-silencieux/releases \
    -d '{"tag_name":"v1.0.0","name":"v1.0.0","body":"Première publication (placeholder)"}'
