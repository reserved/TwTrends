var express = require('express');
var router = express.Router();

var twitter = require('twitter-api').createClient();

router.get('/',function(req,res){
	res.render('login',{title: 'Parrot Trends | Unsigned'});  		
});

router.get('/app', function(req, res){

twitter.setAuth ( 
    'pNW9U55Ou9XgniHqTQ6Oc7bpJ',
    'doOmeYU26hDKCCBVQQbLtsyYuUhrgfFi6cbPn9kmztk8xcQO6R', 
    '108829645-FkOjKZbq9IB4dTI2YxTJQR899H1sToiApiZLX4Yx',
    'kKuuGPzPTGAePA1yIt1gZgxXnwCAWuXwp3KBt1ZRLjT2o' 
);

twitter.get( 'account/verify_credentials', { skip_status: true }, function( user, error, status ){
    console.log( user ? 'Authenticated as @' + user.screen_name : 'Not authenticated' );
	res.render('index', { title: 'Parrot Trends', 'data': user });
});
});

module.exports = router;