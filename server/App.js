require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");
const favoriteRouter = require("./routes/favoriteRoute");
const orderRouter = require("./routes/orderRoute");
const contactRouter = require("./routes/contactRoute");
const isUserRouter = require("./routes/isUser");
const storeRouter = require("./routes/storeRouter");
const session = require('express-session');
const bodyParser = require("body-parser");
const SessionStore = require('connect-mongodb-session')(session);
const STORE = new SessionStore({ uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', collection: 'sessions' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connect = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use(session({
    secret: 'str to hash express session bla bla ...',
    saveUninitialized: false, resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: STORE
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    next();
})

app.use("/", isUserRouter);
app.use("/", authRouter);
app.use("/", favoriteRouter);
app.use("/", orderRouter);
app.use("/", contactRouter);
app.use("/", storeRouter);

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')))
    app.use("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'public', "index.html"))
    });
} else {
    app.get('/', (req, res) => res.send("API Running"))
}
const PORT = process.env.PORT
app.listen(PORT || 5001, () => {
    console.log("Running on Port 5001");
})