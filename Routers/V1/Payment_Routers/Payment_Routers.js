const express = require("express");
const router = express.Router();

const paymentController = require("../../../Controller/Payment_Controller/Payment_Controller");
//sslcommerz init
router.post('/init', paymentController.paymentInit);
router.post('/success', paymentController.paymentSuccess);
router.post('/fail', paymentController.paymentFail);
router.post('/cancel', paymentController.paymentCancel);
router.post("/ipn", paymentController.paymentIpn);
router.get('/:tran_id', paymentController.paymentOrder);


module.exports = router;