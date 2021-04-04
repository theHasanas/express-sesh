"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserContacts extends Model {}
  UserContacts.init(
    {
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserContacts",
    }
  );
  return UserContacts;
};
