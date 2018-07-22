const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const NotificationSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    get: v => moment(v).format('DD-MM-YYYY HH:mm')
  },
  phone: {
    type: String,
    trim: true,
    default: 'не указан',
    get: v => v.length > 0 ? v : 'не указан'
  },
  email: {
    type: String,
    trim: true,
    default: 'не указан',
    get: v => v.length > 0 ? v : 'не указан'
  },
  type: {
    type: String,
    enum: ['callback', 'message'],
    required: true
  },
  company: {
    type: String,
    trim: true,
    default: 'не указана',
    get: v => v.length > 0 ? v : 'не указана'
  },
  message: {
    type: String,
    trim: true
  },
  isWatched: {
    type: Boolean,
    default: false
  }
});

mongoose.model('notifications', NotificationSchema);
const Notification = mongoose.model('notifications');

exports.findById = async (id) => {
  return await Notification.find({
    _id: mongoose.Types.ObjectId(id)
  });
}

exports.get = async (type = '', limit = 10, offset = 0) => {
  const path = type ? {type: type} : {};

  return await Notification.find(path)
    .limit(limit)
    .skip(offset)
    .sort('-date');

}

exports.countNew = async (type = '') => {
  const path = type ? {type: type, isWatched: false} : {isWatched: false};
  
  return await Notification.count(path);
}

exports.remove = async (id) => {
  return await Notification.deleteOne({
    _id: mongoose.Types.ObjectId(id)
  });
}

exports.add = async (entity) => {
  const notification = new Notification({
    ...entity
  });
  return await notification.save();
}

exports.all = async () => {
  return await Notification.find({});
}
