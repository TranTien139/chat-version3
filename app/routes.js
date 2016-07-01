var User       = require('../app/models/user');
var async = require('async');
var path = require('path');
module.exports = function(app, passport,server) {
	app.get('/', function(request, response) {
    response.render('index.html');
  	});

 //  	app.get('/edit', auth, function(request, response) {
	// 	response.render('edit.html', {
	// 		user : request.user
	// 	});
	// });

	app.get('/admin', auth, function(request, response) {
		response.render('admin.html', {
			user : request.user
		});
	});

	app.get('/logout', function(request, response) {
		request.logout();
		response.redirect('/login');
	});

		app.get('/login', function(request, response) {
			response.render('login.html', { message: request.flash('error') });
			//response.render('login.html');
		});

		app.post('/login', passport.authenticate('login', {
			successRedirect : '/admin', 
			failureRedirect : '/login', 
			failureFlash : true
		}));

		app.get('/signup', function(request, response) {
			//response.render('signup.html');
			response.render('signup.html', { message: request.flash('signuperror') });
		});


		app.post('/signup', passport.authenticate('signup', {
			successRedirect : '/admin',
			failureRedirect : '/signup', 
			failureFlash : true 
		}));

		// app.get('/edit', function(request, response) {
		// 	response.render('edit.html', { message: request.flash('updateerror') });
		// });

		// app.post('/edit',  function (req, res){
		// 		 var tempPath = req.files.file.path,
  //       			targetPath = path.resolve('./uploads/'+req.files.file.originalFilename);
  //   				if (path.extname(req.files.file.name).toLowerCase() === '.png') {
  //       				fs.rename(tempPath, './uploads/image_'+req.user._id, function(err) {
  //           					if (err) throw err;
  //           				console.log("Upload completed!");
  //       				});
  //   				}
 	// 		 User.findOne({ 'user.email' :  req.body.email }, function(err, user) {
  //               		if (err){ return done(err);}
  //               		if (user)
  //                   			user.updateUser(req, res)

  //                        });
  // 		});
		
	// 	app.get('/profile', auth, function(request, response) {
	// 		var query = Friend.find({'friend.mainfriendid': request.user._id}, { 'friend.anotherfriendid': 1 });
	// 		query.exec(function(err, friends) {

 //      		if (!err) {
	// 	var frdDetails = []

	// 	async.each(friends,
 //    			function(friend, callback){
	// 			if(friend.friend.anotherfriendid == ''){
	// 		console.log('No Friend')
	// 			}else{
 //    					User.findById(friend.friend.anotherfriendid, function(err, user) {
	// 					frdDetails.push(user.user.name+', '+user.user.address);
 // 						callback();
	// 				});
 //   				}
 //  			},
 //  			function(err){
 //         			response.render('profile.html', {
	// 				user : request.user,
	// 				friends: frdDetails
	// 			});
 //  			}
	// 	);
 //       		} else {
 //         		res.send(JSON.stringify(err), {
 //            			'Content-Type': 'application/json'
 //         		}, 404);
 //      		}
 //   		});

	// });

};

function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}