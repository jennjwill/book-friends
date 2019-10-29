"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "must be a valid email" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "member"
      }

      // bookId: {
      //   type: DataTypes.INTEGER
      // }
    },

    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Book, {
      through: "UserBookList",
      foreignKey: "userId",
      as: "books"
    });
  };

  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  return User;
};
