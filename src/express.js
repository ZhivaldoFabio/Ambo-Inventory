// src/express.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pool from './db.js';
import { authenticateJWT } from './authMiddleware.js'; // Import the middleware
import userController from './userController.js'; // Import other controllers
import { loginUser } from './authMiddleware.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Routes
app.post('/api/login', loginUser); // User login and JWT token generation
app.use('/api/user', authenticateJWT, userController); // Protect the user route

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this to ensure Express can parse JSON requests
app.use(express.json());

app.post('/api/logout', (req, res) => {
  // Invalidate the session or token if needed
  res.status(200).send({ message: 'Logged out successfully' });
});

// GET endpoint to fetch sales data for the pie chart
app.get('/api/sales-data', async (req, res) => {
  try {
    // Query to get product sales and total quantity sold
    const query = `
      SELECT p.nama_produk, SUM(d.jumlah_produk) AS total_quantity
      FROM detailpenjualan d
      JOIN produk p ON d.id_produk = p.id_produk
      GROUP BY p.nama_produk
      ORDER BY total_quantity DESC
      LIMIT 10; 
    `;

    const [rows] = await pool.execute(query);

    if (!rows.length) {
      return res.status(404).json({ message: 'No sales data found' });
    }

    // Format the data to match your chart's expected format
    const pieData = rows.map((row) => ({
      value: row.total_quantity,
      name: row.nama_produk,
    }));

    res.json(pieData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST ENDPOINT to add new stock
app.post('/api/stocks', express.json(), async (req, res) => {
  const {
    id_produk,
    id_supplier,
    id_unit,
    id_kategori,
    jumlah_stock,
    tgl_masuk,
    tgl_exp,
  } = req.body;

  const query = `
    INSERT INTO stock (id_produk, id_supplier, id_unit, id_kategori, jumlah_stock, tgl_masuk, tgl_exp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Use the promise version of connection
    const [result] = await pool.execute(query, [
      id_produk,
      id_supplier,
      id_unit,
      id_kategori,
      jumlah_stock,
      tgl_masuk,
      tgl_exp,
    ]);

    res
      .status(201)
      .json({ message: 'Stock added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint untuk menambah penjualan
app.post('/api/penjualan', async (req, res) => {
  const { items, total_harga, tanggal_penjualan } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required.' });
  }

  const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const date = tanggal_penjualan || currentDate;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert ke tabel penjualan
    const [penjualanResult] = await connection.execute(
      'INSERT INTO penjualan (total_harga, tanggal_penjualan) VALUES (?, ?)',
      [total_harga, date]
    );
    const id_penjualan = penjualanResult.insertId;

    // Insert ke tabel detailpenjualan
    const detailItems = items.map((item) => [
      id_penjualan,
      item.id_produk,
      item.jumlah_produk,
      item.harga,
    ]);

    await connection.query(
      'INSERT INTO detailpenjualan (id_penjualan, id_produk, jumlah_produk, harga) VALUES ?',
      [detailItems]
    );

    // Update stok produk di tabel stock
    for (let item of items) {
      await connection.execute(
        'UPDATE stock SET jumlah_stock = jumlah_stock - ? WHERE id_produk = ?',
        [item.jumlah_produk, item.id_produk]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Sale added successfully', id_penjualan });
  } catch (err) {
    await connection.rollback();
    console.error('Error adding sale:', err);
    res.status(500).json({ message: 'Failed to create sale.' });
  } finally {
    connection.release();
  }
});

// Endpoint to get available stock data for each product
app.get('/api/jumlah-stock', async (req, res) => {
  const query = `
    SELECT id_produk, SUM(jumlah_stock) AS available_stock
    FROM stock
    GROUP BY id_produk
  `;

  try {
    const [results] = await pool.execute(query); // Fetch stock data grouped by product
    res.status(200).json(results); // Respond with stock data
  } catch (err) {
    console.error('Error fetching stock data: ', err);
    res.status(500).json({ error: 'Failed to fetch stock data.' });
  }
});

// GET endpoint to fetch stock by ID
app.get('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.id_stock, 
      s.jumlah_stock, 
      s.tgl_masuk, 
      s.tgl_exp,
      s.id_produk, 
      p.nama_produk,
      s.id_supplier, 
      sp.nama_supplier,
      s.id_unit, 
      u.nama_unit,
      s.id_kategori, 
      k.nama_kategori
    FROM stock s
    JOIN produk p ON s.id_produk = p.id_produk
    JOIN suppliers sp ON s.id_supplier = sp.id_supplier
    JOIN units u ON s.id_unit = u.id_unit
    JOIN kategori k ON s.id_kategori = k.id_kategori
    WHERE s.id_stock = ?
  `;

  try {
    // Execute the query using promise API
    const [results] = await pool.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).send('Stock not found');
    }

    res.json(results[0]); // Return the first result (there should only be one)
  } catch (err) {
    console.error('Error fetching stock data: ', err);
    res.status(500).send('Server error');
  }
});

// Update stock details
app.put('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const {
    id_produk,
    id_supplier,
    id_unit,
    id_kategori,
    jumlah_stock,
    tgl_masuk,
    tgl_exp,
  } = req.body;

  const query = `
    UPDATE stock 
    SET 
      id_produk = ?, 
      id_supplier = ?, 
      id_unit = ?, 
      id_kategori = ?, 
      jumlah_stock = ?, 
      tgl_masuk = ?, 
      tgl_exp = ?
    WHERE id_stock = ?
  `;

  try {
    const [result] = await pool.execute(query, [
      id_produk,
      id_supplier,
      id_unit,
      id_kategori,
      jumlah_stock,
      tgl_masuk,
      tgl_exp,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Stock not found or no changes made' });
    }

    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error('Error updating stock data:', err);
    res.status(500).send('Server error');
  }
});

// DELETE endpoint to delete stock
app.delete('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM stock
    WHERE id_stock = ?
  `;

  try {
    // Execute the delete query using promise API
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Stock not found');
    }

    res.json({ message: 'Stock deleted successfully' });
  } catch (err) {
    console.error('Error deleting data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get stock data
app.get('/api/stocks', async (req, res) => {
  const query = `
    SELECT produk.nama_produk, kategori.nama_kategori, suppliers.nama_supplier, produk.stock_minimum, stock.jumlah_stock,
      (stock.jumlah_stock / produk.stock_minimum) * 100 AS percentage
    FROM produk
    JOIN kategori ON produk.id_kategori = kategori.id_kategori
    JOIN stock ON produk.id_produk = stock.id_produk
    JOIN suppliers ON stock.id_supplier = suppliers.id_supplier
    WHERE stock.jumlah_stock < produk.stock_minimum
    ORDER BY percentage ASC
  `;

  try {
    // Execute the query using the promise-based connection
    const [results] = await pool.query(query); // No need for `.execute()`
    res.json(results); // Return the results as JSON
  } catch (err) {
    console.error('Error fetching data: ', err);
    res.status(500).send('Server error');
  }
});

// POST endpoint to add new product
app.post('/api/products', express.json(), async (req, res) => {
  const {
    nama_produk,
    id_supplier,
    id_unit,
    id_kategori,
    harga_beli,
    harga_jual,
    stock_minimum,
  } = req.body;

  const query = `
    INSERT INTO produk (nama_produk, id_supplier, id_unit, id_kategori, harga_beli, harga_jual, stock_minimum)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Execute the insert query using promise API
    const [result] = await pool.execute(query, [
      nama_produk,
      id_supplier,
      id_unit,
      id_kategori,
      harga_beli,
      harga_jual,
      stock_minimum,
    ]);

    res
      .status(201)
      .json({ message: 'Product added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Server error');
  }
});

