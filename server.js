var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.set('strictQuery',false);
mongoose.connect('mongodb://localhost:27017/passport');

//Init app
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));

/**
 * Handlebarrs is a template engine for express. It renders views fr client side along with server side data. To use view engine in express we need to call the app.use() middleware and  create a folder name called views on the root level and we need to call the middleware  to set our views like this :
 * app.set('views',path.join(__dirname,'views)) where fisrt argument tells express that we are using view engine and the path is root directory + folder_name. Then we need to call app.engine() method and gives first argument as the engine name that we are using . It will be handlebars and second argument will be the handleBars built in method  engine() which calls the view engine.
 * 
 */

app.engine('handlebars', expressHandlebars.engine());



app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
/* 
1. Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
2. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
3. Given an object, this will iterate over the keys and check if any value is a signed cookie.
4. Parse a cookie value as a signed cookie.
5. The secret argument can be an array or string. If a string is provided, this is used as the secret.
*/
app.use(cookieParser());

//Set statuc folder
/**
 * It's a express midlewares which servers static files like html , css , images or any other statis documents.
 * The sintax is : app.use(express.static(root,[options]))
 * The root argument tells  us actually  from which folder it should serve the statis files. For example if our folder name is  public and if. it consists of some images , css file etc. We can serve an image file like this : 
 * Step1: express.static('public)
 * Step2: So now  from the browser or any client application we can access 
 * http://localhost:5000/images/profile.jpg
 */



app.use(express.static(path.join(__dirname, 'public')));
/* 
1. express-session accepts some properties.It is given below:
cookie,
cookie.domain, 
cookie.expires
2. Cookie is a settings object which is the session ID cookie. Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
3. Specifies the value for the Domain Set-Cookie attribute and cookie.expires properties have specifies the Date object to be the value for the Expires Set-Cookie attribute.
4. Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work. 
5. This module now directly reads and writes cookies on req/res. Using cookie-parser may result in issues if the secret is not the same between this module and cookie-parser.
*/

//Express Session
app.use(expressSession({
	secret: 'secret',
	saveUninitialized: true,
	resave:true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator

//TODO:Need to fix validation

// app.use(expressValidator({
// 	errorFormatter: function (param, msg, value) {
// 		var namespace = param.split('.')
// 			, root = namespace.shift()
// 			, formParam = root;
// 		while(namespace.length){
// 			formParam += '[' + namespace.shift() + ']';
// 		}
// 		return {
// 			param: formParam,
// 			msg: msg,
// 			value: value
// 		};
// 	}
// }));

//Connect flash
/* 

*/
app.use(connectFlash());
/* 
1. connectFlash is a module for Node.js . For example,
app.use(connectFlash());
2. connectFlash will give a massage when a user  is redirecting to a specified web-page.
3. For example, whenever, a user successfully logged in to his/her account then it gives a success massage.
4. express is needed connect-flash library to run
5. Flash messages are stored in the session. First, setup sessions as usual by enabling cookieParser and session middleware. Then, use flash middleware provided by connect-flash. 
*/
//Global vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.host = 'http://localhost:'+app.get('port');
	next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//Set Port
app.set('port',3300);

mongoose.connection.on('error', function(err) {
    console.log('Mongodb is not running.', err);
    process.exit();
}).on('connected', function() {
    app.listen(app.get('port'), function() {
        console.log('Server started at : http://localhost:' + app.get('port'));
    });
});