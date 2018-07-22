const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  meta: {
    noindex: {
      type: Boolean
    },
    title: {
      type: String,
      trim: true,
      default: 'Felker | сухие строительные смеси от производителя'
    },
    keywords: {
      type: String,
      trim: true,
      default: 'клей, штукатурка, короед, сухие смеси, строительные смеси, купить штукатурку, купить короед'
    },
    description: {
      type: String,
      trim: true,
      default: 'продажа сухих строительных смесей от производителя в Крыму и Севастополе'
    }
  },
  subtitle: {
    type: String,
    trim: true,
    default: 'Сухие строительные смеси соответствуют межгосударственному стандарту ГОСТ 31189-2015 и выполнены по <b>ТУ 5745–001–00296319–2015</b>'
  },
  phone: {
    type: String,
    trim: true,
    default: '+7(978)136-95-00'
  },
  email: {
    type: String,
    trim: true,
    default: 'office@felker-pro.ru'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  img: {
    type: String,
    trim: true,
    default: 'img/felker-products.png'
  },
});

const Data = mongoose.model('infos', DataSchema);

exports.update = async (id, data) => {
  return await Data.updateOne({_id: mongoose.Types.ObjectId(id)}, {...data});
}

exports.all = async () => {
  return await Data.find({});
}

exports.add = async (entity) => {
  const data = new Data({...entity});

  return await data.save();
}