// Import the packages
const blurhash = require("blurhash");
const sharp = require("sharp");

// Define the function
const imageBlurhash = async (imagePath, componentX, componentY) => {
    // Read the image file as a buffer
    const imageBuffer = await sharp(imagePath).ensureAlpha().raw().toBuffer();
    // Get the image metadata
    const { width, height } = await sharp(imagePath).metadata();
    // Encode the image buffer to a blurhash string
    const blurhashString = blurhash.encode(imageBuffer, width, height, componentX, componentY);
    // Return the blurhash string
    return blurhashString;
};

// // Test the function
// imageBlurhash("example.jpg", 4, 4)
//     .then((blurhashString) => {
//         console.log(blurhashString); // Prints something like "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
//     })
//     .catch((error) => {
//         console.error(error);
//     });


module.exports = imageBlurhash;
