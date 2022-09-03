const collection = require("../../MongoDB/MongoDBCollection");
const ObjectId = require('mongodb').ObjectId;

// all products get -----------------
module.exports.products = async (req, res) => {
    try {
        const page = Number(req.query.page);
        const size = Number(req.query.size);
        const cursor = collection.productsCollection.find({});
        let products = await cursor.skip(page * size).limit(size).toArray();
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }

}


//Post product--------------------

module.exports.productPost = async (req, res) => {
    try {
        const products = req.body;
        const result = await collection.productsCollection.insertOne(products);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")

    }
}

//get place order--------------------
module.exports.singleProduct = async (req, res) => {


    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const product = await collection.productsCollection.findOne(query);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updateProduct = req.body;
        const filter = { _id: ObjectId(id) };
        console.log(updateProduct);
        const result = collection.productsCollection.updateOne(filter, {
            $set: {
                title: updateProduct.title,
                description: updateProduct.description,
                price: updateProduct.price,
                img: updateProduct.img,
                rating: updateProduct.rating,
            }
        });

        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await collection.productsCollection.deleteOne(query);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}