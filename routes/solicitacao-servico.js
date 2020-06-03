const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/solicitacao', (request, response, next) => {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = path.join(__dirname, '../', 'uploads');
    form.on('file', (field, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name), () => {
        });
    });
    form.on('error', (error) => {
        console.log(error);
    });
    form.on('end', () => {
        console.log('arquivos recebidos no servidor');
    });
    form.parse(request, (err, fields, files) => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'adicionar_email_disparador_aqui',
                    pass: 'adicionar_senha_disparador_aqui'
                }
            });

        const mailOptions = {
            from: 'adicionar_email_remetente_aqui',
            to: 'adicionar_email_destinatario_aqui',
            subject: 'solicitação de serviço',
            attachments: [

            ],
            html: `
                    <h1>Solicitação de Serviço</h1>
                        <ul>
                        <li>${fields.solicitante}</li>
                        <li>${fields.email}</li>
                        <li>${fields.observacoes}</li>
                        <li>${fields.tipoDeProjeto}</li>
                   </ul>`
        };

      
        let stream;
        fs.readdir(path.join(__dirname, '../', 'uploads'), (err, files) => {
            files.forEach(file => {
                stream = fs.createReadStream(path.join(__dirname, '../', 'uploads', file));
                mailOptions.attachments.push({ filename: file, content: stream });

            });
            transporter.sendMail(mailOptions, (err, info) => {
                files.forEach(file => {
                    fs.unlink(path.join(__dirname, '../', 'uploads', '/', file), err => {
                        if (err)
                            console.log(err);
                    });
                });
                if (!err){
                    response.status(200).send({ message: 'the data was sent successfuly!', success: true });
                }
                else {
                    response.status(400).send({ message: `${err.name}: ${err.message}`, success: false });
                }
            });
        });
    });
});

router.get('/solicitacao', (request, response, next) => {
    response.send('<h1>API works</h1>');
});

module.exports = router;