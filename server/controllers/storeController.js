const mongoose = require("mongoose");
module.exports = async (req, res, next) => {
    try {
        let cll = await mongoose.connection.db.collection("store");
        let doc = await cll.findOne({});
        res.json({
            doc
        })
    } catch (err) {
        console.log("storeController catch err", err)
    }
}