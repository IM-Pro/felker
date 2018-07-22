const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  }
});

mongoose.model('categories', CategorySchema);
const Category = mongoose.model('categories');

exports.get = async (id) => {
  return await Category.find({
    _id: mongoose.Types.ObjectId(id)
  });
}

exports.remove = async (id) => {
  return await Category.deleteOne({
    _id: mongoose.Types.ObjectId(id)
  });
}

exports.update = async (id, data) => {
  return await Category.updateOne({
    _id: mongoose.Types.ObjectId(id)
  }, { ...data});
}

exports.add = async (entity) => {
  const category = new Category({
    name: entity.name
  });
  return await category.save();
}

exports.all = async () => {
  return await Category.find({});
}