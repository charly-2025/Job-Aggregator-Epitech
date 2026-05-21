# CI Choices

The project needs to have automation about files which are pushed on main. To be sure that everything is reliable. Espacially on the server start etc.
For example if someone push something on the main and the backend can't be start. The developer should instantly fix this issue.

Others CI tests such as linter is also useful but not much important as CI tests on server start , frontend start etc.

## 2. Decision

We decided to choose Github actions for the CI.

## 3. Why

- Trigger on push or PR
- No extern tool(s) to use
- Simple YML to write

---

## 4. How (Implémentation)

The CI pipeline is implemented using GitHub Actions and is automatically triggered on push and PR events targeting the main branch.
The goal is to validate the full application stack (frontend, backend, and infrastructure)

1 - Runs on a self-hosted runner and executes inside a container: `epitechcontent/epitest-docker:latest`

2 - Dependencies are installed separately for each layer:

Frontend: ./app/frontend → `npm ci`
Backend: ./app/backend → `npm ci`
Root project: `npm ci`

3 - The pipeline starts the full application stack:

Backend: `node index.js`
Frontend: `npm start`

4 -

---

## 5. Trade-offs

Lister les compromis acceptés :

- Avantages vs inconvénients
- Limites de la solution
- Dette technique potentielle
- Vendor lock-in éventuel
- Complexité vs flexibilité

> Exemple :
> L’utilisation de <outil CI> introduit un certain verrouillage fournisseur mais simplifie fortement la maintenance et la mise en place.

---

## 6. Evidence

Justifier la décision avec des éléments concrets :

- POC réalisés
- Benchmarks (temps de build, coût)
- Comparaison avec autres outils
- Retours d’équipe
- Documentation officielle

> Exemple :
> Un POC comparatif entre deux solutions CI a montré une réduction de 25% du temps de configuration avec <outil CI>.
