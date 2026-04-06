import { execSync } from 'node:child_process';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function promptCatalogPlugin(): Plugin {
  const promptsDir = path.resolve(import.meta.dirname, 'prompts');
  const catalogPath = path.join(promptsDir, 'catalog.json');

  function rebuild() {
    execSync('tsx tools/xprompt/src/cli.ts build', {
      cwd: import.meta.dirname,
      stdio: 'inherit',
    });
  }

  return {
    name: 'prompt-catalog-watch',
    configureServer(server) {
      server.watcher.add(path.join(promptsDir, 'atoms'));
      server.watcher.add(path.join(promptsDir, 'composites'));

      server.watcher.on('change', (file) => {
        if (file.startsWith(promptsDir) && file.endsWith('.md')) {
          rebuild();
          const mod = server.moduleGraph.getModuleById(catalogPath);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: 'full-reload' });
          }
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), promptCatalogPlugin()],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        prompt: path.resolve(import.meta.dirname, 'prompt/index.html'),
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-dom/client'],
          'vendor-motion': ['motion'],
        },
      },
    },
  },
});
