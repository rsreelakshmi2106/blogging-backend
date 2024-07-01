const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    bio:{
        type:String
    },
    userStatus:{
        type:String
    },
    userImage:{
        type:String
    },
    notification:{
        type:[String],
        default:[]
    }
})

const users = mongoose.model('users',userSchema)

module.exports = users