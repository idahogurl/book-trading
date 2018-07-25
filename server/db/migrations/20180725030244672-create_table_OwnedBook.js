/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('owned_books', {
      id: {
        type: Sequelize.TEXT,
        allowNull: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.TEXT,
        allowNull: true,
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

  down(queryInterface) {
    return queryInterface.dropTable('owned_books');
  },
};

