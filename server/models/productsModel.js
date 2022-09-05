const mongoose = require("mongoose");
module.exports.favorite = async (category, id, email) => {
    try {
        let collection = await mongoose.connection.db.collection("users");
        const doc = await collection.findOne({ email: email });
        const ixOfSubDoc = doc.arrOfProductsStatus[category].map((ele, ix) => {
            if (ele.id === id) {
                return ix
            }
        }).filter((e) => {
            if (e === 0) { return true }
            else if (e) { return e }
        })[0];
        const bol = ixOfSubDoc === 0 ? true : ixOfSubDoc;
        if (bol) {
            const key = `arrOfProductsStatus.${category}.${ixOfSubDoc}.favorite`;
            let favorite;
            doc.arrOfProductsStatus[category].forEach((ele) => {
                if (ele.id === id) {
                    favorite = ele.favorite
                }
            });
            await collection.updateOne({ email: email }, {
                $set: {
                    [key]: !favorite
                }
            }, {
                upsert: false
            })
        } else {
            const key = `arrOfProductsStatus.${category}`
            await collection.updateOne({ email: email }, {
                $push: {
                    [key]: {
                        id: id, favorite: true, ordered: false
                    }
                }
            }, {
                upsert: false
            })
        }
        return "favorite done"
    } catch (err) {
        console.log("favorite catch err:", err);
        throw err
    }
}
module.exports.order = async (category, id, email) => {
    try {
        let collection = await mongoose.connection.db.collection("users");
        const doc = await collection.findOne({ email: email });
        const ixOfSubDoc = doc.arrOfProductsStatus[category].map((ele, ix) => {
            if (ele.id === id) {
                return ix
            }
        }).filter((e) => {
            if (e === 0) { return true }
            else if (e) { return e }
        })[0];
        const bol = ixOfSubDoc === 0 ? true : ixOfSubDoc;
        if (bol) {
            const key = `arrOfProductsStatus.${category}.${ixOfSubDoc}.ordered`;
            let ordered;
            doc.arrOfProductsStatus[category].forEach((ele) => {
                if (ele.id === id) {
                    ordered = ele.ordered
                }
            });
            await collection.updateOne({ email: email }, {
                $set: {
                    [key]: !ordered
                }
            }, {
                upsert: false
            })
        } else {
            const key = `arrOfProductsStatus.${category}`
            await collection.updateOne({ email: email }, {
                $push: {
                    [key]: {
                        id: id, favorite: false, ordered: true
                    }
                }
            }, {
                upsert: false
            })
        }
        return "ordered done"
    } catch (err) {
        console.log("order catch err:", err);
        throw err
    }
}