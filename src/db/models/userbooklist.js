"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserBookList = sequelize.define(
    "UserBookList",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: "user",
          key: "bookId"
        }
      },
      bookId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        references: {
          model: "book",
          key: "userId"
        }
      }
    },
    {}
  );
  UserBookList.associate = function(models) {
    // associations can be defined here
    UserBookList.belongsTo(models.User, {
      foreignKey: "userId",
      as: "User"
    });
    UserBookList.belongsTo(models.Book, {
      foreignKey: "bookId",
      as: "Book"
    });
  };
  return UserBookList;
};
