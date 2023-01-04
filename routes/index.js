var express = require('express');
var router = express.Router();

//Get Homepage
router.get('/', ensureAuthenticated, function (req, res) {
    return res.render('index', {
        user: {
            name: req.user.name,
            username: req.user.username,
            email: req.user.email
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        // req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}
module.exports = router;