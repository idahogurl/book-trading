/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('trade_book', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.fn('gen_random_uuid'),
      },

      trade_id: {
        type: Sequelize.UUID,
        references: { model: 'trade', key: 'id' },
        allowNull: false,
      },

      book_id: {
        type: Sequelize.UUID,
        references: { model: 'owned_book', key: 'id' },
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
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
        defaultValue: Sequelize.fn('now'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },

    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('trade_book');
  },
};
