const express = require("express");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const router = express.Router();

const config = require('../config/config');

router.post("/solicitacao", (request, response, next) => {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, "../", "uploads");

  form.on("file", (field, file) => {
    fs.rename(file.path, path.join(form.uploadDir, file.name), () => {});
  });

  form.parse(request, (err, fields, files) => {
    const transporter = nodemailer.createTransport({
      service: config.email.smtp,
      auth: {
        user: config.email.credentials.user,
        pass: config.email.credentials.password,
      },
    });

    const mailOptions = {
      from: config.email.from,
      to: config.email.to,
      subject: config.email.subject,
      attachments: [],
      html: `
                    <table style="width: 100%">
                        <thead>
                            <tr>
                                <td style="font-size: 26px;font-weight: bold;background: #25364E;color: #11DED8">Solicitação de serviço</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Solicitante:</strong> ${fields.solicitante} </td>
                            </tr>
                            <tr>
                                <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>E-mail:</strong> ${fields.email} </td>
                            </tr>
                            <tr>
                                <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Tipo de Projeto:</strong> ${fields.tipoDeProjeto} </td>
                            </tr>
                            <tr>
                                <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Observações:</strong> ${fields.observacoes} </td>
                            </tr>
                        </tbody>
                    </table>
                  `,
    };

    let stream;
    fs.readdir(config.uploadDir, (err, files) => {
      files.forEach((file) => {
        stream = fs.createReadStream(path.join(config.uploadDir, file));
        mailOptions.attachments.push({ filename: file, content: stream });
      });
      transporter.sendMail(mailOptions, (err, info) => {
        files.forEach((file) => {
          fs.unlink(path.join(config.uploadDir, "/", file), (err) => {
            if (err) console.log(err);
          });
        });

        if (!err) {
          response
            .status(config.statusCode.success)
            .send({ message: "the data was sent successfuly!", success: true });
        } else {
          response
            .status(config.statusCode.bad)
            .send({ message: `${err.name}: ${err.message}`, success: false });
        }
      });
    });
  });
});

router.get("/solicitacao", (request, response, next) => {
  response.send("<h1>API works</h1>");
});

module.exports = router;
