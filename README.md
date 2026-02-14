# @quartz-community/content-meta

Displays content metadata such as creation date and reading time.

## Installation

```bash
npx quartz plugin add github:quartz-community/content-meta
```

## Usage

```ts
// quartz.layout.ts
import * as Plugin from "./.quartz/plugins";

// Add to your layout
Plugin.ContentMeta(); // in the appropriate layout section
```

## Configuration

| Option            | Type      | Default | Description                                        |
| ----------------- | --------- | ------- | -------------------------------------------------- |
| `showReadingTime` | `boolean` | `true`  | Whether to display the estimated reading time.     |
| `showComma`       | `boolean` | `true`  | Whether to display a comma between metadata items. |

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
