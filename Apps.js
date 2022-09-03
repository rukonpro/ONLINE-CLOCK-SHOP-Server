const express=require("express");

// all route path---------------------------
const productsRouter = require('./Routers/V1/Products_Routers/Products_Router');
const ordersRouter = require('./Routers/V1/Orders_Router/Orders_Router');
const paymentRouter = require('./Routers/V1/Payment_Routers/Payment_Routers')
const userRouter = require('./Routers/V1/Users_Routers/Users_Router');
const reviewRouter = require('./Routers/V1/Review_Router/Review_Router');
const requestRouter = require('./Routers/V1/Request_Router/RequestRouter');


const app = express();

const Apps = () => {
    // all route ---------------------------
    app.use("/api/v1/products", productsRouter);
    app.use("/api/v1/orders", ordersRouter);
    app.use("/api/v1/payment", paymentRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/review", reviewRouter);
    app.use("/api/v1/request", requestRouter);

    // home Route ------------------------
app.get('/', (req, res) => {
    res.send('Online clock Shop')
})

// not found route--------
app.all("*",(req,res)=>{
    res.status(404).send("Not found Route")
})

}

module.exports = Apps;
