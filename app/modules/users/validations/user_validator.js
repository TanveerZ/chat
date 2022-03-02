var globalfn=require('../../../../globalfunctions')
var user = {
    register : function(req,res,next){
        // req.checkBody('name').notEmpty().withMessage('Name is required.')
        //                         .isLength({min:3,max:45}).withMessage('Name should be at least 3 characters but not more than 45.');

        // req.checkBody('username').notEmpty().withMessage('Username is required.')
        //                         .isLength({min:3,max:15}).withMessage('Username should be at least 3 characters but not more than 15.')
        //                         .isUnique('username').withMessage('This username is not available.');

        req.checkBody('email').notEmpty().withMessage('email is required.')
                            .isEmail().withMessage('email format is not valid.')
                            .isUnique('email').withMessage('Email already in use.');

        req.checkBody('password').notEmpty().withMessage('Password is required.')
        .isLength({min:5,max:15}).withMessage('Password should be at least 5 characters but not more than 15.');

        req.getValidationResult().then(function(result){
            var errorArr = [];
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    errorArr.push(error.msg);
                    let send_data = {message:error.msg};
                    res.status(400).json(send_data);
                });
                
               //res.status(401).json({ message: errorArr });
            }else{
                next();
            }
        });
        const unhandledRejections = new Map();
        process.on('unhandledRejection', (reason, p) => {
            unhandledRejections.set(p, reason);
        });
        process.on('rejectionHandled', (p) => {
            unhandledRejections.delete(p);
        });
    },
    login : function(req,res,next){
        req.checkBody('email').notEmpty().withMessage('email is required.')
            .isEmail().withMessage('email format is not valid.');
        
        req.checkBody('password').notEmpty().withMessage('Password is required.')
            .isLength({min:5,max:15}).withMessage('Password should be at least 5 characters but not more than 15.');
        req.getValidationResult().then(function(result){
            var errorArr = [];
            if (result.isEmpty() === false) {
                result.array().forEach((error) => {
                    errorArr.push(error.msg);
                    let send_data = {message:error.msg};
                    res.status(400).json(send_data);
                });
               // let send_data = {success:false,status:400,message:"Input validation Error",error:errorArr};
                //return res.json(send_data);
                
            }else{
                next();
            }
        });
        const unhandledRejections = new Map();
        process.on('unhandledRejection', (reason, p) => {
            unhandledRejections.set(p, reason);
        });
        process.on('rejectionHandled', (p) => {
            unhandledRejections.delete(p);
        });
    }
}
module.exports = user; 