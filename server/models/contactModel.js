const mongoose = require("mongoose");
const contactSchema = mongoose.Schema({
    email: String,
    textarea: String
});
const Contact = mongoose.model("contact", contactSchema);
module.exports = async (email, textarea) => {
    try {
        const contact = await new Contact({
            email, textarea
        });
        await contact.save();
        return true
    } catch (err) {
        console.log(err);
        throw false
    }
}