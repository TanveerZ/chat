var config = require("../config");
const striptags = require('striptags');
var dbConfig = require("../../config/db");
var Sequelize = require('sequelize');
//TBL profile



exports.commen = {    
    
    randomBite: async() => {
        var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";          
            for (var i = 0; i < 50; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));         
            return text;
    }
} 