// PUT endpoint to update product
app.put('/api/products/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const {
    nama_produk,
    id_supplier,
    id_unit,
    id_kategori,
    harga_beli,
    harga_jual,
  } = req.body;

  try {
    const query = `
      UPDATE produk
      SET nama_produk = ?, id_supplier = ?, id_unit = ?, id_kategori = ?, harga_beli = ?, harga_jual = ?
      WHERE id_produk = ?
    `;
    const values = [
      nama_produk,
      id_supplier,
      id_unit,
      id_kategori,
      harga_beli,
      harga_jual,
      id,
    ];

    // Execute the update query using promise API
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// DELETE endpoint to delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM produk
    WHERE id_produk = ?
  `;

  try {
    // Execute the delete query using promise API
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product: ', err);
    res.status(500).send('Server error');
  }
});

// GET endpoint to fetch product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.id_produk, 
      s.harga_beli, 
      s.harga_jual,
      p.nama_produk,
      s.id_supplier, 
      sp.nama_supplier,
      s.id_unit, 
      u.nama_unit,
      s.id_kategori, 
      k.nama_kategori
    FROM produk s
    JOIN produk p ON s.id_produk = p.id_produk
    JOIN suppliers sp ON s.id_supplier = sp.id_supplier
    JOIN units u ON s.id_unit = u.id_unit
    JOIN kategori k ON s.id_kategori = k.id_kategori
    WHERE s.id_produk = ?
  `;

  try {
    // Execute the query using promise API
    const [results] = await pool.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json(results[0]); // Return the first result (there should only be one)
  } catch (err) {
    console.error('Error fetching product data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get all stock data from MySQL (for the stock page)
app.get('/api/all-stocks', async (req, res) => {
  const query = `
    SELECT stock.id_stock, produk.nama_produk, suppliers.nama_supplier, units.nama_unit, kategori.nama_kategori, 
           stock.jumlah_stock, stock.tgl_masuk, stock.tgl_exp
    FROM stock
    JOIN produk ON produk.id_produk = stock.id_produk
    JOIN suppliers ON suppliers.id_supplier = stock.id_supplier
    JOIN units ON units.id_unit = stock.id_unit
    JOIN kategori ON kategori.id_kategori = stock.id_kategori
    ORDER BY id_stock ASC
  `;

  try {
    // Execute the query using promise API
    const [results] = await pool.execute(query);

    res.status(200).json(results); // Return the results
  } catch (err) {
    console.error('Error fetching stock data: ', err);
    res.status(500).send('Server error');
  }
});

// POST endpoint to add new supplier
app.post('/api/suppliers', express.json(), async (req, res) => {
  const { nama_supplier, alamat, email, no_hp } = req.body;
  const query = `
    INSERT INTO suppliers (nama_supplier, alamat, email, no_hp)
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Execute the query using promise API
    const [result] = await pool.execute(query, [
      nama_supplier,
      alamat,
      email,
      no_hp,
    ]);

    res.status(201).json({
      message: 'Supplier added successfully',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Server error');
  }
});

// PUT endpoint to update supplier
app.put('/api/suppliers/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const { nama_supplier, alamat, email, no_hp } = req.body;

  try {
    const query = `
      UPDATE suppliers
      SET nama_supplier = ?, alamat = ?, email = ?, no_hp = ?
      WHERE id_supplier = ?
    `;
    const values = [nama_supplier, alamat, email, no_hp, id];

    // Use the correct connection object
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found.' });
    }

    res.status(200).json({ message: 'Supplier updated successfully.' });
  } catch (error) {
    console.error('Error updating Supplier:', error);
    res.status(500).json({ error: 'Failed to update Supplier.' });
  }
});

// DELETE endpoint to delete supplier
app.delete('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM suppliers
    WHERE id_supplier = ?
  `;

  try {
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found.' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Error deleting supplier: ', err);
    res.status(500).send('Server error');
  }
});

// GET endpoint to fetch supplier by ID
app.get('/api/suppliers/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.nama_supplier, 
      s.alamat, 
      s.email,
      s.no_hp
    FROM suppliers s
    WHERE s.id_supplier = ?
  `;

  try {
    const [results] = await pool.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).send('Supplier not found');
    }

    res.json(results[0]); // Return the first result (there should only be one)
  } catch (err) {
    console.error('Error fetching supplier data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get suppliers data from MySQL
app.get('/api/suppliers', async (req, res) => {
  const query = `
    SELECT id_supplier, nama_supplier, alamat, no_hp, email
    FROM suppliers
  `;

  try {
    const [results] = await pool.execute(query); // Executes the query
    res.status(200).json(results); // Explicit 200 status for success response
  } catch (err) {
    console.error('Error fetching suppliers: ', err);
    res.status(500).send('Server error'); // Send status 500 for errors
  }
});

app.post('/api/suppliers/check-email', async (req, res) => {
  const { email, id_supplier } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    let query = 'SELECT COUNT(*) AS count FROM suppliers WHERE email = ?';
    const params = [email];

    // If `id_supplier` is provided, exclude it from the check
    if (id_supplier) {
      query += ' AND id_supplier != ?';
      params.push(id_supplier);
    }

    const [rows] = await pool.query(query, params);
    const emailExists = rows[0].count > 0;

    res.json({ exists: emailExists });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to add new unit
app.post('/api/units', express.json(), async (req, res) => {
  const { nama_unit } = req.body;
  const query = `
    INSERT INTO units (nama_unit)
    VALUES (?)
  `;

  try {
    const [result] = await pool.execute(query, [nama_unit]);
    res
      .status(201)
      .json({ message: 'Unit added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Server error');
  }
});

// PUT endpoint to update unit
app.put('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_unit } = req.body;

  try {
    const query = `
      UPDATE units
      SET nama_unit = ?
      WHERE id_unit = ?
    `;
    const values = [nama_unit, id];

    // Use the correct connection object with promise-based execution
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Unit not found.' });
    }

    res.status(200).json({ message: 'Unit updated successfully.' });
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ error: 'Failed to update unit.' });
  }
});

// DELETE endpoint to delete unit
app.delete('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM units
    WHERE id_unit = ?
  `;

  try {
    const [result] = await pool.execute(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    console.error('Error deleting data: ', err);
    res.status(500).send('Server error');
  }
});

// GET endpoint to fetch unit by ID
app.get('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.id_unit, 
      s.nama_unit
    FROM units s
    WHERE s.id_unit = ?
  `;

  try {
    const [results] = await pool.execute(query, [id]);
    if (results.length === 0) {
      return res.status(404).send('Unit not found');
    }
    res.json(results[0]); // Return the first result (there should only be one)
  } catch (err) {
    console.error('Error fetching unit data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get units data from MySQL
app.get('/api/units', async (req, res) => {
  const query = `
    SELECT id_unit, nama_unit
    FROM units
  `;

  try {
    const [results] = await pool.execute(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching units: ', err);
    res.status(500).send('Server error');
  }
});

// POST endpoint to add new category
app.post('/api/categories', express.json(), async (req, res) => {
  const { nama_kategori } = req.body;
  const query = `
    INSERT INTO kategori (nama_kategori)
    VALUES (?)
  `;

  try {
    const [result] = await pool.execute(query, [nama_kategori]);
    res
      .status(201)
      .json({ message: 'Category added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error inserting data: ', err);
    res.status(500).send('Server error');
  }
});

// PUT endpoint to update category
app.put('/api/categories/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const { nama_kategori } = req.body; // Corrected variable name here

  try {
    const query = `
    UPDATE kategori
    SET nama_kategori = ?
    WHERE id_kategori = ?
  `;
    const values = [nama_kategori, id];

    // Use the correct connection object
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category updated successfully.' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// DELETE endpoint to delete category
app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM kategori
    WHERE id_kategori = ?
  `;

  try {
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting data: ', err);
    res.status(500).send('Server error');
  }
});

// GET endpoint to fetch category by ID
app.get('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      id_kategori, 
      nama_kategori
    FROM kategori
    WHERE id_kategori = ?
  `;

  try {
    const [results] = await pool.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).send('Category not found');
    }

    res.json(results[0]); // Return the first result (there should only be one)
  } catch (err) {
    console.error('Error fetching category data: ', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get categories data from MySQL
app.get('/api/categories', async (req, res) => {
  const query = `
    SELECT id_kategori, nama_kategori
    FROM kategori
  `;

  try {
    const [results] = await pool.execute(query); // Use execute for promise-based query execution
    res.status(200).json(results); // Explicit 200 status for successful response
  } catch (err) {
    console.error('Error fetching categories: ', err);
    res.status(500).json({ error: 'Server error' }); // Return error message in JSON format
  }
});

// Endpoint to get products data from MySQL
app.get('/api/products', async (req, res) => {
  const query = `
    SELECT *
    FROM produk
  `;

  try {
    const [results] = await pool.execute(query); // Use execute for promise-based query execution
    res.status(200).json(results); // Explicit 200 status for successful response
  } catch (err) {
    console.error('Error fetching products: ', err);
    res.status(500).json({ error: 'Server error' }); // Return error message in JSON format
  }
});

// Endpoint to get all products data from MySQL
app.get('/api/all-products', async (req, res) => {
  const query = `
    SELECT produk.id_produk, produk.nama_produk, suppliers.nama_supplier, units.nama_unit, kategori.nama_kategori, 
           produk.harga_beli, produk.harga_jual
    FROM produk
    JOIN suppliers ON suppliers.id_supplier = produk.id_supplier
    JOIN units ON units.id_unit = produk.id_unit
    JOIN kategori ON kategori.id_kategori = produk.id_kategori
    ORDER BY produk.id_produk ASC
  `;

  try {
    const [results] = await pool.execute(query); // Use execute for promise-based query execution
    res.status(200).json(results); // Explicit 200 status for successful response
  } catch (err) {
    console.error('Error fetching all-products: ', err);
    res.status(500).json({ error: 'Server error' }); // Return error message in JSON format
  }
});

// PUT endpoint to update product
app.put('/api/products/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const {
    id_supplier,
    id_unit,
    id_kategori,
    nama_produk,
    harga_beli,
    harga_jual,
  } = req.body;

  try {
    const query = `
      UPDATE produk
      SET nama_produk = ?, id_supplier = ?, id_unit = ?, id_kategori = ?, harga_beli = ?, harga_jual = ?
      WHERE id_produk = ?
    `;
    const values = [
      nama_produk,
      id_supplier,
      id_unit,
      id_kategori,
      harga_beli,
      harga_jual,
      id,
    ];

    // Use the correct connection object
    const [result] = await pool.query().execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Endpoint to get pembelian data from MySQL
app.get('/api/all-pembelian', async (req, res) => {
  const query = `
    SELECT 
      p.id_pembelian, 
      s.nama_supplier, 
      p.tanggal_pembelian, 
      p.total_harga
    FROM pembelian p
    JOIN suppliers s ON s.id_supplier = p.id_supplier
    ORDER BY id_pembelian ASC
  `;

  try {
    const [results] = await pool.execute(query); // Use execute for promise-based query execution
    res.status(200).json(results); // Explicit 200 status for successful response
  } catch (err) {
    console.error('Error fetching pembelian data: ', err);
    res.status(500).json({ error: 'Server error' }); // Return error message in JSON format
  }
});

// POST endpoint to add new buys (pembelian)
app.post('/api/pembelian', async (req, res) => {
  const { items, id_supplier, total_harga, tanggal_pembelian } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required.' });
  }

  // Use current date if tanggal_pembelian is not provided
  const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const date = tanggal_pembelian || currentDate;

  // Prepare the insert query for `pembelian` table
  const insertPembelianQuery = `
    INSERT INTO pembelian (id_supplier, total_harga, tanggal_pembelian)
    VALUES (?, ?, ?)
  `;

  const connection = await pool.getConnection(); // Get a connection from the pool

  try {
    // Start a transaction using the correct method
    await connection.beginTransaction(); // Fix: use beginTransaction(), not startTransaction()

    // Insert into `pembelian` table
    const [pembelianResult] = await connection.execute(insertPembelianQuery, [
      id_supplier,
      total_harga,
      date,
    ]);
    const id_pembelian = pembelianResult.insertId;

    // Prepare data for `detailpembelian` table
    const detailItems = items.map((item) => [
      id_pembelian, // Foreign key to `pembelian`
      item.id_produk,
      item.id_unit,
      item.jumlah_produk,
      item.harga,
    ]);

    // Insert into `detailpembelian` table
    const insertDetailQuery = `
      INSERT INTO detailpembelian (id_pembelian, id_produk, id_unit, jumlah_produk, harga)
      VALUES ?
    `;
    await connection.query(insertDetailQuery, [detailItems]);

    // Commit the transaction if both inserts succeed
    await connection.commit();

    res.status(201).json({
      message: 'Sale added successfully',
      id_pembelian,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error('Error adding sale:', err);
    res.status(500).json({ message: 'Failed to create sale.' });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
});

// Endpoint to get details of a specific penjualan
app.get('/api/pembelian/:id/details', async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid pembelian ID.' });
  }

  const query = `
    SELECT 
      dp.id_detail_pembelian, 
      dp.id_pembelian, 
      produk.nama_produk, 
      units.nama_unit,
      dp.jumlah_produk,
      dp.harga,
      pembelian.total_harga
    FROM detailpembelian dp
    JOIN produk ON produk.id_produk = dp.id_produk
    JOIN units ON units.id_unit = dp.id_unit
    JOIN pembelian ON pembelian.id_pembelian = dp.id_pembelian
    WHERE dp.id_pembelian = ?
    ORDER BY dp.id_detail_pembelian ASC
  `;

  try {
    const [results] = await pool.execute(query, [id]); // Use execute for promise-based query execution
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: 'No details found for this penjualan ID.' });
    }
    return res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching penjualan details:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Endpoint to get all sales data (Laporan penjualan)
app.get('/api/laporan-penjualan', (req, res) => {
  const query = `
    SELECT 
      penjualan.id_penjualan, 
      penjualan.total_harga,
      penjualan.tanggal_penjualan
    FROM penjualan
    ORDER BY id_penjualan ASC
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all sales data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to get all sales data (penjualan)
app.get('/api/all-penjualan', async (req, res) => {
  const query = `
    SELECT 
      p.id_penjualan, 
      p.total_harga,
      p.tanggal_penjualan
    FROM penjualan p
    ORDER BY id_penjualan ASC
  `;

  try {
    const [results] = await pool.execute(query); // Use execute for promise-based query execution
    res.status(200).json(results); // Explicit 200 status for successful response
  } catch (err) {
    console.error('Error fetching all sales data: ', err);
    res.status(500).json({ error: 'Server error' }); // Return error message in JSON format
  }
});

// Endpoint to get details of a specific penjualan
app.get('/api/penjualan/:id/details', async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid penjualan ID.' });
  }

  const query = `
    SELECT 
      detailpenjualan.id_detail_penjualan, 
      detailpenjualan.id_penjualan, 
      produk.nama_produk, 
      detailpenjualan.jumlah_produk,
      detailpenjualan.harga,
      penjualan.total_harga
    FROM detailpenjualan
    JOIN produk ON produk.id_produk = detailpenjualan.id_produk
    JOIN penjualan ON penjualan.id_penjualan = detailpenjualan.id_penjualan
    WHERE detailpenjualan.id_penjualan = ?
    ORDER BY detailpenjualan.id_detail_penjualan ASC
  `;

  try {
    const [results] = await pool.execute(query, [id]); // Use execute for promise-based query execution
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: 'No details found for this penjualan ID.' });
    }
    return res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching penjualan details:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST endpoint to add new sales (penjualan)
