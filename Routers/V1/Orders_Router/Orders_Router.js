const express = require('express');
const { orders, orderDelete, addToCart, myOrders, updateStatus } = require('../../../Controller/Orders_Controller/Orders_controller');

const router = express.Router();
router.route("/")
    // all order products get -----------
    .get(orders)
    // add to cart Product ==============
    .post(addToCart);

router.route("/:id")
    // Delete manage all product --------
    .delete(orderDelete)
    // approve status update-------------
    .put(updateStatus);
// email get my Order================
router.get('/:email', myOrders);

module.exports = router;