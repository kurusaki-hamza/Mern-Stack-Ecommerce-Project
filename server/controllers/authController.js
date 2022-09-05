const authModel = require("../models/authModel");
const validationResult = require('express-validator').validationResult
module.exports.login = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.login(req.body.email, req.body.password).then((result) => {
            if (result) {
                if (typeof result === 'string') {
                    res.json({
                        validationArr: [{ param: "password", msg: "password is wrong" }]
                    })
                } else {
                    if (req.session) {
                        req.session.isUser = true;
                        req.session.email = req.body.email;
                    }
                    res.json({
                        isUser: true,
                        arr: result.arrOfProductsStatus
                    })
                }
            } else {
                res.json({
                    isUser: false
                })
            }
        })
    } else {
        res.json({
            validationArr: validationResult(req).array()
        })
    }
}

module.exports.signup = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel.signup(req.body.username, req.body.email, req.body.password).then((signedUp) => {
            res.json({
                signedUp: signedUp,
            })
        }).catch((err) => {
            console.log("signup throw err", err);
        })
    } else {
        res.json({
            signedUp: false,
            validationArr: validationResult(req).array()
        })
    }
}

module.exports.logout = (req, res, next) => {
    req.session.destroy();
}