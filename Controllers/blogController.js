const { query } = require('express');
const blogs = require('../Models/blogSchema');
const users = require('../Models/userSchema');

exports.useraddBlog = async(req,res) =>{
    console.log("Inside addBlog method");
    const {title,category,body}=req.body
    const postimage = req.file.filename
    const userId = req.payload
    // console.log("uid",userId);
    console.log("Add Blog : ",title,category,postimage,body,userId);
    const currentdate = new Date();

    try{
        const existingBlogTitle = await blogs.findOne({ title })
        // const existingBlogContent = await blogs.findOne({ body })

        if(existingBlogTitle){
            // console.log("Existing Blog Content : ",existingBlogContent);
            console.log("Existing Blog : ",existingBlogTitle);
            res.status(401).json("Blog title already exists")
        }
        else{
            const newBlog = new blogs({
                title,
                category,
                postimage,
                body,
                userId,
                date : currentdate
            })
            await newBlog.save()
            res.status(200).json(newBlog)
            // res.status(200).json("Added successfully")
        }
        
    }
    catch(err){
        res.status(404).json("Adding Blog Failed....", err)
    }
}

exports.getAllBlogs = async(req,res)=>{
    console.log("Inside all blogs");

    const searchKey = req.query.search
    console.log(searchKey);
   
    let query = {};

    //case sensitive and searching
    if(searchKey){
        query = {
            $or: [
                { title: { $regex: searchKey, $options: "i" } }
                // { category: { $regex: searchKey, $options: "i" } },
                // Add more fields as needed
            ]
        };
    }    

    try{
        const allBlogs = await blogs.find(query)
        if(allBlogs){
            res.status(200).json(allBlogs)
        }
        else{
            res.status(401).json("Failed to get all blogs")
        }
    }
    catch(err){
        res.status(401).json("Error : ",err)
    }
}

exports.getUserBlog = async(req,res)=>{
    console.log("Inside user blog");
    const userId = req.payload
    console.log(userId);
    try{
        const userblog = await blogs.find({userId})
        if(userblog){
            res.status(200).json(userblog)
        }
        else{
            res.status(401).json("No such user")
        }
    }
    catch(err){
        res.status(404).json("Error :", err)
    }
}

exports.getABlog = async(req,res)=>{
    console.log("Inside get a post");
    const {bid} = req.params
    console.log(bid);
    try{
        const blogdetails = await blogs.findOne({_id:bid})
        if(blogdetails){
            res.status(200).json(blogdetails)
        }
        else{
            res.status(401).json("No such posts")
        }    
    }
    catch(err){
        res.status(404).json("Error....", err)
    }
}

exports.deleteABlog = async(req,res)=>{
    const {bid}=req.params
    try{
        const deleteBlog = await blogs.findOneAndDelete({_id:bid})
        res.status(200).json(deleteBlog)
    }
    catch(err){
        res.status(404).json("error :",err)
    }
}

exports.viewUserBlog = async(req,res)=>{
    console.log("Inside user blog");
    const {uid} = req.params
    console.log(uid);
    try{
        const userblog = await blogs.find({userId:uid})
        if(userblog){
            res.status(200).json(userblog)
            console.log(userblog);
        }
        else{
            res.status(401).json("No such user")
        }
    }
    catch(error){
        res.status(404).json("Error : ",error)
    }
}

exports.updateBlog = async(req,res)=>{
    console.log("Inside update blog");
    const { title, category, postimage, body, userId, date } = req.body
    const {pid} = req.params
    const uploadImage = req.file?req.file.filename:postimage

    console.log(title, category, postimage, body, userId, date,pid);

    try{
        const updateBlog = await blogs.findByIdAndUpdate({_id:pid},{title, category, postimage:uploadImage, body, userId, date})
        await updateBlog.save()
        res.status(200).json(updateBlog)
    }
    catch(error){
        res.status(404).json("Error : ",error)
    }

}

exports.updateLikes = async(req,res)=>{
    console.log("Inside update likes");
    const {pid}=req.params
    const userId = req.payload;
    try{
        const likeblogs = await blogs.findById({_id:pid})
        if (likeblogs.likes.includes(userId)) {
            // If user already liked the post, remove the like
            likeblogs.likes.pull(userId);
        } else {
            // If user has not liked the post yet, add the like
            likeblogs.likes.push(userId);
            const payloadUser = await users.findById({_id:userId})
            const usrUp = await users.findByIdAndUpdate({_id:likeblogs.userId},{$push:{notification:`${payloadUser.username} liked your post`}})
            await usrUp.save()
        }
        await likeblogs.save();
        res.status(200).json(likeblogs);
    }
    catch(error){
        res.status(404).json("Error : ",error)
    }
}