import zlib from "node:zlib";

const origin = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const baseline = { js: 597_497, jsBrotli: 186_310, css: 181_212, cssBrotli: 25_695 };

const html = await fetch(origin).then((response) => {
  if (!response.ok) throw new Error(`Homepage returned ${response.status}`);
  return response.text();
});

const scriptSources = new Set(
  [...html.matchAll(/<script\b([^>]*)>/g)]
    .filter((match) => !/\bnoModule\b/i.test(match[1]))
    .map((match) => match[1].match(/\bsrc="([^"]+)"/)?.[1])
    .filter(Boolean),
);

const styleSources = new Set(
  [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(
    (match) => match[1],
  ),
);

async function measure(sources) {
  let decoded = 0;
  let brotli = 0;
  for (const source of sources) {
    const url = new URL(source, origin);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url.pathname} returned ${response.status}`);
    const body = Buffer.from(await response.arrayBuffer());
    decoded += body.byteLength;
    brotli += zlib.brotliCompressSync(body, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: body.byteLength,
      },
    }).byteLength;
  }
  return { count: sources.size, decoded, brotli };
}

const js = await measure(scriptSources);
const css = await measure(styleSources);
const reduction = (before, after) => (((before - after) / before) * 100).toFixed(1);

console.log(`Measured ${origin} (modern path, noModule polyfill excluded)`);
console.log(
  `JavaScript: ${js.count} files, ${js.decoded.toLocaleString()} B decoded, ${js.brotli.toLocaleString()} B Brotli`,
);
console.log(
  `CSS:        ${css.count} files, ${css.decoded.toLocaleString()} B decoded, ${css.brotli.toLocaleString()} B Brotli`,
);
console.log(
  `Total Brotli: ${(js.brotli + css.brotli).toLocaleString()} B (baseline ${(baseline.jsBrotli + baseline.cssBrotli).toLocaleString()} B)`,
);
console.log(
  `Reduction: JS ${reduction(baseline.js, js.decoded)}% decoded / ${reduction(baseline.jsBrotli, js.brotli)}% Brotli; CSS ${reduction(baseline.css, css.decoded)}% decoded / ${reduction(baseline.cssBrotli, css.brotli)}% Brotli`,
);
