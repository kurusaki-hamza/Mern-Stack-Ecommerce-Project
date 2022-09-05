const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    arrOfProductsStatus: {
        type: {
            books: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            },
            computersAndAccessoires: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            },
            dresses: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            },
            toys: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            },
            phones: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            },
            kitchentools: {
                type: [{ id: Number, favorite: Boolean, ordered: Boolean }],
                default: []
            }
        },
        default: {
            books: [],
            computersAndAccessoires: [],
            dresses: [],
            toys: [],
            phones: [],
            kitchentools: []
        }
    }
});
const User = mongoose.model("user", userSchema);
module.exports.login = async (email, password) => {
    try {
        const user = await User.find({ email: email });
        if (user[0]) {
            let encryptedPassword = password;
            try {
                encryptedPassword = await require('bcrypt').hash(password, 10);
            } catch (err) {
                console.log(err);
            }
            let comparison;
            try {
                comparison = await require("bcrypt").compare(password, user[0].password);
                if (comparison) {
                    const userDoc = await User.findOne({ email: email });
                    const arrOfProductsStatus = userDoc.arrOfProductsStatus;
                    return { comparison, arrOfProductsStatus }
                } else {
                    return "passowrd is wrong"
                }
            } catch (err) {
                return false
            }
        } else {
            return false
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.signup = async (username, email, password) => {
    try {
        let encPass;
        try {
            encPass = await require('bcrypt').hash(password, 10);
        } catch (err) {
            console.log("hash err", err);
            encPass = password
        }
        const user = await new User({
            email: email,
            username: username,
            password: encPass,
            arrOfProductsStatus: {
                books: [],
                computersAndAccessoires: [],
                dresses: [],
                toys: [],
                phones: [],
                kitchentools: []
            }
        });
        await user.save().then((doc) => {
            console.log("user doc is made", doc)
        })
        return true
    } catch (err) {
        console.log("connecting to db and making new doc err", err);
        throw false;
    }
}