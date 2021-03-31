"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserUsers extends Model {}
  UserUsers.init(
    {
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserUsers",
    }
  );
  return UserUsers;
};
