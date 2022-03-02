pe = require('parse-error');
var request = require('request');
const order_helpers = require("./app/helper/socketHelper");

ReE = function (res, code, msg, error) {
    let send_data = { success: false, status: code, message: msg, error: error };

    return res.json(send_data);
}

ReS = function (res, code, msg, data, token) {
    let send_data = { success: true, status: code, message: msg, token: token, data: data };
    return res.json(send_data);
};
returnOP = {
    success: function (response, statusCode, message, data, token) {
        //console.log("return success................************");
        let returnData = { status: true, statusCode: statusCode, message: message };
        if (data != undefined || data != null) {
            returnData['data'] = data;
        }
        if (token != undefined || token != null) {
            returnData['token'] = token;
        }
        return response.json(returnData);
    },
    fail: function (response, statusCode, message, error) {
        //console.log("return failed................???????");
        let returnData = { status: false, statusCode: statusCode, message: message };
        if (error != undefined || error != null) {
            returnData['error'] = error;
        }
        return response.json(returnData);
    }
};
date_time = function () {
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    return formatted;
};

await_post_request = function (input) {
    return new Promise(function (resolve, reject) {
        request.post(input, function (err, resp, body) {
            ////console.log(err, resp, body);
            //console.log("In Request complete");
            if (err) {
                resolve(err);
            } else {
                resolve(body);
            }
        })
    })
}
isObjEmpty = function isObjEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

encryptValue=function encryptValue(text){
    //var cipher = crypto.createCipheriv(algorithm,password)
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
UTCCurrentDateTime = function () {
    var globalVariables = require('./globalVariables');
    //UTC date time
    var dateCurrent = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return dateCurrent;
}

UTC24HoursBackDate = function () {
    var globalVariables = require('./globalVariables');
    var datetime = require('node-datetime');
    //UTC date time
    //let currentUTCDate = globalVariables.crntDate
    var currentUTCDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let dt = datetime.create(currentUTCDate)
    dt.offsetInHours(-24)
    return dt.format('Y-m-d H:M:S')
}
UTC24HoursBackDateNew = function (currentUTCDate) {
    var globalVariables = require('./globalVariables');
    var datetime = require('node-datetime');
    //UTC date time
    //let currentUTCDate = globalVariables.crntDate
    //var currentUTCDate=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let dt = datetime.create(currentUTCDate)
    dt.offsetInHours(-24)
    return dt.format('Y-m-d H:M:S')
},
/**
 * Custom UTC date offset in Days, Dev-S, Nov-01-2018
 */
UTCCustomBackDateInDays = function (currentUTCDate, limitDays) {
    var globalVariables = require('./globalVariables');
    var datetime = require('node-datetime');
    //UTC date time
    //let currentUTCDate = globalVariables.crntDate
    //var currentUTCDate=new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let dt = datetime.create(currentUTCDate)
    dt.offsetInDays(-limitDays)
    return dt.format('Y-m-d H:M:S')
},

getZflCoinId = function () {
    return 6;
}
sleep = function (ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

convert_to_bn = (value) =>{
    return math_operations(value, tradingConfig.smallest_unit, 'X');
 }
 

convert_to_bignumber = (amount)=>{
    BigNumber.set({ DECIMAL_PLACES: 20 })
    return new BigNumber(amount);
}

format_math = (result)=>{
   return result.substr(0, result.length-1);
}

/**
 * Generate random string
 */
randomString = function (length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}



/**
 * Function to consume the particular  data
 * 
 */
consumeSocket  = function() {

}

