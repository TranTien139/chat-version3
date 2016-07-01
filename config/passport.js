var User       = require('../app/models/user');

var LocalStrategy    = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialized when subsequent requests are made
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

     passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
       process.nextTick(function() {
            User.findOne({ 'user.email' :  email }, function(err, user) {
                if (err){ return done(err);}
                if (!user)
                return done(null, false, req.flash('error', 'User does not exist.'));
                  //return done(null, false);

                if (!user.verifyPassword(password))
                return done(null, false, req.flash('error', 'Enter correct password'));
               // return done(null, false);
               else
                    return done(null, user);
            });
        });

    }));

     passport.use('signup', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true 
    },
    function(req, email, password, done) {

        process.nextTick(function() {
       
            if (!req.user) {
                User.findOne({ 'user.email' :  email }, function(err, user) {
            	    if (err){ return done(err);}
                    if (user) {
                        return done(null, false, req.flash('signuperror', 'User already exists'));
                        //return done(null, false);
                    } else {
                        var newUser            = new User();
			newUser.user.fullname    = req.body.fullname;
                        newUser.user.email    = email;
                        newUser.user.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });
            } else {
                var user            = req.user;
		          user.user.fullname    = req.body.fullname;
                user.user.email    = email;
                user.user.password = user.generateHash(password);
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });
    }));

};
