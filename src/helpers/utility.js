
const request = require('request');
var rp = require('request-promise');
const amqp = require('amqplib');

exports.queueTask = (exchange, data) => {

    var amqp = require('amqplib/callback_api');
    let body = JSON.stringify(data);

    amqp.connect(process.env.RABBITMQ, function(err, conn) {
    conn.createChannel(function(err, ch) {
       

        ch.assertExchange(exchange,'fanout', {});
        // Note: on Node 6 Buffer.from(msg) should be used
        ch.publish(exchange, '', Buffer.from(body) );
        console.log(" [x] Sent %s", body);
      });
      
       setTimeout(function() { conn.close();  }, 9000);
    });



    
    // const open = amqp.connect(process.env.RABBITMQ);
    // open.then((conn) => {

    //     return conn.createChannel();

    // }).then((ch) => {

       
    //       ch.assertExchange(exchange, 'fanout', {}).then((ok)=>{
    //         ch.publish(exchange, '', Buffer.from(body));
    //        // console.log(" [x] Sent %s", body);
          
    //        });
    //         // return ch.assertQueue(channel).then(function(ok) {
    //         //     ch.sendToQueue(channel, Buffer.from(body));
    //         //     return ch.close();
    //         // });
    // }).catch(console.warn);
    // return conn.close();

};

exports.sendJsonResponse = function (res, status, content) {
    res.status(status).json(content);
};
exports.sendErrorResponse = function (res, content, message, status) {
    status = !status ? 422 : status
    let data = {
        success: false,
        message: message,
        data: content
    };
    res.status(status).json(data);
};
exports.sendSuccessResponse = function (res, content, message) {
    let data = {
        success: true,
        message: message,
        data: content
    };
    res.status(200).json(data);
};
exports.sendResponse = function (res, content, message,code) {
    if(code == 100){
        var success = true;
     }else{
        var success= false
     }
 
 
     let data = {
         code :  code,
         success: success,
         message: message,
         data: content
     };
     res.status(200).json(data);
};


exports.validParam = (obj, requiredParam) => {
    let objKeys = Object.keys(obj);
    let notFound = [];
    let success = true;

    requiredParam.forEach((param, index) => {
        let idx = objKeys.findIndex(k => {
            return k === param.name;
        });

        if (idx < 0) {
            notFound.push(`${param.name} is required`);
            success = false;
        } else if (param.type && (typeof obj[param.name] != param.type)) {
            notFound.push(`${param.name} should be ${param.type}`);
            success = false;
        }
    });

    return {
        success: success,
        message: notFound
    };
};


exports.sendrpPostRequest =  (data,token, path, cb) => {

    
    
    var options = {
        method: 'POST',
        uri: `${path}`,
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        json: true //Automatically stringifies the body to JSON
    };
   
      rp(options)
        .then(function (parsedBody) {
            
            return cb(null, parsedBody);
        }).catch(function (err) {
            return cb(err, null);
        });
        

};

exports.sendPostRequest = (data,token, path, cb) => {

    const appUrl = process.env.URL;
    let response = '';

    let authRequest = request.post({
        url: `${appUrl}${path}`,
        body: data,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            (error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {

            let data = JSON.parse(response);
          
             return cb(null, data);

         } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        (true, data);
    });
};

exports.sendPutRequest = (data,token, path, cb) => {

    const authUrl = process.env.AUTH_URL;
    let response = '';

    let authRequest = request.put({
        url: `${authUrl}${path}`,
        body: data,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            cb(error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {
            let data = JSON.parse(response);
            console.log(data);
            if (data.success) {
                return cb(null, data.data);
            }
        } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        cb(true, data);
    });
};

exports.sendGetRequest = (data,token, path, cb) => {

    const authUrl = process.env.AUTH_URL;
    let response = '';

    let authRequest = request.get({
        url: `${authUrl}${path}`,
        qs: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            cb(error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {
            let data = JSON.parse(response);
            if (data.success) {
                return cb(null, data.data);
            }
        } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        return cb(true, data.message);
    });
};

exports.trimCollection = (data) => {
    for(let key in data){
        if(data.hasOwnProperty(key)){
            if(typeof data[key] == "string"){
                data[key] = data[key].trim();
            }
        }
    }
    return data;
};

exports.capitalize = (str) => {
    if(str.length > 0){
        let temp = str.substr(1);
        str = str.charAt(0).toUpperCase() + temp;
    }
    return str;
}

exports.addCommas = (num) => {
        var str = num.toString().split('.');
        if (str[0].length >= 4) {
            //add comma every 3 digits befor decimal
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        /* Optional formating for decimal places
        if (str[1] && str[1].length >= 4) {
            //add space every 3 digits after decimal
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }*/
        return str.join('.');
}
