var Sequelize = require('sequelize');
var config = require('../app/config')
// module.exports =  new Sequelize('mysql://root:@localhost:3000/node_exchange', opts);
 module.exports = {     
    secret : "secret",
    savePath : "./uploads/",
    connection : new Sequelize(config.mysqlDB, config.mysqlUSER, config.mysqlPASS,{
        dialect: 'mysql',
        host: config.mysqlHOST, 
        operatorsAliases: 0,
        logging: false,
        define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                freezeTableName: true,
                underscored: true,
                timestamps: true
        },
        pool: {
          max: 20,
          min: 0,
          acquire: 2000000,
          idle: 2000000
        }
    }),
    connection_function : ()=>{
      return new Sequelize(config.mysqlDB, config.mysqlUSER, config.mysqlPASS,{
        dialect: 'mysql',
        host: config.mysqlHOST, 
        operatorsAliases: false,
        logging: false,
        define: {
              charset: 'utf8',
              collate: 'utf8_general_ci',
              freezeTableName: true,
              underscored: true,
              timestamps: true
        }
      })
    },      
    mongo: { //host : '192.168.1.132',
    // host:config.mongoLocal,//local mongoip 
      host:config.mongoLive,//Live mongoip
    db: config.mongoDB, username : '', password : ''}// staging
   
    
} 