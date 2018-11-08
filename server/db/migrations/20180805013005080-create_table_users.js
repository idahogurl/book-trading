/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },

      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      screen_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  },
};

