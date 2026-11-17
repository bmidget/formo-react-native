<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { demos } from 'virtual:formo-rn-demos'

const props = defineProps<{ name: string }>()
const { isDark } = useData()

const tab = ref<'preview' | 'code'>('preview')
const mountEl = ref<HTMLElement | null>(null)

const modules = import.meta.glob('../../../playground/examples/*.tsx')

const entry = computed(() => {
  const key = props.name.endsWith('.tsx') ? props.name : `${props.name}.tsx`
  return demos[key]
})

let reactRoot: { render: (el: any) => void; unmount: () => void } | null = null
let loadedComp: any = null
let ReactMod: any = null

async function renderDemo() {
  if (!mountEl.value || !entry.value) return
  const path = `../../../playground/examples/${entry.value.file}`
  const loader = modules[path]
  if (!loader) return

  if (!ReactMod) {
    const [react, client] = await Promise.all([import('react'), import('react-dom/client')])
    ReactMod = react.default ?? react
    reactRoot = client.createRoot(mountEl.value)
  }
  if (!loadedComp) {
    const mod: any = await loader()
    loadedComp = mod.default
  }

  reactRoot?.render(ReactMod.createElement(loadedComp, { colorScheme: isDark.value ? 'dark' : 'light' }))
}

onMounted(() => {
  void renderDemo()
})

watch(isDark, () => {
  if (reactRoot && loadedComp && ReactMod) {
    reactRoot.render(ReactMod.createElement(loadedComp, { colorScheme: isDark.value ? 'dark' : 'light' }))
  }
})

onBeforeUnmount(() => {
  reactRoot?.unmount()
  reactRoot = null
})
</script>

<template>
  <div class="formo-demo">
    <div class="formo-demo-bar">
      <button
        type="button"
        :class="['formo-demo-tab', { active: tab === 'preview' }]"
        @click="tab = 'preview'"
      >
        Live Preview (react-native-web)
      </button>
      <button
        type="button"
        :class="['formo-demo-tab', { active: tab === 'code' }]"
        @click="tab = 'code'"
      >
        TSX Source
      </button>
    </div>

    <div v-show="tab === 'preview'" ref="mountEl" class="formo-demo-preview" />
    <div v-show="tab === 'code'" class="formo-demo-code" v-html="entry?.html" />
  </div>
</template>

<style scoped>
.formo-demo {
  margin: 16px 0 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}
.formo-demo-bar {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
.formo-demo-tab {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  cursor: pointer;
}
.formo-demo-tab.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.formo-demo-preview {
  padding: 16px;
  background: var(--vp-c-bg-alt);
}
.formo-demo-code :deep(pre) {
  margin: 0 !important;
  border-radius: 0 !important;
}
</style>
