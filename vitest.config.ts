import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/components\/(.*)$/, replacement: path.resolve(__dirname, "src/components/$1") },
      { find: /^@\/content\/(.*)$/, replacement: path.resolve(__dirname, "src/content/$1") },
      { find: /^@\/data\/(.*)$/, replacement: path.resolve(__dirname, "src/data/$1") },
      { find: /^@\/lib\/(.*)$/, replacement: path.resolve(__dirname, "src/lib/$1") },
      { find: /^@\/scripts\/(.*)$/, replacement: path.resolve(__dirname, "scripts/$1") }
    ]
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"]
  }
});
