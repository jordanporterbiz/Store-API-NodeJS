const Product = require('../models/product')



const getAllProductsStatic = async (req,res) => {
    const search = 'ab'
    const products = await Product.find({}).sort('-name price')
    res.status(200).json({ products, nbHits: products.length })
}



// Get all products - filter result by query string
const getAllProducts = async (req,res) => {
    // Destructure properties from querystring
    const { featured, company, name, sort } = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true'? true : false
    }
    if(company) {
        queryObject.company = company
    }
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }
    // console.log(queryObject)
    let result = await Product.find(queryObject)
    if(sort){
        products = products.sort()
    }

    const products = await result
    res.status(200).json({products, nbHits: products.length})

}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}