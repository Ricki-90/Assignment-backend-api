const express = require('express')
const controller  = express.Router()
const productSchema = require('../schemas/productSchema')
const { authorize } = require('../middlewares/authorization')

// unsecured routes
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(201).json(products)
    }
    else
        res.status(400).json()
})

controller.route('/:tag').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag})
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(400).json()
})

controller.route('/:tag/:take').get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag}).limit(req.params.take)
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(products)
    }
    else
        res.status(400).json()
})

controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if(product){
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            rating: product.rating,
            imageName: product.imageName
        })
    } else
        res.status(400).json()
})

// secured routes
//Create
controller.route('/').post(authorize, async (req, res) => {
    const { name, description, price, category, tag, rating, imageName } = req.body

    if (!name || !price)
        res.status(400).json({text: 'name and price is required.'})

    const item_exists = await productSchema.findOne({name})
    if (item_exists)
        res.status(409).json({text: 'a product with the same name already exists.'})
    else {
        const product = await productSchema.create ({
            name,
            description,
            price,
            category,
            tag,
            rating,
            imageName
        })
        if (product)
            res.status(201).json({text: `product with article number ${product._id} was created successfully`})
        else
            res.status(400).json({text: 'something went wrong when we tried to create the product.'})
    }
})

//Delete
controller.route('/:articleNumber').delete(authorize, async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json(`no article number was specificed.`)
    else {
        const item = await productSchema.findById(req.params.articleNumber)
        if (item) {
            await productSchema.remove(item)
            res.status(200).json({text: `product with article number ${req.params.articleNumber} was deleted sucessfully`})
        } else {
            res.status(404).json({text: `product with article number ${req.params.articleNumber} was not found`})
        }
    }
})

//Put - Update
controller.route('/:articleNumber').put(authorize, (req, res) => {
    productSchema.findByIdAndUpdate(req.params.articleNumber, 
    {$set : { name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              category: req.body.category,
              tag: req.body.tag,
              rating: req.body.rating,
              imageName: req.body.imageName                  
            }}, 
    {new : true}, (err, updatedObj) => {
        if (err) {
            res.status(422).json({status : false, error : "Item not updated"}); 
        }
        else {
            res.status(200).json({ updatedObj }); 
        }
    })
})

module.exports = controller
