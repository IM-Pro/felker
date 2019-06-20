const cloudinary = require('cloudinary');
const logger = require('../startup/logging');
const config = require('../config/settings');

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret
});

module.exports = (req, res, next) => {

  const types = new RegExp('png|jpg|jpeg');
  const file = req.files[0];

  if (!file || !file.mimetype) return next();

  if (types.test(file.mimetype)) {
    cloudinary.v2
      .uploader
      .upload_stream(
        { 
          resourse_type: 'raw',
          transformation: [
            { height: 255, quality: "auto", crop: "scale" }
          ]
        },
        (error, result) => {
          if (error) {
            logger.error(`Error occured while uploading file to cloudinary...\n${error}`);
            next(error);
          } else {
            logger.debug(`Cloudinary upload result: ${result}`);
            req.savedFileName = result.secure_url;
            next();
          }
        }
      )
      .end(file.buffer);
  } else {
    req.flash('error_msg', 'Неверный формат картинки!');
    next();
  }

}


// const uploadFile = (file, filter = { width: 1200, height: 900 }) => new Promise((resolve, reject) => {
//   const imgTypesPattern = new RegExp('png|jpg|jpeg');

//   if (!imgTypesPattern.test(file.mimetype)) {
//     return reject(new Error('Недопустимый формат файла!'));
//   }

//   uploader
//     .upload_stream(
//       { 
//         resourse_type: 'raw',
//         transformation: [
//           { ...filter, quality: "auto", crop: "crop", gravity: "auto" }
//         ]
//       },
//       (error, result) => {
//         error ? reject(error) : resolve(result.secure_url)
//       }
//     )
//     .end(file.buffer)
// });

// module.exports.uploadImages = async (req, res, next) => {

//   try {
//     console.log('REQ FILES: ', req.files);
//     req.savedFiles = (req.files && req.files.length) ? await Promise.all(
//       req.files.map(file => uploadFile(file))
//     ) : [];

//     next();
//   } catch (ex) {
//     res.status(400).json({ success: false, errors: { uploadFiles: ex.message } })
//   }
// }

// module.exports.uploadImagesFromForm = async (files, filter = { width: 225, height: 225 }) => {
//     files = (files && files.length) ? await Promise.all(
//       files.map(file => uploadFile(file, filter))
//     ) : [];

//     return files;
// }