# Shevky Plugin: Tailwind CSS

A simple Shevky plugin that runs Tailwind CSS during builds and outputs the compiled styles into your site assets.

## Features

- Runs Tailwind CSS during build
- Outputs compiled CSS to your site assets
- Works with your existing Tailwind config

## Installation

```bash
npm i shevky-tailwindcss
```

## Usage

Add the plugin to your Shevky config:

```json
{
  "plugins": [
    "shevky-tailwindcss"
  ]
}
```

If you enable `build.minify`, the generated CSS output is minified as well.

```json
{
  "build": {
    "minify": true
  }
}
```

## License

MIT
