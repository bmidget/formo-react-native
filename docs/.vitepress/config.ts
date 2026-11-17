import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { createMarkdownRenderer, defineConfig, type Plugin } from 'vitepress'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))
const examplesDir = join(rootDir, 'playground/examples')

const VIRTUAL_ID = 'virtual:formo-rn-demos'
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`

function formoRnDemoPlugin(): Plugin {
  let mdPromise: ReturnType<typeof createMarkdownRenderer> | null = null
  const getMd = () => (mdPromise ??= createMarkdownRenderer(rootDir))

  return {
    name: 'formo-rn-demos',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return
      const md = await getMd()
      const files = readdirSync(examplesDir).filter((f) => f.endsWith('.tsx'))
      const entries: Record<string, { file: string; html: string }> = {}
      for (const file of files) {
        const raw = readFileSync(join(examplesDir, file), 'utf8')
        const html = md.render(`\`\`\`tsx\n${raw.trimEnd()}\n\`\`\``)
        entries[file] = { file, html }
      }
      return `export const demos = ${JSON.stringify(entries)};`
    },
    handleHotUpdate(ctx) {
      if (ctx.file.startsWith(examplesDir) && ctx.file.endsWith('.tsx')) {
        const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) {
          ctx.server.moduleGraph.invalidateModule(mod)
          return [mod]
        }
      }
    },
  }
}

export default defineConfig({
  title: 'formo-react-native',
  description: 'Forms as objects for React Native — with framework-free Zod, Laravel & JSON Schema support.',
  base: process.env.VITEPRESS_BASE ?? '/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'From Models', link: '/guide/from-models' },
      { text: 'Custom Layout', link: '/guide/custom-layout' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Forms from Models', link: '/guide/from-models' },
          { text: 'Custom Field Layout', link: '/guide/custom-layout' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/bmidget/formo-react-native' }],
  },
  vite: {
    plugins: [react(), formoRnDemoPlugin()],
    resolve: {
      alias: {
        'react-native': 'react-native-web',
        'formo-react-native/schema': join(rootDir, 'src/schema/index.ts'),
        'formo-react-native': join(rootDir, 'src/index.ts'),
      },
    },
  },
})
