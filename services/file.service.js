const config = require("../config/config");
const fs = require("fs");
const path = require("path");

const fileService = {
  openFilesAsStreamAsync: async (files) => {
    const stream = [];
    let temp = [];

    for await (const file of files) {
      for await (const chunk of fs.createReadStream(
        path.join(config.uploadDir, file)
      )) {
        temp.push(chunk);
      }

      stream.push({ name: file, bytes: Buffer.concat(temp) });
      temp = [];
    }

    return stream;
  },

  removeFilesAsync: async (files) => {
    for await (const file of files) {
     let absolutePath = path.join(config.uploadDir, '/', file);
     fs.exists(absolutePath, (exists) => {
       if (exists) {
          fs.unlink(path.join(config.uploadDir, '/', file), (err) => {
            if (err) console.log(err);
          });
       }       
     });    
    }
  }
};

module.exports = fileService;
