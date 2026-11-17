# Forms from Models & Schemas

`formo-react-native/schema` is pure, framework-free TypeScript shared with `formo-vue/schema`. Generate full React Native forms directly from:

- **Laravel** (`fromLaravel({ rules, attributes, messages })`)
- **Zod** (`fromZod(schema, { toJSONSchema: z.toJSONSchema })`)
- **JSON Schema & OpenAPI** (`fromJsonSchema`, `fromOpenApi`)
- **IR JSON v1** (`parseModel`, `Formo.fromModel(model, { only, except, fields })`)

<Demo name="FromModelExample" />
