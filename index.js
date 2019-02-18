var express=require('express');
var path=require('path');
var cookieparser=require('cookie-parser');
var bodyparser=require('body-parser');
var exphbs=require('express-handlebars');
var expressvalidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var localstrategy=require('passport-local').Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/loginsystem',{ useNewUrlParser: true });
var db=mongoose.connection;  

var routes=require('./routes/index');
var users=require('./routes/users');

var app=express();


app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(cookieparser());

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(expressvalidator({
	errorFormatter:function(param,msg,value) {
		var namespace=param.split('.')
		,root=namespace.shift()
		, formParam =root;

		while(namespace.length) {
			formParam +='['+ namespace.shift()+ ']';
		}
		return {
			param: formParam,
			msg  : msg,
			value: value
		};

		
	}
}));

app.use(flash());

app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user=req.user||null;
	next();
});

app.use('/',routes);
app.use('/users',users);
app.set('port',(process.env.PORT || 3000));
app.listen(3000);