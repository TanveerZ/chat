
module.exports = {
    'secret': process.env.SECRET || 'supersecret',
    'http':'http',   
    'base_url': process.env.BASEURL || 'http://localhost:3000',
    'fornt_url': process.env.FORNTURL || 'http://localhost/project/#',
  
    'smtp': { 
      host: '',
      port: '',
      secure: false,
      user: '',
      pass: '',
      from: '"project" <no-reply@project.com>'
    },
    // Admin and user Referal _suffix
    'AdminRef':'adminref',
    'UserRef':'userref',
    'mysqlHOST':'localhost',
    'mysqlDB':'chatbotdb',
    'mysqlUSER':'root',
    'mysqlPASS':'',
    'mongoDB':'mongoDb',
    'mongoLive':'localhost',
    'mongoLocal':'localhost',
    //'MQLive':'amqp://rbmq:R3Pt98JNVWQjxbt2@34.225.136.46',
    'MQLive':'amqp://localhost',
    //'MQLive':'amqp://rbmq:R3Pt98JNVWQjxbt2@52.20.76.250',
    'MQLocal':'amqp://localhost',//'amqp://rbmq:R3Pt98JNVWQjxbt2@34.225.136.46',
    
    //'phpLoginURL':'http://s2.staging-host.com/zuflo_dev/verifyUser.php',
    'phpLoginURL':'', 
    'phpHost':'',
    'emailValidUrl':'',
    /**
     * email authentication limit
     */
    // Market Margin
    'market_margin':20,
    'save_logs' : {
      db: 'logs_stage',
      user: 'root',
      pass: '',
      host: 'localhost'
    } , 
    'ADDRESS_VAL_MODE' : 'testnet'
    
}; 
  
