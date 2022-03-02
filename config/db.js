var Sequelize = require('sequelize');
var config = require('../app/config')
// module.exports =  new Sequelize('mysql://root:@localhost:3000/node_exchange', opts);
 module.exports = {     
    secret : "secret",
    savePath : "./uploads/",
    connection : new Sequelize(config.mysqlDB, config.mysqlUSER, config.mysqlPASS,{
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
    bot_connection : ()=>{
      return new Sequelize(config.mysqlDBBOT, config.mysqlUSERBOT,config.mysqlPASSBOT,{
        dialect: 'mysql',
        host: config.mysqlHOSTBOT, 
        operatorsAliases: false,
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
      });
    }, 
    stage_logs : ()=>{
      return new Sequelize(config.save_logs.db, config.save_logs.user,config.save_logs.pass,{
        dialect: 'mysql',
        host: config.save_logs.host, 
        operatorsAliases: false,
        logging: false,
          define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                freezeTableName: true,
                underscored: true,
                timestamps: true
          }
        });
    },
    graph_connection : () => {
      return new Sequelize(config.mysqlDB, config.mysqlUSER,config.mysqlPASS,{
        dialect: 'mysql',
        host: config.mysqlHOST, 
        operatorsAliases: false,
        logging: false,
        dialectOptions: {
          connectTimeout: 60000
        },
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
      })
    },      
    mongo: { //host : '192.168.1.132',
    // host:config.mongoLocal,//local mongoip 
      host:config.mongoLive,//Live mongoip
    db: config.mongoDB, username : '', password : ''}// staging
   
    
} 