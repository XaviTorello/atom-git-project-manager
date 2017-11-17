'use babel';

const fs = require('fs');

//Check if File/Dir exists
export const exists = (filename) => {
  return fs.existsSync(filename);
};
