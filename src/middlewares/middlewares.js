
const request = require('request');
const util = require('../helpers/utility');

exports.authenticate = (req, res, next) => {
   
    if(req.header('Authorization')){
        const authToken = req.header('Authorization').split(' ')[1];
        const authUrl = process.env.AUTH_URL;
        let authResponse = '';
        let authRequest = request.post({
            url: `${authUrl}/decodeToken`,
            form: {token: authToken},
            headers: {
                        'Content-Type': 'application/json',
                        //'Authorization': 'Bearer ' + AppToken
                     },     
        }, function(error, response, body){
            if(error){
                console.log(error);
                return util.sendErrorResponse(res, [], "Unable to authenticate user. Try Again", 401);
            }
        });
        authRequest.on('data', (data) => {
            authResponse += data;
        });
        authRequest.on('end', () => {
            console.log('token decoded');
            try {
              
                let data = JSON.parse(authResponse);
                // console.log(data);
                if (data.success) {
                   
                    req.payload = data.data;
                    return next();
                }
            } catch (e) {
                console.log(e);
            }
            return util.sendErrorResponse(res, [], "Not Authenticated. Bad/Expired Token", 401);
        })
    }else {
        return util.sendErrorResponse(res, [], "Not authenticated", 401);
    }
};


