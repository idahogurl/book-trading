/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
      },

      full_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('users');
  },
};

