const User = require('../models/User');

class AccountController {

    // [GET] /account/:username
    showByUsername = async function (req, res) {
        const queryUsername = req.params.username || req.user.username;

        const currentUser = await User.findOne({ username: queryUsername })
            .then((user) => user.toObject())
            .catch((err) => err)

        res.send({
            id: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            website: currentUser.website,
            birthday: currentUser.birthday,
        });
    }

    // [POST] /account/change
    changeInfo = async function (req, res) {
        const data = req.body;
        const id = req.body.id;

        const user = await User.findOneAndUpdate(
            { _id: id },
            {
                phone: data.phone,
                website: data.website,
            },
            {
                new: true,
            }
        )
            .then((user) => user.toObject())
            .catch((error) => error);

        res.send(user);
    }

    // [GET] /account
    showCurrentAccount = async function (req, res) {
        const currentUser = await User.findOne({ username: req.user.username }).then(
            (user) => user.toObject()
        );

        res.send({
            id: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            website: currentUser.website,
            birthday: { type: Date, default: "" },
        });
    }
}


module.exports = new AccountController();