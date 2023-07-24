const multer = require("multer");
const path = require("path");

// Middleware
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var Path = path.join(__dirname, "..", "..", "public", "blogs");
    callback(null, Path);
  },

  filename: (req, file, callback) => {
    console.log('Filename', fileID);
    var fileID = path.extname(file.originalname);
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      fileID += ".jpg";
    } else {
      fileID += ".mp4";
    }

    req.idFile = fileID;

    callback(null, file.originalname);
  },
});


module.exports = {
  multer: multer({ storage }),
};
