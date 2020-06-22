# luafalcao-nodejs-api

This repo intends to hosts my personal web site API with functionalities to upload files to the server and send e-mail with user received data 

# Getting Started

- open shell, execute the command "git clone https://github.com/luafalcaocode/luafalcao-api" and navigate to repo folder
- run npm install
- run npm start or press F5 for debug
- call an API endpoint (e.g: servicos/api/solicitacao) using port 5515 for HTTP or 3333 for HTTPS 

Obs.: To use HTTPS you'll need to configure a certificate key before as I did in development mode and generate cert.pem and key.pem files (you can use Open SSL to achieve this. It's free and you can find this tool on the web).

And also, of course, in config file you'll need to set your email/smtp config such as user and password. Feel free to use this code if you want! For while there is only one endpoint that receives a form data with files and send this on the web until arrives in a mail box. Future there'll be more! :)

# Technologies

- Node js
- Nodemailer
- Express js
- Nodemon
