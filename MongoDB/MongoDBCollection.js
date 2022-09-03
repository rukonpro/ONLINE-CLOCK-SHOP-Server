const database = require("./MongoDBDatabase");


const productsCollection = database.collection('products');
const orderCollection = database.collection('order');
const usersCollection = database.collection('users');
const reviewCollection = database.collection('review');
const requestTodayCollection = database.collection('request');


module.exports={productsCollection,orderCollection,usersCollection,reviewCollection,requestTodayCollection};