const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema(
    {
        username: { type: String, require: true },
        create_at: { type: Date, require: true, default: Date.now() },
        content: { type: String, require: true, default: '' },
        seen: { type: Boolean, default: false },
        link: { type: String, default: '' }
    }
)

module.exports = mongoose.model('notifications', Notification);
