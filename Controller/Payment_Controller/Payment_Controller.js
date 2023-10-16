const SSLCommerzPayment = require('sslcommerz');
const {v4: uuidv4} = require('uuid');
const {orderCollection} = require('../../MongoDB/MongoDBCollection');


module.exports.paymentInit = async (req, res) => {
    try {
        const data = {
            total_amount: req.body.total_amount,
            currency: 'BDT',
            tran_id: uuidv4(),

            success_url: 'https://online-clock-api.vercel.app/api/v1/payment/success',
            fail_url: 'https://online-clock-api.vercel.app/api/v1/payment/fail',
            cancel_url: 'https://online-clock-api.vercel.app/api/v1/payment/cancel',
            ipn_url: 'https://online-clock-api.vercel.app/api/v1/payment/ipn',
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

                res.status(200).json(data.GatewayPageURL)
            } else {
                return res.status(400).json({
                    message: 'Payment session failed'
                })
            }
        });
    } catch (error) {
        res.status(400).send("Server Error ♨_♨")
    }
}

module.exports.paymentSuccess = async (req, res) => {
    try {
        const result = await orderCollection.updateOne({tran_id: req.body.tran_id}, {
            $set: {
                val_id: req.body.val_id
            }
        })
        res.status(200).redirect(`https://premier-pottery-retailer.web.app/success/${req.body.tran_id}`);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}

module.exports.paymentFail = async (req, res) => {
    try {
        const result = await orderCollection.deleteOne({tran_id: req.body.tran_id})
        res.status(400).redirect('https://premier-pottery-retailer.web.app')
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}

module.exports.paymentCancel = async (req, res) => {
    try {
        const result = await orderCollection.deleteOne({tran_id: req.body.tran_id})
        res.status(300).redirect('https://premier-pottery-retailer.web.app')
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}

module.exports.paymentIpn = async (req, res) => {
    try {
        res.send(req.body);
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}

module.exports.paymentOrder = async (req, res) => {
    try {
        const id = req.params.tran_id;
        const result = await orderCollection.findOne({tran_id: id})
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send("Server Error ♨_♨");
    }
}