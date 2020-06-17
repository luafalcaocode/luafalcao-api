const path = require("path");

const config = {
  uploadDir: path.join(__dirname, "../", "uploads"),
  email: {
    credentials: {
      user: "inclua_o_email_do_disparador_aqui",
      password: "inclua_a_senha_do_disparador_aqui",
    },
    smtp: "inclua_o_codigo_smtp_aqui",
    from: "inclua_o_nome_do_remetente_aqui",
    to: "inclua_o_email_do_destinatario_aqui",
    subject: "inclua_o_assunto_do_email_aqui",
  },
  statusCode: {
    success: 200,
    created: 201,
    bad: 400,
    whereIsTheToken: 401,
    boom: 500,
    notFound: 404,
  },
  publicFolder: path.join(__dirname, "..", "public"),
};

module.exports = config;
