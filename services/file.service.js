const config = require("../config/config");
const fs = require("fs");
const path = require("path");

const fileService = {
  openFilesAsStreamAsync: async (files, requestDir) => {
    const stream = [];
    let temp = [];

    for await (const file of files) {
      // for await (const chunk of fs.createReadStream(
      //   path.join(requestDir, file)
      // )) {
      //   temp.push(chunk);
      // }

      //stream.push({ name: file, bytes: Buffer.concat(temp) });
      stream.push({name: file, bytes: fs.createReadStream(path.join(requestDir, file))});
      //temp = [];
    }

    return stream;
  },

  removeFilesAsync: async (files, requestDir) => {
    for await (const file of files) {
     let absolutePath = path.join(requestDir, '/', file);
     fs.exists(absolutePath, (exists) => {
       if (exists) {
          fs.unlink(path.join(requestDir, '/', file), (err) => {
            if (err) console.log(err);
          });
       }       
     });    
    }
  },

  removeDirAsync: async(requestDir) => {
   fs.rmdir(requestDir, { recursive: true }, (err) => {
      if (err) console.log(err);
   });
  }
};

module.exports = fileService;
