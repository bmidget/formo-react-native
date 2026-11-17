# Getting Started

`formo-react-native` brings Formo's **"forms as objects"** model to React Native.

## Installation

```bash
bun add formo-react-native
```

*(Requires `react` and `react-native` as peer dependencies.)*

## Builder & Live Validation

Define a form with `Formo.form(...)` (or a plain nested object), wire it with `useFormo()`, and render it with `<FormoForm>`:

<Demo name="BuilderExample" />
