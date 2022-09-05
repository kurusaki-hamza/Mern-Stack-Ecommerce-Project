const orderController = require("../controllers/orderController");
const router = require("express").Router();
router.post("/order", orderController);
module.exports = router;