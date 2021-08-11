const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : (req,file,cb) =>{
        cb(null , 'public/uploads')
    },
    filename : (req,file,cb) =>{
        cb(null , file.fieldname + '_' + Date.now() + '_' + file.originalname.replace(' ' , '-'))
    }
    
})

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {

        let filetypes = /jpeg|jpg|png|gif/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
          return cb(null, true);
        }
        cb(new Error(`Error: File upload only supports the following filetypes - ${filetypes}`));
        
    }
});


module.exports = upload;