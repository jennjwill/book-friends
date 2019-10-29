"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserBookList = sequelize.define(
    "UserBookList",
    {
      userId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER
    },
    {}
  );
  UserBookList.associate = function(models) {
    // associations can be defined here
    UserBookList.belongsTo(models.User, {
      foreignKey: "userId"
    });
    UserBookList.belongsTo(models.Book, {
      foreignKey: "bookId"
    });
  };
  return UserBookList;
};
