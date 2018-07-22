const multer = require('multer');
const moment = require('moment');
const path = require('path');


const storage = multer.memoryStorage()
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, '../uploads'))
//   },
//   filename: (req, file, cb) => {
//     const date = moment().format('DDMMYYY-HHmmss-SSS');
//     const formedName = `${date}-${file.originalname}`;

//     cb(null, formedName)
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = new RegExp('/jpeg|jpg|gif|png/');

//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {

//     cb(null, true);
//   } else {
//     cb(new Error('Ошибка: файл не соответствует формату изображения!'))
//   }
// }

const limits = {
  fileSize: 1024 * 1024 * 5 // 5mb
}

module.exports = multer({
  storage,
  limits
}).any();