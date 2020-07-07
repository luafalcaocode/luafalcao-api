const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const config = require("../config/config");
const emailModel = require("../models/email.model");
const emailService = require("../services/email.service");
const fileService = require("../services/file.service");

exports.createNewOrder = (request, response, next) => {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, "../", "uploads");
  form.maxFileSize = 5 * 1024 * 1024;

  const requestId = request.headers["custom-request-id"];
  const requestDir = path.join(
    form.uploadDir,
    requestId.toString().split("/").join(".").split(":").join(".")
  );

  fs.access(form.uploadDir, (err) => {
    if (err && err.code === "ENOENT") {
      fs.mkdir(form.uploadDir, (err) => {
        if (!err) console.log("diretório de uploads criado com sucesso.");
      });
    }

    fs.access(requestDir, (err) => {
      if (err && err.code === "ENOENT") {
        console.log(err);
        fs.mkdir(requestDir, (err) => {
          if (!err)
            console.log("diretório com o id da requisição criado com sucesso.");
          form.on("file", (field, file) => {
            fs.renameSync(file.path, path.join(requestDir, file.name));
          });
        });
      }
    });
  });

  form.parse(request, (err, fields, files) => {
    if (!err) {
      emailModel.credentials = {
        user: config.email.credentials.user,
        password: config.email.credentials.password,
      };
      emailModel.options = {
        from: config.email.options.from,
        to: config.email.options.to,
        subject: config.email.options.subject,
        html: emailService.buildOrderServiceTemplate(fields),
        attachments: [],
      };
      emailModel.smtp = config.email.smtp;

      fs.readdir(requestDir, (err, filenames) => {
        fileService
          .openFilesAsStreamAsync(filenames, requestDir)
          .then((data) => {
            data.forEach((item) => {
              emailModel.options.attachments.push({
                filename: item.name,
                content: item.bytes,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            emailService
              .send(emailModel)
              .then(() => {
                console.log("email enviado com sucesso...");
                response
                  .status(config.statusCode.success)
                  .send({
                    message: "A mensagem foi enviada com sucesso.",
                    success: true,
                  });
                if (filenames && filenames.length > 0) {
                  fileService
                    .removeDirAsync(requestDir)
                    .then(() => {
                      console.log(
                        "Os arquivos e a pasta foram removidos do servidor."
                      );
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
                response
                  .status(config.statusCode.boom)
                  .send({ message: err.message, success: false });
              });
          });
      });
    } else {
      console.log(err);
      response
        .status(config.statusCode.bad)
        .send({ message: err.message, success: false });
    }
  });
};
