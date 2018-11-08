/* This file is auto-generated using https://github.com/harish2704/sequelize-migration-generator. */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'owned_books',
      {
        id: {
          type: Sequelize.STRING,
          allowNull: true,
          primaryKey: true,
        },

        book_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        user_id: {
          type: Sequelize.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' },
        },

        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        author: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        publication_year: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },

        image_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        available: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            name: 'owned_book_unique_index',
            method: 'BTREE',
            fields: ['book_id', 'user_id'],
            unique: true,
          },
        ],
      },
    );
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('owned_books');
  },
};
