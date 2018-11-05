import settings from '../config/settings.json';
import NoteUtil from '../src/assets/scripts/note-util';
import Note from '../src/assets/scripts/note';

test('全てのノートを読み込む', () => {
  const note = new Note();
  note.updateTitle('title');
  const tree = NoteUtil.readTree(settings.directory);
  const label = note.readTitle();
  const path = note.readPath();
  expect(tree).toContainEqual({label, path});
  note.delete();
});

test('全てのノートのタグを読み込む', () => {
  const note = new Note();
  note.registTag('test');
  const tags = NoteUtil.readAllTags();
  expect(tags).toContain('test');
  note.delete();
});

test('全てのノートから最近更新したノートのパスを取得する', () => {
  const note = new Note();
  const path = NoteUtil.getRecentPath();
  expect(path).toContain(note.readPath());
  note.delete();
});
