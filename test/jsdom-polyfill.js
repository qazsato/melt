// Jestが使用するテスト環境であるjsdomではcreateRangeが実装されていないためエディタのテストでエラーとなる。
// エラーを回避するために中身が空のメソッドを定義する。参考) https://github.com/jsdom/jsdom/issues/317
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  getBoundingClientRect: () => {},
  getClientRects: () => []
});
