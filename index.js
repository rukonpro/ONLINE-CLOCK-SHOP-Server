const express = require('express')
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


// ------------------------------------------

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.af4at.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('PremierPotteryRetailer');
        const usersCollection = database.collection('users');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('review');

        console.log('connected')

        // all products get ==============================================
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find({}).toArray();
            res.send(products);
        })

        // all order products get ==============================================
        app.get('/allOrder', async (req, res) => {
            const products = await orderCollection.find({}).toArray();
            res.send(products);
        })
        // all order products get ==============================================
        app.get('/review', async (req, res) => {
            const review = await reviewCollection.find({}).toArray();
            res.send(review);
        })

        //get place order--------------------
        app.get('/placeProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            // console.log(query)
            const product = await productsCollection.findOne(query)
            res.send(product)
        })
        // update Product-------------------
        app.put("/updateProduct/:id", async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            console.log(updateProduct)
            productsCollection
                .updateOne(filter, {
                    $set: {
                        title: updateProduct.title,
                        description: updateProduct.description,
                        price: updateProduct.price,
                        img: updateProduct.img
                    },
                })
                .then((result) => {
                    res.send(result);
                });
        });
        // Delete manage all product ----------
        app.delete('/manageAllOrderDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)

        })

        // my order delete ----------
        app.delete('/myOrderDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)

        })

        // delete product ===========================
        app.delete('/productDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result)

        })



        // add products==================================================
        app.post('/addedProduct', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            res.json(result)
        })

        // order Product ==================================================
        app.post('/addToCartProduct', async (req, res) => {
            const product = req.body;
            const result = await orderCollection.insertOne(product)
            res.json(result)
        })
        // user review ==================================================
        app.post('/review', async (req, res) => {
            const product = req.body;
            const result = await reviewCollection.insertOne(product)
            res.json(result)

        })


        // email get my Order==============================================
        app.get('/myOrder/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const myOrder = await orderCollection.find(query).toArray();
            res.send(myOrder)
        })



        // approve api-------------------
        app.put("/statusUpdate/:id", async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const color = req.body.color;
            const filter = { _id: ObjectId(id) };
            await orderCollection.updateOne(filter, {
                $set: {
                    status: status,
                    color: color

                },
            })
                .then((result) => {
                    res.send(result);
                });

        });



        // get admin-----------------------
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAmin = false;
            if (user?.role === "admin") {
                isAmin = true;
            }
            res.json({ admin: isAmin })
        })

        // save to database user --------------
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)
            // console.log(user)
        })
        // update user=======================
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)

        })

        // admin add -------------------- verifyToken,
        app.put('/users/admin', async (req, res) => {

            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

    } finally {

        //   await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello assignment 12!')
})

app.listen(port, () => {
    console.log(` listening at${port}`)
})
