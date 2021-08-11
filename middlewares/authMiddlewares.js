const User = require('../models/User');

exports.bindUserWithReq = () =>{
    return async (req,res,next) =>{
        if(!req.session.isLoggedIn){
            return next();
        }

        try{

            let user = await User.findById(req.session.user._id);
            req.user = user;

            next()

        }catch(e){
            console.log(e);
            next(e);
        }
    }
}

exports.unAuthenticatedUser = (req,res,next) =>{
    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login');
    }
    next();
}

exports.authenticatedUser = (req,res,next) =>{
    if(req.session.isLoggedIn){
        return res.redirect('/dashboard');
    }
    next();
}