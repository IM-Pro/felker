const Categories = require('../models/Category');
const Products = require('../models/Product');
const Notifications = require('../models/Notification');
const Data = require('../models/Data');
const mongoose = require('mongoose');

/**
 * Managing Product Categories:
 * - getting all categories
 * - get single category finding by ID
 * - update single category
 * - add new category
 * - delete category by ID
 */

exports.getAllCategories = async (req, res, next) => {
  req.categories = await Categories.all();
}

exports.getCategoryByID = async (req, res) => {
  const result = await Categories.get(req.params.id);

  res.send(result);
}

exports.updateCategory = async (req, res) => {
  await Categories.update(req.params.id, {
    'name': req.body.category_name
  });
}

exports.addNewCategory = async (req, res) => {
  res.addedCategory = await Categories.add(req.body);
}

exports.removeCategory = async (req, res) => {
  await Categories.remove(req.params.id);
}


/**
 * Managing all Product data
 * todo: check all functions!!!
 */

exports.addNewProduct = async (req, res) => {
  let prod = {
    title: req.body.prod_name.trim(),
    category: req.body.category.trim(),
    subtitle: req.body.subtitle.trim(),
    img: req.savedFileName || '',
    description: req.body.prod_description.trim(),
    modifications: {
      'A': { price: 0, description: '' },
      'B': { price: 0, description: '' },
      'C': { price: 0, description: '' },
      'D': { price: 0, description: '' },
      'E': { price: 0, description: '' },
      'F': { price: 0, description: '' }
    }
  };

  const obj = req.body
  let {
    ...modifications
  } = obj;

  Object.keys(modifications).forEach(key => {
    const temp = key.split('-');

    if (temp[0].toLowerCase() == 'mod')
      prod.modifications[temp[1]][temp[2]] = modifications[key].trim();
  });

  req.productTitle = prod.title;
  await Products.add(prod);
}

exports.getAllProducts = async (req, res) => {
  req.products = await Products.all();
}

exports.getProductModifications = async (req, res, next) => {
  const result = await Products.getModifications(req.params.id);
  const prices = req.body;
  let modifications = result.modifications;

  Object.keys(prices).forEach(key => {
    const [, , mod] = key.split('-');

    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(mod))
      modifications[mod].price = prices[key].trim();

  });

  req.product = {
    'modifications': modifications,
    'title': result.title
  };
}


exports.updateProduct = async (req, res) => {
  const id = req.params.id;

  let { ...modifications
  } = req.body;
  let prod = {
    title: req.body.prod_name.trim(),
    category: req.body.category,
    subtitle: req.body.subtitle.trim(),
    description: req.body.prod_description.trim(),
    modifications: { 'A': {}, 'B': {}, 'C': {}, 'D': {}, 'E': {}, 'F': {} }
  }

  Object.keys(modifications).forEach(key => {
    const [, mod, field] = key.split('-');

    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(mod))
      prod.modifications[mod][field] = modifications[key].trim();

  });

  if (req.savedFileName) {
    prod.img = req.savedFileName;
  }

  if (prod && Object.keys(prod).length > 0) {
    await Products.update(id, prod);
  } else {
    console.log(`something go wrong with product object...`);
  }
}

exports.getProductById = async (req, res) => {
  res.requestedProduct = await Products.get(req.params.id);
}

exports.removeProduct = async (req, res) => {
  await Products.remove(req.params.id);
}


/**
 * Managing messages and callbacks
 * from the site visitors
 */

exports.getAllNotifications = async (req, res) => {

  let callbacks = await Notifications.get('callback');
  const newCallbacksCount = await Notifications.countNew('callback');
  let messages = await Notifications.get('message');
  const newMessagesCount = await Notifications.countNew('message');

  req.notifications = {
    callbacks: {
      new: newCallbacksCount,
      data: callbacks
    },
    messages: {
      new: newMessagesCount,
      data: messages
    }
  }
}

exports.addNewNotification = async (req, res) => {

  req.body.type = req.params.type;
  let error = {};

  if (req.body.type != 'message' && req.body.type != 'callback') {
    error.format = 'Неверный формат запроса';
  }

  if (!req.body.username || req.body.username.length < 5) {
    error.username = 'Имя*: не менее 6 букв'
  }

  if (req.body.type == 'message') {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailPattern.test(req.body.email.trim())) {
      error.email = 'E-mail*: неверный формат';
    }

    if (req.body.message.length < 9 && req.body.message.split(' ').length < 2) {
      error.message = 'Сообщение*: напишите хотя бы пару слов';
    }
  }

  if (req.body.type == 'callback') {
    const phonePattern = /^[+]?[1-9]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{2}[-]?[0-9]{2})$/;

    if (!phonePattern.test(req.body.phone)) {
      error.phone = 'Телефон*: неверный формат';
    }
  }

  if (Object.keys(error).length > 0) {

    return req.notifictionErrors = error;
  }

  const newNote = await Notifications.add(req.body);
  req.report = {
    username: newNote.username,
    report: newNote.type == 'callback' ?
      `${newNote.username} Ваша заявка на обратный звонок зврегистрирована, мы свяжемся с Вами в ближайшее время` : `${newNote.username} Ваше сообщение отправлено, мы ознакомимся с ним в ближайшее время и, при необходимости, отправим ответ на email: ${newNote.email}`
  }
}


/**
 * Managing Site Common Data
 * GET, UPDATE and  ADD INITIAL DATA * 
 */

exports.getSiteCommonData = async (req, res) => {
  req.info = await Data.all();
}

exports.updateSiteCommonData = async (req, res) => {
  let data = {};
  data.meta = {};

  Object.keys(req.body).forEach(key => {
    let temp = key.split('_');
    const request = req.body;

    if (temp[0] == 'meta') {
      data['meta'][temp[1]] = request[key];
    } else if (key != '_method' && key != 'files') {
      let value = request[key];

      data[key] = value;
    }
  });

  await Data.update(req.params.id, data);
}

exports.addInitialData = (req, res, next) => {
  Data.add(req.data, (result, err) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }

  });
}