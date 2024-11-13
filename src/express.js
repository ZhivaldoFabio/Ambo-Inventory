// src/express.js
import express from 'express';
import connection from './db.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
// Add this to ensure Express can parse JSON requests
app.use(express.json());

// POST endpoint to add new stock
app.post('/api/stocks', express.json(), (req, res) => {
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
  connection.query(
    query,
    [
      id_produk,
      id_supplier,
      id_unit,
      id_kategori,
      jumlah_stock,
      tgl_masuk,
      tgl_exp,
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res
          .status(201)
          .json({ message: 'Stock added successfully', id: result.insertId });
      }
    }
  );
});

// PUT endpoint to update stock
app.put('/api/stocks/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
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

  try {
    // Convert ISO dates to MySQL-compatible date strings
    const formattedTglMasuk = new Date(tgl_masuk).toLocaleDateString('en-CA'); // yyyy-MM-dd
    const formattedTglExp = tgl_exp
      ? new Date(tgl_exp).toLocaleDateString('en-CA')
      : null;

    const query = `
    UPDATE stock
    SET id_produk = ?, id_supplier = ?, id_unit = ?, id_kategori = ?, jumlah_stock = ?, tgl_masuk = ?, tgl_exp = ?
    WHERE id_stock = ?
  `;
    const values = [
      id_produk,
      id_supplier,
      id_unit,
      id_kategori,
      jumlah_stock,
      formattedTglMasuk,
      formattedTglExp,
      id,
    ];

    // Use the correct connection object
    const [result] = await connection.promise().execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Stock not found.' });
    }

    res.status(200).json({ message: 'Stock updated successfully.' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock.' });
  }
});

// GET endpoint to fetch stock by ID
app.get('/api/stocks/:id', (req, res) => {
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
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching stock data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Stock not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

// DELETE endpoint to delete stock
app.delete('/api/stocks/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM stock
    WHERE id_stock = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json({ message: 'Stock deleted successfully' });
    }
  });
});

// Endpoint to get stock data
app.get('/api/stocks', (req, res) => {
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

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// POST endpoint to add new product
app.post('/api/products', express.json(), (req, res) => {
  const {
    nama_produk,
    id_supplier,
    id_unit,
    id_kategori,
    harga_beli,
    harga_jual,
  } = req.body;
  const query = `
    INSERT INTO produk (nama_produk,id_supplier,id_unit,id_kategori,harga_beli,harga_jual)
    VALUES (?,?,?,?,?,?)
  `;
  connection.query(
    query,
    [nama_produk, id_supplier, id_unit, id_kategori, harga_beli, harga_jual],
    (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res
          .status(201)
          .json({ message: 'Product added successfully', id: result.insertId });
      }
    }
  );
});
// PUT endpoint to update product Mcc
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
    UPDATE product
    SET nama_produk = ?, id_supplier = ?, id_unit = ?, id_kategori = ?, harga_beli = ?, harga_jual = ?, 
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
    const [result] = await connection.promise().execute(query, values);

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
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM produk
    WHERE id_produk = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// GET endpoint to fetch product by ID
app.get('/api/products/:id', (req, res) => {
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
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching product data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Product not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

// Endpoint to get all stock data from MySQL (for the stock page)
app.get('/api/all-stocks', (req, res) => {
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

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stock data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// POST endpoint to add new supplier
app.post('/api/suppliers', express.json(), (req, res) => {
  const { nama_supplier, alamat, email, no_hp } = req.body;
  const query = `
    INSERT INTO suppliers (nama_supplier,alamat,email,no_hp)
    VALUES (?,?,?,?)
  `;
  connection.query(
    query,
    [nama_supplier, alamat, email, no_hp],
    (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res.status(201).json({
          message: 'Supplier added successfully',
          id: result.insertId,
        });
      }
    }
  );
});
// PUT endpoint to update supplier Mcc
app.put('/api/suppliers/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const { nama_supplier, alamat, email, no_hp } = req.body;

  try {
    const query = `
    UPDATE suppliers
    SET nama_supplier = ?, alamat = ?, email = ?, no_hp = ?,
    WHERE id_supplier = ?
  `;
    const values = [nama_supplier, alamat, email, no_hp, id];

    // Use the correct connection object
    const [result] = await connection.promise().execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found.' });
    }

    res.status(200).json({ message: 'Supplier updated successfully.' });
  } catch (error) {
    console.error('Error updating Supplier:', error);
    res.status(500).json({ error: 'Failed to update Supplier.' });
  }
});

// DELETE endpoint to delete product
app.delete('/api/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM suppliers
    WHERE id_supplier = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json({ message: 'Supplier deleted successfully' });
    }
  });
});

