const express = require('express')
const app = express();
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
const { v4: uuidv4 } = require('uuid');
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
        const requestTodayCollection = database.collection('request');
        const reviewCollection = database.collection('review');



        // all products get ==============================================
        app.get('/products', async (req, res) => {
            const page = Number(req.query.page);
            const size = Number(req.query.size);
            const cursor = productsCollection.find({});
            let products = await cursor.skip(page * size).limit(size).toArray();
                      
            res.send(products)

            /*  const products = await productsCollection.find({}).toArray();
             res.send(products); */
        })

        // all order products get ==============================================
        app.get('/allOrder', async (req, res) => {
            const products = await orderCollection.find({}).toArray();
            res.send(products);
        })
        // all review get ==============================================
        app.get('/review', async (req, res) => {
            const review = await reviewCollection.find({}).toArray();
            res.send(review);
        })
        // all request get ==============================================
        app.get('/request', async (req, res) => {
            const request = await requestTodayCollection.find({}).toArray();
            res.send(request);
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

            productsCollection.updateOne(filter, {
                $set: {
                    title: updateProduct.title,
                    description: updateProduct.description,
                    price: updateProduct.price,
                    img: updateProduct.img,
                    rating: updateProduct.rating,
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
        // massage Delete ===========================
        app.delete('/massageDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await requestTodayCollection.deleteOne(query);
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
        // Request Today ==================================================
        app.post('/request', async (req, res) => {
            const product = req.body;
            const result = await requestTodayCollection.insertOne(product)
            res.json(result)

        })


        // email get my Order==============================================
        app.get('/myOrder/:email', async (req, res) => {
            const email = req.params.email;
            const query = { cus_email: email }
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
            const filter = {
                email: user.email

            };
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

        //sslcommerz init
        app.post('/init', async (req, res) => {

            const data = {
                total_amount: req.body.total_amount,
                currency: 'BDT',
                tran_id: uuidv4(),
                success_url: 'https://evening-woodland-47343.herokuapp.com/success',
                fail_url: 'https://evening-woodland-47343.herokuapp.com/fail',
                cancel_url: 'https://evening-woodland-47343.herokuapp.com/cancel',
                ipn_url: 'https://evening-woodland-47343.herokuapp.com/ipn',
                shipping_method: 'Courier',
                product_name: req.body.product_name,
                product_category: 'Electronic',
                product_profile: req.body.product_profile,
                cus_name: req.body.cus_name,
                cus_email: req.body.cus_email,
                date: req.body.date,
                status: req.body.status,
                color: req.body.color,
                product_image: req.body.product_image,
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
                multi_card_name: 'mastercard',
                value_a: 'ref001_A',
                value_b: 'ref002_B',
                value_c: 'ref003_C',
                value_d: 'ref004_D'
            };
            const order = await orderCollection.insertOne(data)

            const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASS, false) //true for live default false for sandbox
            sslcommer.init(data).then(data => {
                //process the response that got from sslcommerz 
                //https://developer.sslcommerz.com/doc/v4/#returned-parameters

                if (data.GatewayPageURL) {

                    res.json(data.GatewayPageURL)
                } else {
                    return res.status(400).json({
                        message: 'Payment session failed'
                    })
                }
            });
        })
        app.post('/success', async (req, res) => {
            const result = await orderCollection.updateOne({ tran_id: req.body.tran_id }, {
                $set: {
                    val_id: req.body.val_id
                }
            })
            res.status(200).redirect(`https://premier-pottery-retailer.web.app/success/${req.body.tran_id}`)
        })
        app.post('/fail', async (req, res) => {
            const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
            res.status(400).redirect('https://premier-pottery-retailer.web.app')
        })
        app.post('/cancel', async (req, res) => {
            const result = await orderCollection.deleteOne({ tran_id: req.body.tran_id })
            res.status(300).redirect('https://premier-pottery-retailer.web.app')
        })
        app.post("/ipn", (req, res) => {
            console.log(req.body)
            res.send(req.body);
        })
        app.get('/order/:tran_id', async (req, res) => {
            const id = req.params.tran_id;
            console.log(id)
            const result = await orderCollection.findOne({ tran_id: id })
            res.json(result)
        })

    } finally {

        //   await client.close();
    }
}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Online clock Shop')
})

app.listen(port, () => {
    console.log(` listening at${port}`)
})
