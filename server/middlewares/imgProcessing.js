const cloudinary = require('cloudinary');
const logger = require('../startup/logging');
const config = require('../config/settings');

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret
});

module.exports = (req, res, next) => {

  const types = new RegExp('/png|jpg|jpg/');
  const file = req.files[0];

  if (types.test(file.mimetype)) {
    cloudinary.v2
      .uploader
      .upload_stream({
          resource_type: 'raw'
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



  // try {
  //   let image = await Jimp.read(file.buffer);    

  //   const dest = path.resolve(__dirname, '../upload_storage');
  //   const date = moment().format('DDMMYYY-HHmmss-SSS');
  //   const uploadedFileName = `${date}-${file.originalname}`;

  //   switch(image.getMIME()) {
  //     case Jimp.MIME_JPEG:
  //       image
  //       .quality(opts.quality)
  //       .scaleToFit(opts.width, opts.height)
  //       .write(`${dest}/${uploadedFileName}`);
  //       break;

  //     case Jimp.MIME_PNG:
  //       image
  //       .scaleToFit(opts.width, opts.height)
  //       .write(`${dest}/${uploadedFileName}`);
  //       break;

  //     default:
  //       throw new Error('Неверный формат изображения');
  //       break;
  //   }

  //   return `upload_storage/${uploadedFileName}`;

  // } catch(ex) {
  //   console.log('Error! Converting image failed: ', ex);
  //   throw new Error('Error! Converting image failed!');
  // }
}