app.post('/api/penjualan', async (req, res) => {
  const { items, total_harga, tanggal_penjualan } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required.' });
  }

  const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const date = tanggal_penjualan || currentDate;

  const insertPenjualanQuery = `
    INSERT INTO penjualan (total_harga, tanggal_penjualan)
    VALUES (?, ?)
  `;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Validate and update stock for each item
    for (const item of items) {
      // Fetch all stock entries for the product
      const [stockEntries] = await connection.query(
        'SELECT id_stock, jumlah_stock, tgl_exp FROM stock WHERE id_produk = ? ORDER BY tgl_exp ASC',
        [item.id_produk]
      );

      if (!stockEntries.length) {
        throw new Error(
          `Product with ID ${item.id_produk} does not exist in stock.`
        );
      }

      // Calculate total available stock
      const totalStock = stockEntries.reduce(
        (sum, stock) => sum + stock.jumlah_stock,
        0
      );

      if (item.jumlah_produk > totalStock) {
        throw new Error(
          `Insufficient stock for product ID ${item.id_produk}. Available: ${totalStock}, Requested: ${item.jumlah_produk}`
        );
      }

      // Deduct stock only from the oldest entry
      let remainingQuantity = item.jumlah_produk;

      // Get the oldest stock entry (assumes `stockEntries` is already sorted by expiration date)
      const oldestStock = stockEntries[0];

      if (oldestStock) {
        if (remainingQuantity > oldestStock.jumlah_stock) {
          throw new Error(
            `Insufficient stock for product ID ${item.id_produk}. Oldest stock available: ${oldestStock.jumlah_stock}, Requested: ${remainingQuantity}`
          );
        }

        // Deduct the requested amount from the oldest stock
        await connection.query(
          'UPDATE stock SET jumlah_stock = jumlah_stock - ? WHERE id_stock = ?',
          [remainingQuantity, oldestStock.id_stock]
        );

        // Update remainingQuantity to zero as it's fully deducted
        remainingQuantity = 0;
      }
    }

    // Insert into `penjualan` table
    const [penjualanResult] = await connection.execute(insertPenjualanQuery, [
      total_harga,
      date,
    ]);
    const id_penjualan = penjualanResult.insertId;

    // Prepare data for `detailpenjualan` table
    const detailItems = items.map((item) => [
      id_penjualan,
      item.id_produk,
      item.jumlah_produk,
      item.harga,
    ]);

    const insertDetailQuery = `
      INSERT INTO detailpenjualan (id_penjualan, id_produk, jumlah_produk, harga)
      VALUES ?
    `;
    await connection.query(insertDetailQuery, [detailItems]);

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: 'Sale added successfully',
      id_penjualan,
    });
  } catch (err) {
    await connection.rollback();
    console.error('Error adding sale:', err);
    res.status(400).json({ message: err.message || 'Failed to create sale.' });
  } finally {
    connection.release();
  }
});

