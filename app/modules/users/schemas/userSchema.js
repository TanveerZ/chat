var db = require('../../../../config/db');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

var User = db.connection.define('user_master', {
    user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name : {
        type : Sequelize.STRING,
        allowNull : true,
        validate : {
        }
      },
      last_name : {
        type : Sequelize.STRING,
        allowNull : true,
        validate : {
        }
      },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
        }
    },
    account_status: {
        type: Sequelize.ENUM('1', '0'),
        allowNull: true,
        defaultValue: "1",
        validate: {
        }
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: false
    }
});
module.exports = User;

