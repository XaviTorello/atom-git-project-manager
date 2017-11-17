'use babel';

const fs = require('fs');

//Check if File/Dir exists
export const exists = (filename) => {
  return fs.existsSync(filename);
};


//Return the content of a directory
export const dir_content = (path) => {
  return fs.readdirSync(path);
};
