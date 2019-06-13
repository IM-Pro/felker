const faIcons = require('font-awesome-v5-icons');

exports.getListOfFA5Icons = async () => {
  return await faIcons.getList();
}