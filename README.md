# formo-react-native

A rough starting-point port of [formo-vue](../formo-vue) ("forms as objects") for **React Native**, including the framework-free `formo-react-native/schema` layer (IR v1, `fromLaravel`, `fromJsonSchema`, `fromOpenApi`, `fromZod`).

## Current State (Raw Starting Point)

- **Core (`src/core/`)**: Minimal `Formo` builder, normalizer (`.add()` and recursive `fields` objects), and basic rule evaluator.
- **Schema (`src/schema/`)**: Full framework-free IR v1 & model/schema adapters ported directly from `formo-vue/schema`.
- **Hooks (`src/hooks/useFormo.ts`)**: Basic React state hook with `values`, `errors`, `touched`, `dirty`, `validate()`, `submit()`, `val()`, `load()`, `reset()`, and outcome tracking.
- **Components (`src/components/`)**: Starter React Native primitives (`FormoForm`, `FormoField`, `FormoInput`, `FormoSwitch`, `FormoButton`, `FormoErrors`).

## Open Tasks / Roadmap (Great for Alignerr Passes)

1. **Views & Theme System**: Port `formo-vue`'s view-based theming (`views` + style tokens), per-field/per-form overrides, and `FormoUneditable` / `FormoChecklist` / `FormoErrorSummary` equivalents for React Native.
2. **React Native Controls & Focus Chaining**: Add `select` (modal/action-sheet picker), `radios`, `checkboxes`, `date`, and automatic `returnKeyType="next"` + `ref.focus()` chaining across fields, plus `KeyboardAvoidingView` / `ScrollView` ergonomics.
3. **Full Validation & Conditional Parity**: Port `conditions.ts` (`ignore`, `exclude`, `required_if`, `required_with`), `errorDisplay` (`first` / `all` / `checklist`), i18n locales/adapters, and Zod/schema validation wiring into `useFormo`.
4. **Subforms, Blueprints & Live Sync**: Support nested `FormoGroup`, repeatable `FormoBlueprint` lists, `<FormoRender>` / `<FormoRest>` partial placement, and dirty-aware live `initialValues` syncing.
5. **Component & Hook Testing**: Add `@testing-library/react-native` (or React test renderer) tests for `useFormo`, components, focus chaining, and outcome events.

## Scripts

```sh
bun install
bun run check   # tsc --noEmit + vitest run
bun run build   # tsc -p tsconfig.build.json
```
