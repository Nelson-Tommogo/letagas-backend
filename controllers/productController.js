import Product, { find, countDocuments, findById } from '../models/Product';


export async function getProducts(req, res) {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await find(query)
      .populate('seller', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching products',
      error: error.message 
    });
  }
}


export async function getProduct(req, res) {
  try {
    const product = await findById(req.params.id)
      .populate('seller', 'name email phone');

    if (product && product.isActive) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error fetching product',
      error: error.message 
    });
  }
}


export async function createProduct(req, res) {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user.id
    });

    const createdProduct = await product.save();
    await createdProduct.populate('seller', 'name email phone');
    
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating product',
      error: error.message 
    });
  }
}


export async function updateProduct(req, res) {
  try {
    const product = await findById(req.params.id);

    if (product) {
      if (product.seller.toString() !== req.user.id && req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
      });

      const updatedProduct = await product.save();
      await updatedProduct.populate('seller', 'name email phone');
      
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating product',
      error: error.message 
    });
  }
}