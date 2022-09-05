const productsModel = require("../models/productsModel");
module.exports = (req, res, next) => {
    productsModel.order(req.body.category, req.body.id, req.body.userEmail).then((value) => {
        console.log(value);
        res.json({
            orderDone: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            favoriteDone: false
        })
    })
}