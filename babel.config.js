// NOTE: Jestのテスト実行で外部ライブラリ(mermaid 経由の d3)の export 構文のエラーとなるため追加
// https://jestjs.io/ja/docs/getting-started#babel-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
}
