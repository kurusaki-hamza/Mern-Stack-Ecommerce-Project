const contactController = require("../controllers/contactController");
const check = require('express-validator').check;
const router = require("express").Router();
router.post(
    "/contact",
    check("email").isEmail().withMessage("invalid Format").not().isEmpty().withMessage("Please Type Your Email"),
    check("textarea").not().isEmpty().withMessage("Text is Empty").isLength({ min: 16, max: 450 }).withMessage("Text letters must be between 16 and 450 letters"),
    contactController
);
module.exports = router;