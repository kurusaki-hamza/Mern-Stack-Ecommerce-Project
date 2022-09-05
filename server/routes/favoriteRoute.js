const favoriteController = require("../controllers/favoriteController");
const router = require("express").Router();
router.post("/favorite", favoriteController);
module.exports = router;