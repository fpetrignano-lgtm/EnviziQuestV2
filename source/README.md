# Envizi ESG Quest — V2.0

## Struttura

```
envizi-esg-quest/
└── source/               ← UNICA FONTE DI VERITÀ — modifica solo qui
    ├── src/
    │   ├── App.tsx       ← tutto il codice dell'app
    │   └── styles.css    ← tutto il CSS
    ├── public/
    │   ├── *.png         ← immagini degli scenari
    │   └── characters/   ← ritratti Marco e Luisa
    ├── dist/             ← generato da `npm run build`, NON modificare manualmente
    └── package.json
```

## Versioni

| Versione | Repository | URL |
|----------|-----------|-----|
| V1.0 | [envizi-quest](https://github.com/fpetrignano-lgtm/envizi-quest) | https://fpetrignano-lgtm.github.io/envizi-quest/ |
| V2.0 | [envizi-esg-quest](https://github.com/fpetrignano-lgtm/envizi-esg-quest) | https://fpetrignano-lgtm.github.io/envizi-esg-quest/ |

## Comandi

```bash
cd envizi-esg-quest/source

# Sviluppo locale con hot-reload
npm run dev

# Anteprima del build locale
npm run build && npx vite preview --port 4174
# → apri http://localhost:4174/envizi-esg-quest/

# Build standalone
npm run build
```

## Flusso di deploy (GitHub Pages)

1. Modifica `source/src/App.tsx` o `source/src/styles.css`
2. `git add . && git commit -m "descrizione" && git push`
3. GitHub Actions builda automaticamente da `source/` con `npm ci && npm run build`
4. GitHub Pages pubblica il contenuto di `source/dist`

**Configurazione GitHub Pages**:
- Source: `GitHub Actions`
- Workflow: `.github/workflows/deploy-pages.yml`
- Base path Vite: `/envizi-esg-quest/`
