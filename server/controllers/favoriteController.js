const productsModel = require("../models/productsModel");
module.exports = (req, res, next) => {
    productsModel.favorite(req.body.category, req.body.id, req.body.userEmail).then((value) => {
        res.json({
            favoriteDone: true
        })
    }).catch((err) => {
        console.log(err);
        res.json({
            done: false
        })
    })
}