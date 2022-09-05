const router = require('express').Router();
const isUserController = require("../controllers/isUserController")

router.get("/isUser", isUserController);

module.exports = router;