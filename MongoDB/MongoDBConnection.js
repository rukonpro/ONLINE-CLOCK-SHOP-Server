const client = require('./MongoDBClient');


module.exports.mongodbConnection= async()=>{
    await client.connect();
}

// module.exports=client