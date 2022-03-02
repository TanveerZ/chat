//var date = new Date();  
//var crntDate = "";  
// crntDate += (date.getFullYear()) + "-";  
// crntDate += ((parseInt(date.getMonth())+1)<10?'0':'')+ (parseInt(date.getMonth())+1)+ "-";  
// crntDate += (date.getDate()<10?'0':'')+ date.getDate()+ " ";
// crntDate +=(date.getHours()<10?'0':'')+ date.getHours()+ ":"; 
// crntDate +=(date.getMinutes()<10?'0':'')+ date.getMinutes()+ ":"; 
// crntDate +=(date.getSeconds()<10?'0':'')+ date.getSeconds(); 

//UTC  DATE time
var currentUTCDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
module.exports.crntDate = currentUTCDateTime;