const fs = require("fs");
const path = require("path");

function getBlogs() {
  const data = fs.readFileSync(path.join(__dirname, "blogs.json"), {
    encoding: "utf8",
    flag: "r",
  });
  // console.log(data);
  return data;
}

function getContactInformation() {
  const data = fs.readFileSync(path.join(__dirname, "contact.json"), {
    encoding: "utf8",
    flag: "r",
  });
  // console.log(data);
  return data;
}

function getProducts() {
  const data = fs.readFileSync(path.join(__dirname, "products.json"), {
    encoding: "utf8",
    flag: "r",
  });
  return data;
}

module.exports = { getBlogs, getContactInformation, getProducts };
