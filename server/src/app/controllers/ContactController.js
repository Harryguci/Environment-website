const db = require('../../config/db')

class ContactController {
    // [GET] /contact 
    showInfo = async (req, res) => {
        const data = await db.getContactInformation();
        res.send(data);
    }

    // [POST] /contact
    sendMessage = async (req, res) => {
        const { name, email, message } = req.body;
        if (name || email || message) {
            const contactForm = new ContactForm(name, email, message);

            res.send(JSON.stringify(contactForm));
        } else {
            res.redirect("back");
        }
    }
}

module.exports = new ContactController();