const User = require('../models/User');
const Flash = require('../utils/Flash');

exports.authorPostGetController = async(req,res,next) => {
    let userId = req.params.userId
    try{

        let author = await User.findById(userId)
            .populate({
                path: 'profile',
                populate: {
                    path: 'posts'
                }
                
            });
        
            res.render('explorer/author-post' , {
                title: `User/${userId} | Blog`,
                flashMessage: Flash.getMessage(req),
                author
            })

    }catch(e){
        next(e)
    }
}