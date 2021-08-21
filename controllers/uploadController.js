const Profile = require('../models/Profile');
const User = require('../models/User');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

exports.profilePicsUploadController = async (req,res,next) =>{

    if(req.file){
        try{

            let oldProfilePics = req.user.profilePics;
            let filePath = await cloudinary.uploader.upload(req.file.path)


            // let profilePics = `/uploads/${req.file.filename}`
            let profilePics = filePath.secure_url;

            let profile = await Profile.findOne({user: req.user._id})

            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePics : profilePics}}
                )
            }

            await User.findOneAndUpdate(
                {_id:req.user._id},
                {$set : {profilePics : profilePics}}
            )

            if(oldProfilePics !== '/uploads/avatar.png'){
                cloudinary.uploader.destroy(filePath.secure_url, function(result) { console.log(result) });
            }
            // if(oldProfilePics !== '/uploads/avatar.png'){
            //     fs.unlink(`public${oldProfilePics}` , (err)=>{
            //         if(err){
            //             console.log(err)
            //         }
            //     })
            // }

            res.status(200).json({profilePics})
    
        }catch(e){
            res.status(500).json({
                profilePics: req.user.profilePics
            });
        }
    }else {
        res.status(500).json({
            profilePics: req.user.profilePics
        });
    }

}


exports.removeProfilePics = (req,res,next) => {
    try{

        let defaultProfilePics = '/uploads/avatar.png';
        let currentProfilePics = req.user.profilePics;

        fs.unlink(`public${currentProfilePics}` ,async (err) =>{
            let profile = await Profile.findOne({user: req.user._id})

            if(profile){
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePics : defaultProfilePics}}
                )
            }

            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profilePics : defaultProfilePics}}
            )

            res.status(200).json(
                {profilePics : defaultProfilePics}
            )
        })

        
        
    }catch(e){
        console.log(e)
        res.status(500).json({
            message: "Cannot remove profile picture."
        })
    }
}


exports.postImageUploadController = (req,res,next) => {
    if(req.file){
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }

    return res.status(500).json({
        message: 'Internal server error!'
    })
}