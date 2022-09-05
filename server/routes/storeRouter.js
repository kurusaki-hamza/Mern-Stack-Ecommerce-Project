const storeController = require("../controllers/storeController");
const router = require("express").Router();
router.get(
    "/store",
    storeController
);
module.exports = router;