const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');
const OrderController = require('./OrderController');

class ProductController {
    static PageSize = 10;

    // [GET] /products/all
    showAll = async function (req, res, next) {
        var q = req.query.q;
        console.log('Query ', q);
        var pageIndex = query.pageIndex || 1;

        await Product.find({ name: { "$regex": q, "$options": "i" } })
            .skip((pageIndex - 1) * PageSize)
            .take(PageSize)
            .then((query) => {
                query = Array.from(query);
                query = query.map((product) => product.toObject());
                res.send(query);
            })
            .catch((err) => next(err));
    }

    // [GET] /products/user/:id
    showByUserId = async function (req, res, next) {
        const userId = req.params.id;

        const products = await Product.find({ userId: userId }).then(function (
            query
        ) {
            query = Array.from(query);
            query = query.map((product) => product.toObject());
            return query;
        });
        res.send(products);
    }

    // [POST] /products/delete/single
    deleteOne = async (req, res) => {
        const user = req.user;
        const data = req.body;

        if (user.id !== data.userId || !data.productId) {
            res.send({
                error: "Invalid",
            });
        } else {
            const deleteImageFiles = Product.findById(data.productId)
                .then(product => product.toObject())
                .then(product => {
                    const files = product.files;

                    try {
                        for (let i = 0; i < files.length; i++)
                            fs.unlink(path.join(__dirname, '..', '..', '..', 'public', 'blogs', files[i].filename),
                                function success() {
                                    console.log('DELETING ' + files[i].filename);
                                });
                        return true;
                    } catch (e) {
                        console.log('ERROR: ' + e.message);
                        return false;
                    }
                })

            const orderTask = Order.deleteMany({ product_id: data.productId });
            const productTask = Product.findByIdAndDelete(data.productId);
                
            await Promise.all([orderTask, productTask, deleteImageFiles])
                .then((values) => res.send({ ...values[1], success: true }))
                .catch((err) => res.send({ error: err }));
        }
    }

    // [POST] /products
    uploadNewProduct = async (req, res) => {
        const data = req.body;
        // console.log("PRODUCTS POST", req.files);
        // console.log("PRODUCTS POST", req.body);
        var imgUrl = "NoImage.jpg";

        if (
            req.files &&
            req.files[0] &&
            req.files[0].mimetype.indexOf("image") !== -1
        )
            imgUrl = req.files[0].filename;

        var product = new Product({
            name: data.name.toString(),
            description: data.detail.toString(),
            userId: data.userId,
            cost: data.cost,
            remain: data.remain,
            files: [...req.files],
            imageUrl: imgUrl,
        });

        await product.save().catch((err) => console.log(err));

        res.redirect("back");
    }

    // [GET] /products/single/:id
    showProductById = async (req, res, next) => {
        const id = req.params.id;

        console.log(req.params);

        const product = await Product.findById(id)
            .then((response) => response.toObject())
            .then(async (response) => {
                await User.findById(response.userId)
                    .then((user) => user.toObject())
                    .then((user) => {
                        response.username = user.username;
                    });
                return response;
            })
            .catch((err) => {
                console.log(err);
            });

        res.send(product);
    }

    // [GET] /products
    showAll = async function (req, res, next) {
        let q = req.query.q;
        // console.log('products' + q);
        let filter = {};
        if (q) filter = { name: { "$regex": q, "$options": "i" } };

        await Product.find(filter)
            .then((query) => {
                query = Array.from(query);
                query = query.map((product) => product.toObject());

                res.send(query);
            })
            .catch((err) => next(err));
    }
}

module.exports = new ProductController();