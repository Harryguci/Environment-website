const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');

class ProductController {
    static PageSize = 10;

    // [GET] /products/all
    showAll = async function (req, res, next) {
        var q = req.query.q;
        var type = req.query.type;

        // console.log('[Query]', q);
        // console.log('[Type]', type);

        var pageIndex = req.query.pageIndex || 1;

        var productQuery = Product;
        var whereObj = {};

        if (q)
            whereObj.name = { "$regex": q, "$options": "i" };
        if (type)
            whereObj.type = type;

        await productQuery.find(whereObj)
            .skip((pageIndex - 1) * ProductController.PageSize)
            .limit(ProductController.PageSize).then((query) => {
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
            type: data.type || 'other',
            remain: data.remain,
            files: [...req.files],
            imageUrl: imgUrl,
        });

        await product.save().catch((err) => console.log(err));

        res.redirect("back");
    }

    // [PUT] /products
    updateOne = async (req, res) => {
        const data = req.body;
        const newProduct = { id: data.id };

        if (data.name) newProduct['name'] = data.name;
        if (data.description) newProduct['description'] = data.description;
        if (data.cost) newProduct['cost'] = data.cost;
        if (data.deleted) newProduct['deleted'] = data.deleted;
        if (data.remain) newProduct['remain'] = data.remain;

        await Product.findByIdAndUpdate(newProduct.id, { ...newProduct })
            .then(value => res.send({ ...value, status: 'success' }))
            .catch(err => res.send({ error: err }))
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
    showAll2 = async function (req, res, next) {
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