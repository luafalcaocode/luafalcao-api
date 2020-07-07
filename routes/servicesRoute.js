const express = require("express");
const router = express.Router();

const servicesController = require('../controllers/servicesController');

router.post("/solicitacao", servicesController.createNewOrder);

router.get("/solicitacao", (request, response, next) => {
  response.send("<h1>API works</h1>");
});

module.exports = router;
