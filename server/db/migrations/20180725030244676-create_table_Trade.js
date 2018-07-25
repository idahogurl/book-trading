/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */


module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('trades', {
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
        primaryKey: true,
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
    return queryInterface.dropTable('trades');
  },
};

