# Contributing to AtomAIse

The easiest way to suggest a resource is to open a **Suggest a resource** issue. The structured form asks for the minimum information needed to review an entry.

Contributors who are comfortable editing JSON may instead update `dist/assets/resources.json` and open a pull request. Keep each record concise, link to the original maintained source, and do not copy data or software into this repository.

## Catalogue fields

- `id`: short, unique, lowercase identifier
- `title`: official resource name
- `summary`: plain-language scientific description
- `types`: one or more of Dataset, Model, Benchmark, Software, Tutorial
- `flows`: physical systems or flow classes
- `methods`: Experimental, Numerical, Machine learning, or another clear method
- `outputs`: important variables, artefacts or predictions
- `access`: Open, Registration required, Restricted, or Commercial
- `status`: Available, In preparation, or Archived
- `provider`: authors, project or maintaining organisation
- `url`: stable original URL
- `featured`: whether the entry appears on the homepage

## Review

Catalogue maintainers check relevance, link stability, basic metadata and clarity. Inclusion does not certify scientific quality or endorse the conclusions of the linked work.
