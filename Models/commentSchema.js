const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
    reply: [
        {
            commentId: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            userId: {
                type: String,
                required: true
            },
            createDate: {
                type: Date,
                required: true
            }
        }
    ]
})

const comment = mongoose.model('comment', commentSchema)

module.exports = comment