# Hanged man game

This is an assignment where I'm demonstrating my knowledge within the JS echo system.

## Tech stack

The is a mono repo using pnpm as package manager, and has a backend app in node and a frontend app that's using React.

### Backend

- Buildtool: [EsBuild](https://esbuild.github.io/)
- Server: [Fastify](https://fastify.dev/)
- Ts-node for compilation of typescript

### Frontend

- Buildtool: [Vite](https://vitejs.dev/)
- Dependencies:
  - Axios: Request

### Hangedman types

- Just a demonstration of how to share types between frontend and backend

## Get started

### Installation

1. Make sure you got pnpm installed by checking your version with the command `pnpm -v`. If it's not installed run the by running `brew install pnpm` on Mac. [Installation for Windows user](https://pnpm.io/installation#on-windows)
2. Run `pnpm i` to install dependencies for the project

### Development

1. Run `pnpm dev` to start frontend and backend app.
2. Visit `http://localhost:1337`

### Build

1. Run `pnpm build:stack` to build frontend and backend app.
2. Run `pnpm start:stack` to start frontend and backend app.
3. Visit `localhost:3030`