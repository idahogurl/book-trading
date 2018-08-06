const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto('../../dev.sqlite3', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: '../../dev.sqlite3',
  additional: {
    timestamps: true,
  },
});

auto.run((err) => {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
