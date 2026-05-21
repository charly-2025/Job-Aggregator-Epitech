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

3 - Setup all environment variable

4 - The pipeline starts the full application stack thanks to the docker `docker compose up -d --build`

5 - Also installing pip and setup the python virtual environment to test the filling offers script.

6 - Linter tests and prettier checks

---

## 5. Trade-offs

Docker environment -> realistic tests / slower  
Several npm ci installs -> clean separation / redundant and slow
Manual .env files -> simple / easy to break
Self-hosted runner + container -> full control / environment-dependent (for example Epitech docker)
Single monolithic pipeline → simple to read / hard to maintain updated

---

## 6. Evidence
