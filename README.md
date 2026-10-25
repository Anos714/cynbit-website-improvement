# Cynbit Website Improvement

A secure, high-performance, content-driven rebuild of Cynbit Technologies' public website. The project is being developed as a Full Stack Developer Intern assessment deliverable.

## Local development

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## Quality gate

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` runs the full sequence.

## Documentation

- [Architecture](docs/architecture.md)
- [Technical report](docs/technical-report.md)
- [Deployment](docs/deployment.md)
- [Audit traceability](docs/audit-traceability.md)
