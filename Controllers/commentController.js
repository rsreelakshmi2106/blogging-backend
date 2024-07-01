const blogs = require('../Models/blogSchema');
const comment = require('../Models/commentSchema');
const users = require('../Models/userSchema');
const { find } = require('../Models/userSchema');

exports.addComment = async(req,res)=>{
    console.log("inside add comment method");
    const {postId,text} = req.body
    const createDate = new Date();
    const userId = req.payload
    try{
        const newComment = new comment({
            postId,text,userId,createDate
        })
        await newComment.save()
        res.status(200).json(newComment)
        const post = await blogs.findById({_id:postId})
        const payloadUser = await users.findById({_id:userId})
        const notiUser = await users.findByIdAndUpdate({_id:post.userId},{$push:{notification:`${payloadUser.username} Commented on your post`}})
        await notiUser.save()
        console.log(newComment);
    }
    catch(err){
        res.status(404).json("Error "+err)
    }
}

exports.getComments = async(req,res)=>{
    // console.log("Inside get comments");
    const {pid} = req.params
    try{
        const blogComments = await comment.find({postId:pid})
        if(blogComments){
            res.status(200).json(blogComments)
        }
        else{
            res.status(401).json("No Comments")
        }
    }
    catch(err){
        res.status(404).json("Error "+err)
    }
}

exports.addReply = async(req,res)=>{
    console.log("Inside add reply");
    const {commentId,text} = req.body
    const userId = req.payload
    const createDate = new Date()
    try{
        const commentUpdate = await comment.findById(commentId)
        if(commentUpdate){
            const commentReply = {commentId,text,userId,createDate}
            commentUpdate.reply.push(commentReply)
            await commentUpdate.save()
            res.status(200).json(commentUpdate)
            // console.log(commentUpdate);
        }
        else{
            res.status(401).json("No such comment")
        }
    }
    catch(err){
        res.status(404).json("Error "+err)
    }
}

exports.deleteComm = async(req,res)=>{
    const {cid}=req.params
    console.log(cid);
    try{
        const comdel = await comment.findOneAndDelete({_id:cid})
        res.status(200).json(comdel)
    }
    catch(err){
        res.status(404).json("Error "+err)
    }
}

exports.deleteRep = async (req, res) => {
    const { cid, rid } = req.params;
    console.log(`Attempting to delete reply with ID ${rid} from comment with ID ${cid}`);

    try {
        // Update the comment by pulling out the reply with the specific reply id
        const result = await comment.updateOne(
            { _id: cid },
            { $pull: { reply: { _id: rid } } }
        );

        console.log('Update result:', result);

        // Check if the update was acknowledged and if a document was modified
        if (result.acknowledged && result.modifiedCount > 0) {
            res.status(200).json({ message: 'Reply deleted successfully' });
        } else {
            res.status(404).json({ message: 'Reply not found' });
        }
    } catch (err) {
        console.error('Error deleting reply:', err);
        res.status(500).json({ message: 'Error deleting reply: ' + err });
    }
};
