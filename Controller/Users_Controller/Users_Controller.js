const { usersCollection } = require("../../MongoDB/MongoDBCollection");



module.exports.getAdmin = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAmin = false;
        if (user?.role === "admin") {
            isAmin = true;
        }
        res.status(200).json({ admin: isAmin })
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}
module.exports.saveUserDb = async (req, res) => {
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}
module.exports.updateUser = async (req, res) => {
    try {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }

}

module.exports.addAdmin = async (req, res) => {
    try {
        const user = req.body;
        const filter = { email: user.email };
        const updateDoc = { $set: { role: 'admin' } }
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}