export const DEMO_PATH = "/products/42";
export const DEMO_CURL = `curl -H "Accept: text/markdown" localhost:3000${DEMO_PATH}`;

export const DEMO_HTML = `<!DOCTYPE html>
<html>
  <head>…</head>
  <body>
    <h1>Product 42</h1>
    <span>$42.00</span>
  </body>
</html>`;

export const DEMO_MARKDOWN = `# Product 42

**Price:** $42.00
**Category:** Electronics
**In Stock:** Yes

A premium electronic product with exceptional
build quality and innovative features designed
for the modern developer workflow.`;

export const DEMO_HTML_SIZE = "~26 KB";
export const DEMO_MD_SIZE = "~101 B";
export const DEMO_RATIO = "~257× smaller";
