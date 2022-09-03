const { reviewCollection } = require("../../MongoDB/MongoDBCollection");



module.exports.reviewPost = async (req, res) => {
    try {
        const product = req.body;
        const result = await reviewCollection.insertOne(product)
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}

module.exports.reviewGet = async (req, res) => {
    try {
        const result = await reviewCollection.find({}).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}