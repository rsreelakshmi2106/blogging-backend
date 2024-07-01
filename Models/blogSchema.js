const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    postimage:{
        type:String,
        require:true
    },
    body:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now // Sets the default value to the current date and time
    },
    likes:{
        type:[String],
        default : []
    }
})

const blogs = mongoose.model('blogs',blogSchema)
module.exports = blogs