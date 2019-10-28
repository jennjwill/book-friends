"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "bookId", {
      type: Sequelize.INTEGER,
      //allowNull: false,
      references: {
        model: "Books",
        key: "id",
        as: "bookId"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "bookId");
  }
};
