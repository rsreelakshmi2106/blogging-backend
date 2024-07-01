const express = require('express')

const userController = require('../Controllers/userController')
const blogController = require('../Controllers/blogController')
const jwtMiddleware = require('../Middlewares/jwtMiddleware')
const multerConfig = require('../Middlewares/multerMiddleware')
const commentController = require('../Controllers/commentController')

const router = express.Router()

router.post('/register',userController.register)

router.post('/login',userController.login)

router.post('/blog/add-blog',jwtMiddleware,multerConfig.single('postimage'),blogController.useraddBlog)

router.get('/blog/all-blog',blogController.getAllBlogs)

router.get('/blog/user-blog',jwtMiddleware,blogController.getUserBlog)

router.get('/view-blog/:bid',blogController.getABlog)

router.get('/get-user-detail/:uid',userController.getUser)

router.get('/get-login-id',jwtMiddleware,userController.getUserId)

router.delete('/delete-a-post/:bid',jwtMiddleware,blogController.deleteABlog)

router.get('/view-user-blog/:uid',blogController.viewUserBlog)

router.put('/profile/update-profile/:uid',jwtMiddleware,multerConfig.single('userImage'),userController.updateUserProfile)

router.post('/comment/add-comment',jwtMiddleware,commentController.addComment)

router.get('/comment/get-comments/:pid',commentController.getComments)

router.put('/comment/add-reply',jwtMiddleware,commentController.addReply)

router.put('/blog/update-blog/:pid',jwtMiddleware,multerConfig.single('postimage'),blogController.updateBlog)

router.put('/blog/likes/:pid',jwtMiddleware,blogController.updateLikes)

router.get('/user/all-users',userController.getAlluser)

router.delete('/comment/delete-reply/:cid/:rid',jwtMiddleware,commentController.deleteRep)

router.delete('/comment/delete-comment/:cid',jwtMiddleware,commentController.deleteComm)

router.put('/user/set-user-status',userController.setUserStatus)

router.get('/get-notifications',jwtMiddleware,userController.getNotifications)

router.delete('/notification/clear',jwtMiddleware,userController.clearNotifications)

module.exports = router