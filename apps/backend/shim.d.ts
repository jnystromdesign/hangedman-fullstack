// Shim in order to make the esbuild-envfile-plugin not throwing type errors
declare module "env" {
  export const API_KEY: string;
  export const SESSION_KEY: string;
}
