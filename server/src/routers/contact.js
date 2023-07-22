const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await db.getContactInformation();
  res.send(data);
});

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (name || email || message) {
    const contactForm = new ContactForm(name, email, message);

    res.send(JSON.stringify(contactForm));
  } else {
    res.redirect("back");
  }
});

module.exports = router;
