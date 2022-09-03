const express = require("express");
const userController= require("../../../Controller/Users_Controller/Users_Controller");
const router = express.Router();


// save to database user --------------
router.route("/")
    .post(userController.saveUserDb)
    // update user=======================
    .put(userController.updateUser);

// get admin-----------------------
router.get('/:email', userController.getAdmin);
//   add admin----------------
router.put('/admin', userController.addAdmin)

module.exports = router;