const ObjectId = require('mongodb').ObjectId;

const { orderCollection } = require("../../MongoDB/MongoDBCollection");



module.exports.orders = async (req, res) => {
    try {
        const result = await orderCollection.find({}).toArray();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}
module.exports.orderDelete = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}

module.exports.addToCart = async (req, res) => {
    try {
        const product = req.body;
        const result = await orderCollection.insertOne(product)
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}

module.exports.myOrders = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { cus_email: email }
        const result = await orderCollection.find(query).toArray();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}

module.exports.updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const status = req.body.status;
        const color = req.body.color;
        const filter = { _id: ObjectId(id) };
        const docUpdate = { $set: { status: status, color: color } };
        const result = await orderCollection.updateOne(filter, docUpdate);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }

}