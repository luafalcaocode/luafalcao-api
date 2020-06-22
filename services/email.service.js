const nodemailer = require("nodemailer");

const emailService = {
  send: (emailModel) => {
    const transporter = nodemailer.createTransport({
      service: emailModel.smtp,
      auth: {
        user: emailModel.credentials.user,
        pass: emailModel.credentials.password,
      },
    });

    return transporter.sendMail(emailModel.options);
  },
  buildOrderServiceTemplate: (body) => {
    const html = `
      <table style="width: 100%">
          <thead>
              <tr>
                  <td style="font-size: 26px;font-weight: bold;background: #25364E;color: #11DED8">Solicitação de serviço</td>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Solicitante:</strong> ${body.solicitante} </td>
              </tr>
              <tr>
                  <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>E-mail:</strong> ${body.email} </td>
              </tr>
              <tr>
                  <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Tipo de Projeto:</strong> ${body.tipoDeProjeto} </td>
              </tr>
              <tr>
                  <td style="border: solid 1px black;height: 30px;font-size: 18px;padding: 3px;background: #25364E;color: #11DED8""><strong>Observações:</strong> ${body.observacoes} </td>
              </tr>
          </tbody>
      </table>
    `;
    
    return html;    
  },
};

module.exports = emailService;
