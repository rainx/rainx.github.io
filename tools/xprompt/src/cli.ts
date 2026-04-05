import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const PROMPTS_DIR = path.join(REPO_ROOT, 'prompts');

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'build': {
      const { runBuild } = await import('./commands/build.js');
      runBuild(PROMPTS_DIR);
      break;
    }
    case 'list': {
      const { runList } = await import('./commands/list.js');
      runList(PROMPTS_DIR, args.slice(1));
      break;
    }
    case 'show': {
      const { runShow } = await import('./commands/show.js');
      runShow(PROMPTS_DIR, args[1]);
      break;
    }
    case 'compose': {
      const { runCompose } = await import('./commands/compose.js');
      runCompose(PROMPTS_DIR, args.slice(1));
      break;
    }
    default:
      console.log(`xprompt — composable prompt snippet manager

Usage:
  xprompt build                          Generate catalog.json
  xprompt list [--type <type>] [--category <cat>] [--tag <tag>] [--json]
  xprompt show <id>                      Show snippet content
  xprompt compose <id>                   Output composed snippet
  xprompt compose --pick <id1> <id2>...  Compose from selected atoms`);
      if (command) {
        console.error(`\nUnknown command: ${command}`);
        process.exit(1);
      }
  }
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
