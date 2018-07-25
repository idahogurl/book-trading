const path = require('path');
const ect = require('ect')();
const fs = require('fs');

const Classes = require('sequelize-migration-generator');

const TEMPLATE = path.resolve(`${__dirname}/../../node_modules/sequelize-migration-generator/data/migration-file.js.ect`);
const Model = Classes.Model;
const Field = Classes.Field;
let modelsDir = '/./models';
let migrationsDir = '/./migrations';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/config/config.json`)[env];

const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

function getTimeStamp(i) {
  return new Date(Date.now() + i).toISOString().replace(/[-:.TZ]/g, '');
}

function genMigration(model, i) {
  const m = new Model(model);
  const out = ect.render(TEMPLATE, { model: m, fieldOpts: Field.opts });
  const timestamp = getTimeStamp(i);
  const fname = `${timestamp}-create_table_${model.name}.js`;

  fs.writeFileSync(path.join(migrationsDir, fname), out);
}

function importModels(modelDir) {
  const db = {};
  fs
    .readdirSync(modelDir)
    .filter(file => (file.indexOf('.') !== 0) && !file.includes('index') && (file.slice(-3) === '.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(modelDir, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
}


function main() {
  modelsDir = path.resolve(`${__dirname}${modelsDir}`);
  migrationsDir = path.resolve(`${__dirname}${migrationsDir}`);
  const models = importModels(modelsDir);

  Object.keys(models)
    .forEach((modelName, i) => {
      genMigration(models[modelName], i);
    });
}


main();

