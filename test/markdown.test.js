const Markdown = require('../src/assets/scripts/markdown');
const markdown = new Markdown();

test('HTML文字列がエスケープされずに出力される(html=true)', () => {
  const text = `<h1>HTMLString</h1>`;
  const html = `<h1>HTMLString</h1>`;
  expect(markdown.render(text)).toBe(html);
});

test('改行時にbrタグが挿入される(breaks=true)', () => {
  const text = `aaa
                bbb`;
  const html = `<p>aaa<br>\nbbb</p>\n`;
  expect(markdown.render(text)).toBe(html);
});

test('URL文字列がリンクになる(linkify=true)', () => {
  const text = `http://example.com`;
  const html = `<p><a href="http://example.com" target="_blank">http://example.com</a></p>\n`;
  expect(markdown.render(text)).toBe(html);
});

test('コードが挿入される(言語指定あり)', () => {
  const text = '```javascript\nvar a = 0;\n```';
  const html = `<pre><code class="language-javascript"><span class="hljs-keyword">var</span> a = <span class="hljs-number">0</span>;\n</code></pre>\n`;
  expect(markdown.render(text)).toBe(html);
});

test('コードが挿入される(言語指定なし)', () => {
  const text = '```\nvar a = 0;\n```';
  const html = `<pre><code>var a = 0;\n</code></pre>\n`;
  expect(markdown.render(text)).toBe(html);
});

test('絵文字が挿入される', () => {
  const text = `:smile:`;
  const html = `<p>😄</p>\n`;
  expect(markdown.render(text)).toBe(html);
});

test('aタグにtarget=_blankが付与される', () => {
  const text = `[test](http://example.com)`;
  const html = `<p><a href="http://example.com" target="_blank">test</a></p>\n`;
  expect(markdown.render(text)).toBe(html);
});
