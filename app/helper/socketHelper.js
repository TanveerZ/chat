/***
 * All the socket helper function write on this file.
 * Below is the list of helper function which you can access according to method
 * Please provide parameter if any route required to access correct data
 * 
 * @author Durga Parshad
 * @since 24-April-2019
*/
var Sequelize = require('sequelize');
var dbConfig = require("../../config/db");
var TBL_USER_DATA = require('./../modules/users/schemas/userSchema')
var config = require('./../config');

module.exports = {
    /**
     * Function to getchat by userid
     * @param 'user_id'
     * @description Used for socket emit
     * @return Object
     * @author Tanveer Singh
     * @since 24-April-2019
     */
     userchat : async(user_id) => {
        // var emitName = 'pairs';
        // var pairsList = await Helper.pairsList(currency_id); 
         global.socketConnection.of('/exchange').emit('name','hi');  
            
       
    }
}
