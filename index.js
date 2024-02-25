const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require('./connect');
const { checkForAuthentication, restrictTo } = require('./middlewares/auth');
const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => console.log("MongoDB connected!"));

//setup for ejs
app.set("view engine", "ejs");//my view engine is ejs
app.set("views", path.resolve("./views"))//and all my ejs files are in views folder


//MW
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);


app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);	// http://localhost:8001

app.get('/url/:shortId', async (req, res) => {
    try {
        const shortid = req.params.shortId;
        console.log(shortid);

        const entry = await URL.findOneAndUpdate(
            { shortid },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Ensure you get the updated document
        );

        if (!entry) {
            return res.status(404).send('URL not found');
        }

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));  