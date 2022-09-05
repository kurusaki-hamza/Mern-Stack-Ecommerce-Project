const contactModel = require("../models/contactModel");
const validationResult = require("express-validator").validationResult;
module.exports = (req, res, next) => {
    console.log(req.body);
    if (validationResult(req).isEmpty()) {
        contactModel(req.body.email, req.body.textarea).then((value) => {
            res.json({
                emailErr: false,
                textareaErr: false,
                msgSent: true
            })
        }).catch((err) => {
            console.log(err);
            res.json({
                emailErr: false,
                textareaErr: false,
                msgSent: "something went wrong"
            })
        })
    } else {
        let raplicatedNames = validationResult(req).array().map((ele) => {
            return ele.param
        });
        let names = Array.from(new Set(raplicatedNames));
        if (names.length === 1) {
            if (names[0] === "email") {
                res.json({
                    emailErr: validationResult(req).array()[0].msg,
                    textareaErr: false,
                    msgSent: false
                })
            } else {
                res.json({
                    emailErr: false,
                    textareaErr: validationResult(req).array()[0].msg,
                    msgSent: false
                })
            }
        } else {
            let emailAdded;
            let textareaAdded;
            let emailErr = false;
            let textareaErr = false;
            console.log(validationResult(req).array());
            validationResult(req).array().forEach((ele) => {
                if (ele.param === "email" && !emailAdded) {
                    emailAdded = true;
                    emailErr = ele.msg
                } else if (ele.param === "textarea" && !textareaAdded) {
                    passwordAdded = true;
                    textareaErr = ele.msg
                }
            });
            res.json({
                emailErr: emailErr,
                textareaErr: textareaErr,
                msgSent: false
            })
        }
    }
}