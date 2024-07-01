const users = require('../Models/userSchema')

const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    console.log("Inside register method");

    const { username, email, password } = req.body
    console.log(username, email, password);

    try {
        const existingUser = await users.findOne({ username })
        if (existingUser) {
            res.status(406).json("User already exists")
        }
        else {
            const newUser = new users({
                username,
                email,
                password,
                name: "",
                bio: "",
                userStatus:"Active",
                userImage: ""
                
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch (err) {
        res.status(500).json("Registration Failed " + err)
    }
}

exports.login = async (req, res) => {
    console.log("Inside login method");
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email, password })
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, "super2024")
            console.log(token);
            res.status(200).json({ existingUser, token })
        }
        else {
            res.status(404).json("Invalid email or password")
        }
    }
    catch (err) {
        res.status(500).json("Login Failed..." + err)
    }
}

exports.getUser = async (req, res) => {
    // console.log("Inside get user");
    const { uid } = req.params
    try {
        const userDetail = await users.findOne({ _id: uid })
        if (userDetail) {
            res.status(200).json(userDetail)
            // console.log(userDetail);
        }
        else {
            res.status(401).json("No such user")
        }
    }
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}

exports.getUserId = async (req, res) => {
    console.log("Inside login user Id");
    const userId = req.payload
    const userDdata = await users.findOne({ _id: userId })
    res.status(200).json(userDdata)
}

exports.updateUserProfile = async (req, res) => {
    console.log("Inside update user method");

    const { username, email, password, name, bio, userImage } = req.body
    
    const {uid} = req.params
    
    const uploadImage = req.file?req.file.filename:userImage

    console.log(username, email, password, name, bio,userImage);

    try {
        const updateUser = await users.findByIdAndUpdate({ _id:uid },{username, email, password, name, bio, userImage:uploadImage})
        await updateUser.save()
        res.status(200).json(updateUser)
    }
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}

exports.getAlluser = async(req,res)=>{
    console.log("Inside get all users");
    const searchKey = req.query.search
    let query = {};
    if(searchKey){
        query = {
            $or: [
                { username: { $regex: searchKey, $options: "i" } },
                { name: { $regex: searchKey, $options: "i" } }
                // Add more fields as needed
            ]
        };
    }
    try{
        const allusers = await users.find(query)
        if(allusers){
            res.status(200).json(allusers)
        }
        else{
            res.status(401).json("No such user")
        }
    } 
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}

exports.setUserStatus = async(req,res)=>{
    console.log("Inside set user Status");
    const {userId,userStatus} = req.body
    console.log(userId,userStatus);
    try{
        const usrDet = await users.findByIdAndUpdate({_id:userId},{userStatus:userStatus})
        await usrDet.save()
        res.status(200).json(usrDet)
    }
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}

exports.getNotifications = async(req,res)=>{
    const userId=req.payload
    try{
        const notficUser = await users.findById({_id:userId})
        if(notficUser){
            res.status(200).json(notficUser.notification)
            console.log(notficUser.notification);
        }
    }
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}

exports.clearNotifications = async(req,res)=>{
    console.log("Inside clear notif");
    const userId = req.payload
    try{
        const user = await users.findById({_id:userId})
        if(user){
            user.notification=[]
            await user.save()
            console.log(user);
            res.status(200).json("notification cleared")
        }
        else{
            res.status(401).json("No such user")
        }
    }
    catch (err) {
        res.status(404).json("Error : " + err)
    }
}