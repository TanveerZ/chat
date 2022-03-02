var express = require('express');
var router = express.Router();
var dashboard = require('./controllers/dashboardController');
var traders = require('./controllers/tradersController');
var orders = require('./controllers/ordersController');
var funds = require('./controllers/fundsController');
var currency = require('./controllers/currencyController');
var referrals = require('./controllers/referralsController');
var reports = require('./controllers/reportsController');
var earnings = require('./controllers/earningsController');
var subadmins = require('./controllers/subadminsController');
var settings = require('./controllers/settingsController');
var zflTx = require('./controllers/zflTxController');

var adminMiddleware = require('../modules/admin/middleware/admin');
var passport = require('passport');

router.post('/zflTx', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals], zflTx.zflTx);

router.post('/allSubAdmins',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals], subadmins.getAllSubAdmins);
router.post('/addSubAdmin', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],subadmins.addSubAdminUser);
router.post('/editSubAdmin', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],subadmins.editSubAdminUser);
router.post('/deleteSubAdminUser', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],subadmins.deleteSubAdminUser);
router.post('/earningsWithdraws', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],earnings.withdraws);
router.post('/changePassword',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],settings.changePassword );
router.post('/tradeAndVolumeComparison',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],dashboard.tradeAndVolumeComparison );
router.post('/newAndActiveUsers',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],dashboard.newAndActiveUsers );
router.post('/withdrawMonths',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],dashboard.withdrawMonths );
router.post('/tradesByMonth',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],dashboard.tradesByMonth );
router.post('/allCounters',  passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],dashboard.allCounter );
router.post('/traders', passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],traders.allTraders);
router.post('/traderDetail', passport.authenticate('jwt', { session: false }) ,[adminMiddleware.admin_globals],traders.getTraderDetail);
router.post('/lockUser',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],traders.lockUser);
router.post('/sendAuthKey', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],traders.sendAuthKey);
router.post('/kycUpdate',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],traders.kycUpdate);
router.post('/kycDelete',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],traders.kycDelete);
router.post('/orderList', passport.authenticate('jwt', { session: false }) ,[adminMiddleware.admin_globals],orders.orderList);
router.post('/tradeSummary', passport.authenticate('jwt', { session: false }) ,[adminMiddleware.admin_globals],orders.tradeSummary);
router.post('/depositsWithdraws',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],funds.depositsWithdraws);
router.post('/markets',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],currency.markets);
router.post('/currency',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],currency.currency);
router.post('/editCurrencyInfo',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],currency.editCurrencyInfo);
router.post('/currencyPairs',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals],currency.currencyPairs);
router.post('/editCurrencyPairInfo', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],currency.editCurrencyPairInfo);
router.post('/currencySummary', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],currency.currencySummary);
router.post('/referrals', passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals], referrals.referralUsers);
router.post('/bitgoReports',  passport.authenticate('jwt', { session: false }),

//Report Balance Check
[adminMiddleware.admin_globals],reports.bitgoReports);
router.post('/balanceReports', passport.authenticate('jwt', { session: false }), [adminMiddleware.admin_globals],reports.balanceReports);
router.post('/coinProfile',  passport.authenticate('jwt', { session: false }),[adminMiddleware.admin_globals], reports.coinProfile);
router.post('/userLedger',reports.userLedger);

module.exports = router;