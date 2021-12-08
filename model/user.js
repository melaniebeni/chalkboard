const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		pwd: { type: String, required: true }
	},
	{ collection: 'Students' }
)
UserSchema.plugin(passportLocalMongoose);
const model = mongoose.model('UserSchema', UserSchema)
//UserSchema.index({ email: 'text', pwd: 'text' })
module.exports = model