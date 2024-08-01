module.exports = (req,res,next)=>{
    if (req.session.userLogin) {
        res.locals.userLogin = req.session.userLogin;
    } else {
        res.locals.userLogin = null;
    }
    next()
};