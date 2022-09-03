const express = require("express");
const productController = require("../../../Controller/Products_Controller/Products_Controller");


const router = express.Router();





router.route("/")
    // all products get ------------------------
    .get(productController.products)
    // add products-----------------------------
    .post(productController.productPost)

router.route("/:id")
    //update product----------------------------
    .put(productController.updateProduct)
    //get place order---------------------------
    .get(productController.singleProduct)
    // delete product --------------------------
    .delete(productController.deleteProduct)









module.exports = router;