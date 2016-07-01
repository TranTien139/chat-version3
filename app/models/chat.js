var mongoose = require('mongoose');

var ChatSchema = mongoose.SChema({
	mainchat: {
		user1:{fullname:String, id:String},
		user2:{fullname:String, id:String},
		content:{
			name_user_send: String,
			message: String,
			date: date.now(),
		}
	}

});

module.exports = mongoose.model('Mainchat', ChatSchema);