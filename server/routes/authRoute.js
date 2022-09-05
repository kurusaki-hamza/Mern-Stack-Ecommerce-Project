const route = require('express').Router();
const authController = require("../controllers/authController");
const check = require('express-validator').check;

route.post('/login',
    check('email').not().isEmpty().withMessage('email is required').isEmail().withMessage('invalid format'),
    check('password').not().isEmpty().withMessage('password is required'),
    authController.login
);

route.post('/signup',
    check('username').not().isEmpty().withMessage("username is required").not().isInt().withMessage("username must be a string"),
    check('email').not().isEmpty().withMessage("email is required").isEmail().withMessage("Invalid Format"),
    check('password').not().isEmpty().withMessage("password is required").isLength({ min: 6 }).withMessage('the password must contains at least 6 letters'),
    authController.signup
);

route.post('/logout',
    authController.logout
);

module.exports = route;