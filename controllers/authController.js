const User = require('../models/User');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const errorFormatter = require('../utils/errorFormatter');
const Flash = require('../utils/Flash');





// Signup Controllers
exports.signupGetController = (req,res,next) =>{
    res.render('auth/signup' , {
        title: 'Signup | Blog',
        error:{},
        value:{},
        flashMessage: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req,res,next) =>{
    let {username , email , password} = req.body;

    try{

        let errors = validationResult(req).formatWith(errorFormatter)

        if(!errors.isEmpty()){

            req.flash('fail' , 'Invalid information!')

            return res.render('auth/signup' , {
                title: 'Signup | Blog',
                error:errors.mapped(),
                value:{username , email , password},
                flashMessage: Flash.getMessage(req)
            })
        }
        console.log(errors.mapped())

        let hashedPassword = await bcrypt.hash(password , 11)

        let user = new User({
            username , 
            email , 
            password : hashedPassword
        });

        await user.save();

        req.flash('success' , 'Signup Successfull!')

        res.redirect('/auth/login');

    }catch(e){
        next(e)
    }
}


exports.loginGetController = (req,res,next) =>{
    res.render('auth/login' , {
        title: 'Login | Blog',
        error:{},
        value:{},
        passErr:{},
        flashMessage: Flash.getMessage(req)
    })
}
exports.loginPostController = async (req,res,next) =>{

    let {email , password} = req.body;

    try{

        let errors = validationResult(req).formatWith(errorFormatter)

        if(!errors.isEmpty()){
            req.flash('fail' , 'Invalid information!')
            return res.render('auth/login' , {
                title: 'Login | Blog',
                error: errors.mapped(),
                value: {email},
                passErr:{},
                flashMessage: Flash.getMessage(req)
            })
        }


        let user = await User.findOne({email})
        if(!user){
            req.flash('fail' , 'Invalid information!')
            return res.render('auth/login' , {
                title: 'Login | Blog',
                error: {},
                value: {email},
                passErr:{},
                flashMessage: Flash.getMessage(req)
            })
        }

        let matchPass = await bcrypt.compare(password , user.password)
        if(!matchPass){
            req.flash('fail' , 'Invalid information!')
            return res.render('auth/login' , {
                title: 'Login | Blog',
                error: {},
                value: {email},
                passErr:{
                    msg: 'Wrong Password!'
                },
                flashMessage: Flash.getMessage(req)
            })
        }

        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((error)=>{
            if(error){
                console.log(error);
                return next(error)
            }

            req.flash('success' , 'Logged in Successfully!')

            res.redirect('/dashboard')
        })

        

    }catch(e){

    }
}



exports.logoutGetController = (req,res,next) =>{
    req.session.destroy(function(err) {
        if(err){
            console.log(err)
            return next(err)
        }
        return res.redirect('/auth/login');
    });
}



exports.changePasswordGetController = (req , res , next) =>{
    res.render('auth/change-password' , {
        title: 'Change Password | Blog',
        flashMessage: Flash.getMessage(req),
        error:{},
        value:{},
        passErr:{}
    })
}


exports.changePasswordPostController = async(req,res,next) =>{

    let {oldPassword , newPassword , confirmPassword} = req.body;

    let errors = validationResult(req).formatWith(errorFormatter);
    if(!errors.isEmpty()){
        req.flash('fail' , 'Invalid Credentials!')
        return res.render('auth/change-password' , {
            title: 'Change Password | Blog',
            flashMessage: Flash.getMessage(req),
            error:errors.mapped(),
            value: {oldPassword , newPassword , confirmPassword},
            passErr:{}

        })
    }
    try{

        let match = await bcrypt.compare(oldPassword , req.user.password);

        if(!match){
            req.flash('fail' , 'Invalid Credentials!')
            return res.render('auth/change-password' , {
                title: 'Change Password | Blog',
                flashMessage: Flash.getMessage(req),
                error:errors.mapped(),
                value: {oldPassword , newPassword , confirmPassword},
                passErr:{
                    msg: 'Wrong Password!'
                },
            })
        }

        let hashedPass = await bcrypt.hash(newPassword , 11);

        await User.findOneAndUpdate(
            {_id:req.user._id},
            {$set: {password: hashedPass}}
        )

        req.flash('success' , 'Password updated successfully.');
        return res.redirect('/dashboard')

    }catch(e){
        console.log(e)
        next(e)
    }
}