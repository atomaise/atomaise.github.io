# AtomAIse website

AtomAIse is an open catalogue of datasets, models, benchmarks, software and tutorials for sprays and multiphase flows.

## Edit the catalogue

Resource records live in `dist/assets/resources.json`. Adding a record there automatically makes it searchable on the website.

## Publish with GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the `dist` directory whenever the `main` branch changes. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

Before launch, set the public repository URL in `dist/assets/site-config.js` so the contribution and source-code links appear.
