const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

const fileFilter = (req,file,callBack)=>{
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        callBack(null,true)
    }
    else{
        callBack(null,false)
        return callBack(new Error("Please upload following image extension(png,jpeg,jpg) only"))
    }
}

const multerConfig = multer({
    storage,fileFilter
})

module.exports = multerConfig