var crudder = null;
var logger = null;
var fs = require("fs");
var IMAGEEXTENSIONS = ["webp", "bmp", "cur", "dds", "gif", "ico", "jpg", "png", "psd", "svg", "tiff", "webp"];
var _ = require("lodash");
var sharp = require("sharp");
var multer = require("multer");
var Mongoose = require("mongoose");
var upload1 = multer({ dest: __dirname + "/assets" });

function init(_crudder, _logger) {
    crudder = _crudder;
    logger = _logger;
}
/**
 * For uploading the image 
 * @author <SHYLESH SELVAM>
 * @param {*} req 
 * @param {*} res 
 */
function upload(req, res) {
    var fileContent = req.swagger.params.file.value;
    if (fileContent) {
        var originalName = fileContent.originalname;
        var temp = fileContent.originalname.split(".");
        var extension = temp[temp.length - 1];
        var type = "IMAGE";
        var body = { docType: "IMAGE", originalName: originalName, extension: extension };
        if (validImageType(extension)) {
            var dir = type;
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            dir += "/" + Math.floor(Math.random(2) * 10);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            var desPath = dir + "/" + originalName;

            var body = { docType: "IMAGE", originalName: originalName, path: desPath, extension: extension };
            saveImage(fileContent, desPath).then((image) => {
                crudder.create(body, function (err, doc) {
                    if (err) {
                        logger.error("Error Occured while creating the asset");
                        res.status(400).send({ "message": err.message });
                    } else {
                        res.status(200).send({ message: "Image uploaded successfully" });
                    }
                })
            }).catch(err => {
                logger.error("Error Occured while saving the Image");
                res.status(400).send({ "message": err.message });
            });

        } else {
            res.status(400).send({ "message": "Image file type is Not suppourted" });
        }

    } else {
        console.log("The file is--");
        res.status(400).send({ "message": "Please Upload Image" });
    }
}

/**
 * Downloading the Images
 * @author <SHYLESH SELVAM>
 * @param {*} req 
 * @param {*} res 
 */
function download(req, res) {
    var assetId = req.swagger.params.id.value;
    assetId = Mongoose.Types.ObjectId(assetId);
    crudder.findOne({ "_id": assetId }, function (err, doc) {
        if (err) {
            res.status(400).send({ message: err.message });
        } else if (_.isEmpty(doc)) {
            res.status(400).send({ message: "Image Not Found" });
        } else {
            var rstream = fs.createReadStream(doc.path);
            rstream.pipe(res, { end: false });
            rstream.on("end", () => {
                res.end();
            });
        }
    });

}

/**
 * This function will save the image into directory
 * @author <SHYLESH SELVAM>
 * @param {*} source 
 * @param {*} desPath 
 */
function saveImage(fileContent, desPath) {
    return new Promise((resolve, reject) => {
        // fs.readFile(source, (err, data) => {
        fs.writeFile(desPath, fileContent.buffer, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
                /*fs.unlink(source, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        crudder.model.findOne({ _id: _result._id }, (err, doc) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(err);
                            }
                        });
                    }
                });*/
            }
        });
    });
    // })
}

/**
 * check whether the uploaded extension is valid or not
 * @author <SHYLESH SELVAM>
 * @param {*} extension 
 */
function validImageType(extension) {
    var extention = _.find(IMAGEEXTENSIONS, o => {
        return _.toLower(o) == _.toLower(extension);
    })
    if (extention) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    init: init,
    upload: upload,
    download: download
}