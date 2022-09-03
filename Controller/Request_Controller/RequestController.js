const { ObjectId } = require("mongodb");
const { requestTodayCollection } = require("../../MongoDB/MongoDBCollection");



module.exports.requestPost = async (req, res) => {
    try {
        const product = req.body;
        const result = await requestTodayCollection.insertOne(product)
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}
module.exports.requestGet = async (req, res) => {
    try {
        const result = await requestTodayCollection.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}
module.exports.requestMassageDelete = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await requestTodayCollection.deleteOne(query);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}