'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      "Users",
      "role",
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "member"
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "role");
  }
};
