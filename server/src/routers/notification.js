const express = require('express')
const router = express.Router();
const { validateToken } = require("../middleware/Authentication");
const Notifiication = require('../app/models/Notification');

// [GET] /notification/new
router.get('/new', validateToken, async (req, res) => {
    const user = req.user;
    await Notifiication.find({ username: user.username, seen: false })
        .then(response => response.map(obj => obj.toObject()))
        .then(response => res.send(response));
});

// [GET] /notification
router.get('/', validateToken, async (req, res) => {
    const user = req.user;
    await Notifiication.find({ username: user.username })
        .then(response => response.map(obj => obj.toObject()))
        .then(response => res.send(response.reverse()));
});

// [POST] /notification
router.post('/', validateToken, async (req, res) => {
    const data = req.body;
    const noti = new Notifiication({
        content: data.content,
        username: data.username,
        link: data.link,
    });

    await noti.save();

    res.send(JSON.stringify(noti));
});

// [PUT]
router.put('/', validateToken, async (req, res) => {
    const data = req.body;
    const user = req.user;

    if (data.type === 'seen') {
        await Notifiication.updateMany({ username: user.username }, { seen: true })
            .then(response => res.send(response))
            .catch(error => res.send(error));
    }
})

// [DELETE]
router.delete('/all-user', validateToken, async (req, res) => {
    await Notifiication.deleteMany({ username: req.user.username })
        .then(res => res.send(res))
        .catch(error => res.send(error));
})
module.exports = router;
