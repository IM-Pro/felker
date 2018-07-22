const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [ String ]
});

const User = mongoose.model('users', UserSchema);

exports.update = async (id, data) => {
  return await User.updateOne({ _id: mongoose.Types.ObjectId(id) }, {...data} );
}

exports.get = async (id) => {
  return await User
    .find({_id: mongoose.Types.ObjectId(id)})
    .select('-password');
}

exports.getByName = async (name) => {
  return await User.findOne({login: name});
}

exports.add = async(entity) => {
  const data = new User( entity );

  return await data.save();
}

exports.remove = async (id) => {
  return await User.deleteOne({ _id: mongoose.Types.ObjectId(id) } );
}
exports.all = async () => {
  return await User.find().select('-password');
}