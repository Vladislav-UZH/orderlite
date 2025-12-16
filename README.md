````md
# OrderLite

React + Vite застосунок для оформлення замовлень (menu → checkout → order status) з ролями **customer/admin**.

## Stack
- React, TypeScript, Vite
- React Router
- ESLint (flat config) + Prettier
- Husky (git hooks)
- Cypress: component (unit) tests + E2E tests
- Code coverage (Cypress support)
- Node/Express API (папка `server/`) для локального запуску / деплою “все разом”

## Project structure
- `src/` — frontend (React)
- `server/` — backend (Node/Express)
- `cypress/component/` — component(unit) tests
- `cypress/e2e/` — E2E tests
- `cypress/support/` — commands/mount/coverage
- `.husky/` — git hooks

## Setup
```bash
npm install
````

## Run (local)

```bash
npm run dev
```

## Tests

Component tests:

```bash
npx cypress run --component
```

E2E tests:

```bash
npx cypress run
```

## Author

Перебзяк Владислав, ФІТ, 3 курс, Комп’ютерні науки (2025)

