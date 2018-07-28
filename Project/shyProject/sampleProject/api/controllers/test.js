var dot = require("dot-object");
var _ = require("lodash");
/*var name="product[n].name";
name=name.replace("[n]",`.${0}`);
console.log("name-------",name);
var d={};
d[name]=10;
dot.object(d);
console.log(JSON.stringify(dot.object(d)));*/
var templateDefinition = [{
    "name": "Name",
    "type": "Number",
    "column": "product[n].name.k.k"
}, {
    "name": "Quantity",
    "type": "Number",
    "column": "product[n].quantity"
}, {
    "name": "Price",
    "type": "String",
    "column": "product[n].spPrice"
}, {
    "name": "Margin",
    "type": "String",
    "column": "margin"
},{
    "name": "dealID",
    "type": "String",
    "column": "_id"
}]

var modelData = [{
    "dealID": "D100001",
    "Name": "A2",
    "Quantity": 1,
    "Price": 20,
    "Margin": 2
}, {
    "dealID": "D100001",
    "Name": "A3",
    "Quantity": 1,
    "Price": 20,
    "Margin": 2
}, {
    "dealID": "D100001",
    "Name": "A1",
    "Quantity": 1,
    "Price": 20,
    "Margin": 2
}, {
    "dealID": "D100002",
    "Name": "A4",
    "Quantity": 1,
    "Price": 20,
    "Margin": 2
}, {
    "dealID": "D100002",
    "Name": "A5",
    "Quantity": 1,
    "Price": 20,
    "Margin": 2
}];
modelData = _.groupBy(modelData, function (o) {
    return o.dealID;
})
console.log(modelData);
var v = [];
Object.keys(modelData).map(key => {
    var newObject = {};
    // newObject["dealId"] = key;
    modelData[key].map((data, index) => {
        templateDefinition.map(definition => {
            let column = definition.column;
            column = column.replace("[n]", `.${index}`);
            // newObject[column] = conversion(data[definition.name],definition.type);
            newObject[column]=data[definition.name];
        });
    });
    v.push(dot.object(newObject));
});

function conversion(data, type) {
    switch (_.toLower(type)) {
        case "string":
            data=data;
            break;
        case "boolean":
            data
            break;
        case "number":

            break;
        case "date":

            break;
        default:
            break;
    }
    return data;
}

console.log(JSON.stringify(v));