var crudder=null;
var logger=null;
var _=require("lodash");
var Mongoose=require("mongoose");

function init(_crudder,_logger){
    crudder=_crudder;
    logger=_logger;
}

/**
 * This function will create Item
 * @author <SHYLESH SELVAM>
 * @param {*} req 
 * @param {*} res 
 */
function create(req, res) {
    var data = req.swagger.params.data.value;
    if (!_.isEmpty(data)) {
        data.effectiveBalance = data.amount;
        crudder.create(data,function(err,doc){
            if(err){
                res.status(400).send({ "message": "Error Occured  while creating the item "+err.message });
            }else{
                res.status(200).send(doc);
            }
        })
    } else {
        res.status(400).send({ "message": "Data is Empty" });
    }
}

/**
 * update the whole document
 * @param {*} req 
 * @param {*} res 
 */
function update(req, res) {
    var id = req.swagger.params.id.value;
    id = Mongoose.Types.ObjectId(id);
    var data = req.swagger.params.data.value;
    var condition = { "_id": id };
    updateItem(condition, data).then((doc) => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(400).send(err.message);
    });
}

/**
 * This function is Get By Id Method
 * @param {*} req 
 * @param {*} res 
 */
function index(req, res) {
    var sort = req.swagger.params.sort.value || {};
    var select = req.swagger.params.select.value || "";
    var filter = req.swagger.params.filter.value ? JSON.parse(req.swagger.params.filter.value) : {};
    var page = req.swagger.params.page.value || 1;
    var count = req.swagger.params.count.value || 10;

    filter.deleted = false;
    crudder.find(filter).sort(sort).skip((page - 1) * count).limit(count).select(select).lean().exec().then((docs) => {
        res.status(200).send(docs);
    }).catch(err => {
        res.status(200).send({ "message": err.message });
    });
}

function show(req, res) {
    var id = req.swagger.params.id.value;
    id = Mongoose.Types.ObjectId(id);
    crudder.findOne({ _id: id, deleted: false }, (err, doc) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.status(200).send(doc);
        }
    });
}

/**
 * In Delete funtion we are not doing Soft Delete by setting deleted flag as true
 * @param {*} req 
 * @param {*} res 
 */
function destroy(req, res) {
    var id = req.swagger.params.id.value;
    id = Mongoose.Types.ObjectId(id);
    crudder.findOneAndUpdate({ _id: id }, { "$set": { "deleted": true } }, { new: true, upsert: true }, (err, doc) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.status(200).send(doc);
        }
    });
}

/**
 * This function will update item Document
 * @param {*} condition 
 * @param {*} data 
 */
function updateItem(condition, data) {
    return new Promise((resolve, reject) => {
        crudder.findOneAndUpdate(condition, { "$set": data }, { new: true, upsert: true }, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        });
    });
}

module.exports = {
    init:init,
    create: create,
    update: update,
    index: index,
    show: show,
    delete: destroy
};
