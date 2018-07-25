/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('requested_books', {
      book_id: {
        type: Sequelize.TEXT,
        references: { model: 'OwnedBook', key: 'id' },
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.TEXT,
        references: { model: 'User', key: 'id' },
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

  down(queryInterface) {
    return queryInterface.dropTable('requested_books');
  },
};

