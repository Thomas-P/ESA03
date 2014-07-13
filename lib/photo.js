// utils, that are required
var dbase = require('./dbase.js')('picture','photoId');
var user = require('./user.js');
var session = require('./session.js');
var helper = require('./helper.js');
var pathUtil = require('path');
var util = require('util');
var fs = require('fs');
var easyimage = require('easyimage');

/* Setting up Pathname */
var tmpPath = __dirname+'/../tmp/';
var imgPath = __dirname+'/../static/images/';


// Exports the picture interface
module.exports = {
	find: function(params, cb) {
        params = params || params.query || {};
        console.log('FIND',params);
        var data;
        if (params.key) {
            data = dbase.filter(params.key,params.values,params.limit>>0,!!params.desc);
        } else {
            data = dbase.list(params.limit>>0,!!params.desc);
        }
        return cb(null,data);
	},
	get: function(photoId, params, cb) {
		//return dbase.get(photoId,cb);
	},
	create: function(pictureData, params, cb) {
        console.log('PHOTO.create',params);
        params = params.query || {};
        description = pictureData.description || '';
        pictureData = pictureData.data;


    	pictureData = pictureData.split(',');   // Base64-URL to binary image data
    	pictureData = pictureData[pictureData.length - 1];
    	pictureData = helper.base64decode(pictureData);
    	
    	var photoId = helper.guid() + '.jpg';  // generate a Photo-ID
    	session.get(params.sid || null,{ } ,function(err,session) {
            if (err) {
                return cb(err,null);
            }
            if (!session.data || !session.data.username) {
                return cb(new Error('You are not logged.'));
            }
            fs.writeFile(tmpPath + photoId, pictureData, function(err) {
                if (err) {
                    return cb(err,null);
                }
                easyimage.convert(
                { 
                    src: tmpPath + photoId,
                    dst: imgPath + photoId,
                    quality: 90 
                }, function(err) {
                    fs.unlink(tmpPath + photoId, function (err2) {
                        if (err) {  // an error occurd on convert, but we usally unlink the tmp file
                            return cb(err,null); // only if an error occurd by conversion
                        }
                        var data = {
                            photoId : photoId,
                            username: session.data.username,
                            shotAt: Date.now(),
                            description: description || ''
                        };
                        var ret = dbase.add(data);
                        if (ret) {
                            cb(null,data);
                        } else {
                            cb(new Error('Could not save photo'));
                        }

                    });
                });

            });
        });
    },
remove: function(photoId, params, cb) {
    var tmp;
    if (tmp = dbase.remove(photoId)) {
        cb(null,tmp);
    } else {
        cb(new Error('Could not delete photo',null));
    }

},
};