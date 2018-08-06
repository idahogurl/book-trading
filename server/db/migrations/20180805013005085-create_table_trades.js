/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('trades', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },

      book_id: {
        type: Sequelize.STRING,
        references: { model: 'owned_books', key: 'id' },
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

      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('trades');
  },
};

