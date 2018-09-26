/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('trade_books', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },

      trade_id: {
        type: Sequelize.STRING,
        references: { model: 'trades', key: 'id' },
        allowNull: false,
      },

      book_id: {
        type: Sequelize.STRING,
        references: { model: 'owned_books', key: 'id' },
        allowNull: false,
      },

      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
      },

      is_requester: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    return queryInterface.dropTable('trade_books');
  },
};

