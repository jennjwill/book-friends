"use strict";
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER
        //allowNull: false
      }
    },
    {}
  );
  Book.associate = function(models) {
    // associations can be defined here
    Book.belongsToMany(models.User, {
      through: "UserBookList",
      foreignKey: "bookId",
      as: "usersListByBook"
    });
  };
  return Book;
};
