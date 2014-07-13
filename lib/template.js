var swig = require('swig');
var pathUtil = require('path');
var session = require('./session');
var user = require('./user');
var photo = require('./photo');


var viewPath = __dirname+'/../views/';


var templates = {

  get: function (template, params, cb) {
    console.log('TEMPLATE.get',arguments);
    if (!template)
        return cb(new Error('No Template'), null);
    params = params && params.query || {} ;
    params.raw = true;
    if (params.sid) {
        session.get(params.sid,params,function(err,sessionData) {
            for (var attrname in sessionData) 
                params[attrname] = sessionData[attrname]; 
            for (var attrname in sessionData.data || {}) 
                params[attrname] = sessionData.data[attrname]; 
            if (template == 'home') {
                photo.find({
                    limit: 20,
                    desc: true
                },function(err,data) {
                    params['photos'] = data;
                    swig.renderFile(viewPath + template + '.html', params, function (err, data) {
                        cb(err, {
                          content: data
                      });
                    });
                });
            } else if (template == 'account') {
                photo.find({
                    key:'username',
                    values: [params.username],
                    limit: 0,
                    desc: true
                },function(err,data) {
                    params['photos'] = data;
                    console.log('PHOTOS-TEMPLATE.data',data);
                    swig.renderFile(viewPath + template + '.html', params, function (err, data) {
                        cb(err, {
                          content: data
                      });
                    });
                });

            } else {

                swig.renderFile(viewPath + template + '.html', params, function (err, data) {
                    cb(err, {
                      content: data
                  });
                });

            }

            
        });

} else {
    swig.renderFile(viewPath + template + '.html', params, function (err, data) {
        cb(err, {
          content: data
      });
    });
}
}
};

module.exports = templates;
