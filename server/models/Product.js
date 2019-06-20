const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  img: {
    type: String,
    default: '/img/felker-products.png'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  modifications: {
    'A': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    'B': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    'C': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    'D': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    'E': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    },
    'F': {
      price: {
        type: Number,
        default: 0,
        min: 0
      },
      description: {
        type: String,
        default: ''
      }
    }
  },
});



mongoose.model('products', ProductSchema);
const Product = mongoose.model('products');

exports.get = async (id) => {
  return await Product.find( { _id: mongoose.Types.ObjectId(id) } )
  .populate('category', 'name');
}

exports.remove = async (id) => {
  return await Product.deleteOne( { _id: mongoose.Types.ObjectId(id) } );
}

exports.update = async (id, data) => {
  return await Product.updateOne( { _id: mongoose.Types.ObjectId(id) }, data );
}

exports.add = async (entity) => {
  const product = new Product(entity);

  return await product.save();
}
exports.getModifications = async (id) => {
  return await Product
  .findOne( {_id: mongoose.Types.ObjectId(id) } )
  .select('title modifications');
}
exports.all = async () => {
  return await Product.find();
}