// PUT endpoint to update sales (penjualan)
app.put('/api/penjualan/:id', async (req, res) => {
  const { id } = req.params;
  const { items, total_harga, tanggal_penjualan } = req.body;

  // Validate input
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Invoice items are required.' });
  }

  // Format date
  const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const date = tanggal_penjualan || currentDate;

  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
  });

  try {
    // Start a transaction
    await pool.beginTransaction();

    // Update the `penjualan` table
    const updatePenjualanQuery = `
      UPDATE penjualan
      SET total_harga = ?, tanggal_penjualan = ?
      WHERE id_penjualan = ?
    `;
    const [updateResult] = await pool.execute(updatePenjualanQuery, [
      total_harga,
      date,
      id,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Prepare data for `detailpenjualan` table
    const detailItems = items.map((item) => [
      item.id_produk,
      item.jumlah_produk,
      item.harga,
      id, // Foreign key to `penjualan`
    ]);

    // First, delete existing details before inserting new ones
    const deleteDetailsQuery = `DELETE FROM detailpenjualan WHERE id_penjualan = ?`;
    await pool.execute(deleteDetailsQuery, [id]);

    // Insert new details into `detailpenjualan` table
    const insertDetailQuery = `
      INSERT INTO detailpenjualan (id_produk, jumlah_produk, harga, id_penjualan)
      VALUES ?
    `;
    await pool.execute(insertDetailQuery, [detailItems]);

    // Commit the transaction if all queries succeed
    await pool.commit();

    res.status(200).json({ message: 'Sale updated successfully.' });
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.rollback();
    console.error('Error updating sale:', err);
    res.status(500).json({ message: 'Failed to update sale.' });
  } finally {
    // Close the connection
    await pool.end();
  }
});

