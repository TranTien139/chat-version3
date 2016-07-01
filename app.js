var app = require('express')();
var express = require('express');
var server = require('http').createServer(app);
var flash    = require('connect-flash');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var io = require('socket.io')(server);
var mongoose = require('mongoose');

var users={}

mongoose.connect('mongodb://localhost/chat',function(err){
  if(err){
    console.log(err);
  }else{
    console.log('connect mongodb success');
  }
});

require('./config/passport.js')(passport); 
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use( bodyParser.urlencoded({ extended: true }) );
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.use(session({secret: '{secret}', name: 'session_id', saveUninitialized: true, resave: true}));
  app.use(passport.initialize()); 
  app.use(passport.session());
  app.use(flash());
}
require('./app/routes.js')(app, passport,server); 

var obj = {};
io.on('connection', function(socket){

  socket.on('new user',function(data, callback){
    if(data in users){
    callback(false);
    } else{
  		callback(true);
  		socket.nickname = data;
      users[socket.nickname] = socket;
  		updateNickName();
    }
  });


  socket.on('no user',function(data, callback){
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNickName();
  });

  socket.on('delete no user',function(data){
    delete users[socket.nickname];
    updateNickName();
  });

  socket.on('connected', function(ele){
    console.log(ele.nameTo,ele.nameFrom);
    obj[ele.nameFrom] = socket.id;
    console.log(obj);
  });
  socket.on('chat message', function(msg){
      console.log(obj[msg.nameTo],socket.id);
      io.to(obj[msg.nameTo]).emit('chat message', msg);
      io.to(obj[msg.nameFrom]).emit('chat message', msg);
  });

  function updateNickName(){
  	io.sockets.emit('usernames',Object.keys(users));
  }

  socket.on('disconnect', function(data){
  	if(!socket.nickname) return;
    delete users[socket.nickname];
  	updateNickName();
  });
});

server.listen(3000, function(){
  console.log('listening on :3000');
});
