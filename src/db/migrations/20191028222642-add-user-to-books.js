"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Books", "userId", {
      type: Sequelize.INTEGER,
      //allowNull: false,
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Books", "userId");
  }
};
