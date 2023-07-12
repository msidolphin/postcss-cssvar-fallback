# postcss-cssvar-fallback

[PostCSS] plugin css.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  color: var(--primary-color);
}
```

```css
.foo {
  color: var(--primary-color, red);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-cssvar-fallback
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   (require('postcss-cssvar-fallback'), {
+      themePath: path.join(__dirname, '../node_modules/@kdocs/kdesign-theme/default.css')
+   }),
    require('autoprefixer')
  ]
}
```

**Step 4:** Ignore your theme file:

eg:

webpack

```diff
externals: {
+  '@kdocs/kdesign-theme/default.css': '""'
}
```

[official docs]: https://github.com/postcss/postcss#usage
