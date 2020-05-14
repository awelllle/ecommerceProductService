
const {validParam, queueTask, sendResponse,sendPostRequest, sendrpPostRequest, addCommas, sendErrorResponse, sendSuccessResponse, capitalize, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ObjectId = require('mongodb').ObjectId;

exports.products = (req, res) => {
  
        Product.find({}, function (err, result) {
            if(err)
            {
                console.log(err);
                return sendErrorResponse(res, {}, 'Something went wrong, Please try again');
            }

            if(result != null){
                return sendSuccessResponse(res, result, 'Here\'s what I have, take what you need');

            }else{
                return sendErrorResponse(res, {}, 'No products found');

            }

            
        });


}


exports.getProduct = (req, res) => {
  
    let required = [
        {name: 'id', type: 'string'},
       
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {
        
       
      id = new ObjectId(body.id);
       

    Product.findOne({_id : id}, function (err, result) {
        if(err)
        {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, Please try again');
        }

        if(result != null){
            return sendSuccessResponse(res, result, 'Here\'s what I have, take what you need');

        }else{
            return sendErrorResponse(res, {}, 'No product found');

        }    
    });

}else{
    return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
}


}

exports.add = (req, res) => {
  
    let required = [
        {name: 'name', type: 'string'},
        {name: 'price', type: 'string'},
        {name: 'description', type: 'string'},
    ];

    req.body = trimCollection(req.body);
    const body = req.body;
    
    let hasRequired = validParam(req.body, required);
    if (hasRequired.success) {
        
        let nProd            = new Product();

        nProd.name    = body.name;
        nProd.price     = body.price;
        nProd.description = body.description;
        
    
        nProd.save((err) => {
            console.log(err);
            if (err) {
                return sendErrorResponse(res, err, 'Something went wrong');
            }
            return sendSuccessResponse(res, '', 'Added');
         });


}else{
    return sendErrorResponse(res, {required: hasRequired.message}, 'Missing required fields');
}


}


