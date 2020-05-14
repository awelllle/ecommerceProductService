
const {validParam, sendErrorResponse, sendSuccessResponse} = require('../../helpers/utility');
let router = require('express').Router();
let controller = require('./controller');

router.post('/products', controller.products);
router.post('/getProduct', controller.getProduct);
router.post('/add', controller.add);

module.exports = router;