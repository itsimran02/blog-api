// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'html'], // terminal + HTML report
      reportOnFailure: true, // emit report even when tests fail
      // optional filters
      include: ['src/**'],
      exclude: ['test/**', '**/*.d.ts'],
      // quality gates
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
        perFile: false,
        // glob-specific overrides are supported:
        // 'src/utils/**.ts': { lines: 90, branches: 80 }
      },
    },

    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.ts'],
    exclude: ['test/setup.ts'],
  },
});