// DELETE endpoint to delete a sale (penjualan)
app.delete('/api/penjualan/:id', async (req, res) => {
  const { id } = req.params;

  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
  });

  try {
    // Start a transaction
    await pool.beginTransaction();

    // First, delete related details from `detailpenjualan`
    const deleteDetailsQuery = `
      DELETE FROM detailpenjualan
      WHERE id_penjualan = ?
    `;
    await pool.execute(deleteDetailsQuery, [id]);

    // Then, delete the sale itself from `penjualan`
    const deleteSaleQuery = `
      DELETE FROM penjualan
      WHERE id_penjualan = ?
    `;
    const [result] = await pool.execute(deleteSaleQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sale not found.' });
    }

    // Commit the transaction if both queries succeed
    await pool.commit();

    res.json({
      message: 'Sale and related details deleted successfully',
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await pool.rollback();
    console.error('Error deleting sale:', err);
    res.status(500).json({ message: 'Failed to delete sale.' });
  } finally {
    // Close the connection
    await pool.end();
  }
});

// GET endpoint to fetch penjualan by ID along with its details
app.get('/api/penjualans/:id', async (req, res) => {
  const { id } = req.params;

  // Query to get the penjualan details along with associated items
  const query = `
    SELECT 
      p.id_penjualan,
      p.total_harga,
      p.tanggal_penjualan,
      dp.id_detail_penjualan,
      pr.nama_produk,
      dp.jumlah_produk,
      dp.harga
    FROM penjualan p
    LEFT JOIN detailpenjualan dp ON dp.id_penjualan = p.id_penjualan
    LEFT JOIN produk pr ON pr.id_produk = dp.id_produk
    WHERE p.id_penjualan = ?
  `;

  try {
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Penjualan not found' });
    }

    // Structure response to return sale data with its details
    const saleData = {
      id_penjualan: rows[0].id_penjualan,
      total_harga: rows[0].total_harga,
      tanggal_penjualan: rows[0].tanggal_penjualan,
      items: rows.map((row) => ({
        id_detail_penjualan: row.id_detail_penjualan,
        nama_produk: row.nama_produk,
        jumlah_produk: row.jumlah_produk,
        harga: row.harga,
      })),
    };

    res.json(saleData);
  } catch (err) {
    console.error('Error fetching penjualan data: ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ENDPOINT for PROGRESS PENDAPATAN
async function calculateCOGS(tanggal_penjualan) {
  // You may need to adjust this query based on your business rules
  const query = `
    SELECT SUM(produk.harga_beli * d.jumlah_produk) AS total_cogs
    FROM detailpenjualan d
    JOIN produk ON produk.id_produk = d.id_produk
    WHERE d.id_penjualan = ?
  `;

  try {
    // Execute the query
    const [rows] = await pool.execute(query, [tanggal_penjualan]);

    // Return the calculated COGS or 0 if no result
    return rows.length > 0 ? rows[0].total_cogs || 0 : 0;
  } catch (err) {
    console.error('Error calculating COGS:', err);
    return 0;
  }
}

app.get('/api/progress-pendapatan', async (req, res) => {
  const query = `
    SELECT
      p.id_penjualan,
      p.tanggal_penjualan,
      p.total_harga
    FROM penjualan p
  `;

  try {
    const [rows] = await pool.execute(query);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    // Calculate profit for each sale
    const result = await Promise.all(
      rows.map(async (row) => {
        const cogs = await calculateCOGS(row.id_penjualan); // Use id_penjualan
        const profit = row.total_harga - cogs;

        return {
          id_penjualan: row.id_penjualan,
          tanggal_penjualan: row.tanggal_penjualan,
          total_harga: row.total_harga,
          profit: profit,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('Error fetching progress-pendapatan: ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET endpoint to fetch total sum of total_harga (from penjualan)
app.get('/api/total-harga-sum', async (req, res) => {
  const query = 'SELECT SUM(total_harga) AS total_harga_sum FROM penjualan';

  try {
    const [rows] = await pool.execute(query); // Using execute() for promise-based queries

    // Check if there's a result and send the sum
    if (rows && rows.length > 0) {
      res.json({ total_harga_sum: rows[0].total_harga_sum });
    } else {
      res.status(404).json({ message: 'No sales data found' });
    }
  } catch (error) {
    console.error('Error fetching total harga sum:', error);
    res.status(500).json({ message: 'Error fetching total harga sum' });
  }
});

// GET endpoint to fetch total sum of jumlah_produk (from detailpenjualan)
app.get('/api/total-produk-sum', async (req, res) => {
  const query =
    'SELECT SUM(jumlah_produk) AS total_produk_sum FROM detailpenjualan';

  try {
    const [rows] = await pool.execute(query); // Using execute() for promise-based query execution

    // Check if the result exists and return the sum
    if (rows && rows.length > 0) {
      res.json({ total_produk_sum: rows[0].total_produk_sum });
    } else {
      res.status(404).json({ message: 'No product data found' });
    }
  } catch (error) {
    console.error('Error fetching total produk sum:', error);
    res.status(500).json({ message: 'Error fetching total produk sum' });
  }
});

// Get total count of penjualan (sales)
app.get('/api/total-penjualan', async (req, res) => {
  const query = 'SELECT COUNT(*) AS total_penjualan FROM penjualan';

  try {
    const [rows] = await pool.execute(query); // Use execute() for promise-based queries
    res.json({ total_penjualan: rows[0].total_penjualan }); // Return total sales count
  } catch (error) {
    console.error('Error fetching total penjualan:', error);
    res.status(500).json({ message: 'Error fetching total penjualan' });
  }
});

// INI LISTEN HARUS PALING BAWAH!
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
