const mongoose = require("mongoose");
module.exports = async (req, res, next) => {
    try {
        if (req.session.isUser) {
            const cll = await mongoose.connection.db.collection("users");
            const doc = await cll.findOne({ email: req.session.email });
            const arrOfProductsStatus = doc.arrOfProductsStatus;
            res.json({
                isUser: true,
                arr: arrOfProductsStatus,
                email: req.session.email
            })
        } else {
            let arrOfProductsStatus = {
                books: [],
                computersAndAccessoires: [],
                dresses: [],
                toys: [],
                phones: [],
                kitchentools: []
            }
            res.json({
                isUser: false,
                arr: arrOfProductsStatus,
                email: "none"
            })
        }

    } catch (error) {
        console.log("isUserController catch err", error)
    }
    next();
}