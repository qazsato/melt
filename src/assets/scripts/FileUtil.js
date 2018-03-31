const fs = require('fs');
const path = require('path');
const Note = require('./Note');

class FileUtil {
  static readTree(dir) {
    return new Promise((resolve, reject) => {
      const scanDirectory = (p, callback) => {
        const results = [];
        const files = fs.readdirSync(p);
        let pending = files.length;
        if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す

        files.map((file) => path.join(p, file))
            .filter((file) => {
              if(fs.statSync(file).isDirectory()) scanDirectory(file, (err, res) => { //ディレクトリだったら再帰
                results.push({
                  label:path.basename(file),
                  path: file,
                  children:res
                });
                if (!--pending) callback(null, results);
              });
              return fs.statSync(file).isFile();
            }).forEach((file) => { //ファイル名を保存
              const title = new Note(file).readTitle()
              results.push({
                label: title || 'Untitled',
                path: file
              });
              if (!--pending) callback(null, results);
            });
      }

      scanDirectory(dir, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = FileUtil;
