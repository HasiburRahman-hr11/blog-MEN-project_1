const moment = require('moment');


module.exports = () =>{
    return (req,res,next) =>{
        res.locals.user = req.user;
        res.locals.isLoggedIn = req.session.isLoggedIn || false;

        res.locals.moment = (time) => moment(time).fromNow()

        next();
    }
}