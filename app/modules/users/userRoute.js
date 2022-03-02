var express = require('express');
var router = express.Router();
var db = require('../../../config/db');
var userController = require('./controllers/userController');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var userValidator = require('./validations/user_validator');
var expressValidator = require('express-validator');
var userMiddleware=require('../../../middlewares/request_enc');
Users = db.connection.define('member_master');

router.use(expressValidator({
    customValidators: {
        
     isUnique (value,key) {
        ////console.log(value+""+key);
        var checkObj = {};
        checkObj[key] = value;
        ////console.log(checkObj);
        return new Promise((resolve, reject) => {
            Users.findOne({where:checkObj,
                attributes: ['member_id']})
            .then(response=>{
                if(response == null) { resolve(); }
                else{reject(); } })
            .catch((err)=>{
                throw err;
         }); });
    } }
}));

router.post('/register',[userMiddleware.encryption_request],userValidator.register, userController.register);
router.post('/login',[userMiddleware.encryption_request],userValidator.login, userController.login);

router.post('/userlisting/:id',userController.userListing);

router.post('/logout',userController.logout);
router.get('/getuserprofile', passport.authenticate('jwt',{session:false}),userController.getUserProfile);

router.get("/fire_socket/:id", userController.fire_socket);


module.exports = router;
