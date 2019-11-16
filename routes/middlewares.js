exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인하여 접근권한이 필요합니다');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        console.log("body parsing", req.body)
        next();
    } else {
        res.redirect('/');
    }
}