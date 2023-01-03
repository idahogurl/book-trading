// File is auto-generated. Do not modify!!
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize-cockroachdb');

var db = {};

try {
  var basename = path.basename(__filename);
  var env = process.env.NODE_ENV || 'development';
  var config = require(`${__dirname}/../config/config.json`)[env];

  var sequelize = new Sequelize(config.database, config.username, config.password, config);

  fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
} catch (e) {
  console.error(e);
}

module.exports = db;
