# next-md-negotiate

## 1.1.0

### Minor Changes

- Add LLM discoverability hints

  - New `LlmHint` React component that renders `<script type="text/llms.txt">` to tell LLM agents a Markdown version is available
  - New `add-hints` / `remove-hints` CLI commands to auto-inject or remove `LlmHint` from page files based on `md.config`
  - New `options` third argument to `createMdVersion` with `hintText`, `skipHint`
  - Support `defaultHintText` export in `md.config` for a global hint message
  - Refactored CLI into `bin/utils/` modules
  - Added `react` as a peer dependency
