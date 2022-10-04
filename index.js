const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


//Multer file upload
// app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 9999;
dotenv.config();



//MongoDB Connect
mongoose.connect(
    process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
}).then((data) => console.log(`MongoDB connected with server: ${data.connection.host}`)).catch((err)=> {
    console.log(err);
})

//Route Middlewares
const apiRoutes = require('./routes/api');
const Content = require('./models/Content');
app.use("/api", apiRoutes);

/** Content seeder */
const contentSeeder = [
    {
        title: "Privacy Policy",
        content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
        type: "privacy_policy"
    },
    {
        title: "Terms and Conditions",
        content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
        type: "terms_and_conditions"
    },
    {
        title: "Help and Support",
        content: "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
        type: "help_and_support"
    }
];
const dbSeed = async () => {
    await Content.deleteMany({});
    await Content.insertMany(contentSeeder);
}
dbSeed().then(() => {
    // mongoose.connection.close();
})



app.listen(PORT, () => console.log(`Server Up and Running on Port ${PORT}`));