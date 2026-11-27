// Configuração do ESLint (flat config) para o projeto CommonJS do LAB40.
const js = require("@eslint/js");
const globals = require("globals");
const { defineConfig, globalIgnores } = require("eslint/config");

module.exports = defineConfig([
  globalIgnores(["node_modules/", "coverage/", "dist/"]),
  js.configs.recommended,
  {
    name: "lab40/servidor",
    files: ["src/**/*.js", "test/**/*.js", "scripts/**/*.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: { ...globals.node }
    }
  },
  {
    name: "lab40/navegador",
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: { ...globals.browser }
    }
  }
]);
