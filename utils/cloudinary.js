const cloudinary = require('cloudinary').v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.CLOUDE_API,
    api_secret: process.env.CLOUDE_SECRET
});

module.exports = cloudinary;