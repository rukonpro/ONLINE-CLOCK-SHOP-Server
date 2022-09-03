const express = require('express');
const requestController = require('../../../Controller/Request_Controller/RequestController');
const router = express.Router();


router.route("/")
    .post(requestController.requestPost)
    .get(requestController.requestGet);


router.delete('/:id', requestController.requestMassageDelete)

module.exports = router;