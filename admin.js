var express = require('express');
var router = express.Router();
const db = require('../configure/db-connect');

/* GET products listing. */
router.get('/', async function(req, res, next) {
  try {
    // Fetch products from the database
    const [products] = await db.execute('SELECT * FROM PRODUCT');

    // Render the view with the fetched products
    res.render('admin/view-products', { admin: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/add-product', function(req, res) {
  res.render('admin/add-product');
});

router.post('/add-product', async function(req, res) {
  try {
    const { Name, Category, Description, Price } = req.body;

    // Insert the form data into the database
    await db.execute(
      'INSERT INTO PRODUCT (Name, Category, Price, Description) VALUES (?, ?, ?, ?)',
      [Name, Category, Price, Description]
    );

    console.log('Data inserted successfully');
    res.redirect('/admin'); // Redirect to a success page or a different route
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