// GET endpoint to fetch supplier by ID
app.get('/api/suppliers/:id', (req, res) => {
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
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching supplier data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Supplier not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

// Endpoint to get suppliers data from MySQL
app.get('/api/suppliers', (req, res) => {
  const query = `
    SELECT id_supplier, nama_supplier, alamat, no_hp, email
    FROM suppliers
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching suppliers: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// POST endpoint to add new unit
app.post('/api/units', express.json(), (req, res) => {
  const { nama_unit } = req.body;
  const query = `
    INSERT INTO units (nama_unit)
    VALUES (?)
  `;
  connection.query(query, [nama_unit], (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      res.status(500).send('Server error');
    } else {
      res
        .status(201)
        .json({ message: 'Unit added successfully', id: result.insertId });
    }
  });
});
// PUT endpoint to update unit Mcc
app.put('/api/units/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const { nama_unit } = req.body;

  try {
    const query = `
    UPDATE unit
    SET nama_unit = ?
    WHERE id_unit = ?
  `;
    const values = [nama_unit, id];

    // Use the correct connection object
    const [result] = await connection.promise().execute(query, values);

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
app.delete('/api/units/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM unit
    WHERE id_unit = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json({ message: 'Unit deleted successfully' });
    }
  });
});

// GET endpoint to fetch unit by ID
app.get('/api/units/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.id_unit, 
      s.nama_unit
    FROM units s
    WHERE s.id_unit = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching unit data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Unit not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

// Endpoint to get units data from MySQL
app.get('/api/units', (req, res) => {
  const query = `
    SELECT id_unit, nama_unit
    FROM units
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching units: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// POST endpoint to add new category
app.post('/api/categories', express.json(), (req, res) => {
  const { nama_kategori } = req.body;
  const query = `
    INSERT INTO kategori (nama_kategori)
    VALUES (?)
  `;
  connection.query(query, [nama_kategori], (err, result) => {
    if (err) {
      console.error('Error inserting data: ', err);
      res.status(500).send('Server error');
    } else {
      res
        .status(201)
        .json({ message: 'Category added successfully', id: result.insertId });
    }
  });
});
// PUT endpoint to update category Mcc
app.put('/api/categories/:id', async (req, res) => {
  console.log(req.body); // Log the incoming request body for debugging
  const { id } = req.params;
  const { nama_unit } = req.body;

  try {
    const query = `
    UPDATE kategori
    SET nama_kategori = ?
    WHERE id_kategori = ?
  `;
    const values = [nama_kategori, id];

    // Use the correct connection object
    const [result] = await connection.promise().execute(query, values);

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
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    DELETE FROM kategori
    WHERE id_kategori = ?
  `;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data: ', err);
      res.status(500).send('Server error');
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  });
});

// GET endpoint to fetch unit by ID
app.get('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.id_kategori, 
      s.nama_kategori
    FROM kategori s
    WHERE s.id_kategori = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching category data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Category not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

// Endpoint to get categories data from MySQL
app.get('/api/categories', (req, res) => {
  const query = `
    SELECT id_kategori, nama_kategori
    FROM kategori
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to get products data from MySQL
app.get('/api/products', (req, res) => {
  const query = `
    SELECT id_produk, nama_produk
    FROM produk
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching produk: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to get products data from MySQL
app.get('/api/all-products', (req, res) => {
  const query = `
    SELECT produk.id_produk, produk.nama_produk, suppliers.nama_supplier, units.nama_unit, kategori.nama_kategori, 
           produk.harga_beli, produk.harga_jual
    FROM produk
    JOIN suppliers ON suppliers.id_supplier = produk.id_supplier
    JOIN units ON units.id_unit = produk.id_unit
    JOIN kategori ON kategori.id_kategori = produk.id_kategori
    ORDER BY id_produk ASC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all-produk: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Endpoint to get pembelian data from MySQL
app.get('/api/all-pembelian', (req, res) => {
  const query = `
    SELECT pembelian.id_pembelian, pembelian.tanggal_pembelian, suppliers.nama_supplier, produk.nama_produk, pembelian.jumlah_produk, units.nama_unit
    FROM pembelian
    JOIN suppliers ON suppliers.id_supplier = pembelian.id_supplier
    JOIN units ON units.id_unit = pembelian.id_unit
    JOIN produk on produk.id_produk = pembelian.id_produk
    ORDER BY id_pembelian ASC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all-produk: ', err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
