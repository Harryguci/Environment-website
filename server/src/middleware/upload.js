const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var Path = path.join(__dirname, "..", "..", "public", "blogs");
        callback(null, Path);
    },
    filename: (req, file, callback) => {
        var fileID = path.extname(file.originalname);
        var userId = req.userId;

        callback(
            null,
            file.originalname.substring(0, file.originalname.lastIndexOf(".")) +
            fileID
        );
    },
});

module.exports = multer({ storage });