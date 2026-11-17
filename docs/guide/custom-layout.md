# Custom Field Layout

When you don't want the default stacked layout, pass a render function to `<FormoField field={form.fields.email}>` and compose `<FormoInput>` and `<FormoErrors>` inside your own React Native `<View>`s:

<Demo name="CustomLayoutExample" />
