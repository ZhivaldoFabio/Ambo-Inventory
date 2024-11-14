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
    SELECT id_produk, nama_produk, harga_jual
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

// PUT endpoint to update product
app.put('/api/products/:id', async (req, res) => {
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

// Endpoint to get all sales data (penjualan)
app.get('/api/all-penjualan', (req, res) => {
  const query = `
    SELECT 
      penjualan.id_penjualan, 
      penjualan.tanggal_penjualan, 
      produk.nama_produk, 
      penjualan.jumlah_produk, 
      penjualan.total_harga, 
      suppliers.nama_supplier, 
      units.nama_unit 
    FROM penjualan
    JOIN produk ON produk.id_produk = penjualan.id_produk
    JOIN suppliers ON suppliers.id_supplier = penjualan.id_supplier
    JOIN units ON units.id_unit = penjualan.id_unit
    ORDER BY penjualan.id_penjualan ASC
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

// POST endpoint to add new sales (penjualan)
app.post('/api/penjualan', (req, res) => {
  const { items, total_harga, tanggal_penjualan } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).send('Invoice items are required.');
  }

  // Insert into `penjualan` table
  const insertPenjualanQuery = `
    INSERT INTO penjualan (total_harga, tanggal_penjualan)
    VALUES (?, ?)
  `;

  // Use current date if tanggal_penjualan is not provided
  const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
  const date = tanggal_penjualan || currentDate;

  connection.query(
    insertPenjualanQuery,
    [total_harga, date],
    (err, result) => {
      if (err) {
        console.error('Error inserting into penjualan:', err);
        return res.status(500).send('Failed to create invoice.');
      }

      const id_penjualan = result.insertId;

      // Prepare data for `detailpenjualan` table
      const detailItems = items.map((item) => [
        id_penjualan, // Foreign key to `penjualan`
        item.id_produk,
        item.jumlah_produk,
        item.harga,
      ]);

      // Insert into `detailpenjualan` table
      const insertDetailQuery = `
        INSERT INTO detailpenjualan (id_penjualan, id_produk, jumlah_produk, harga)
        VALUES ?
      `;

      connection.query(insertDetailQuery, [detailItems], (err) => {
        if (err) {
          console.error('Error inserting into detailpenjualan:', err);
          return res.status(500).send('Failed to add items to the invoice.');
        }

        res.status(201).json({
          message: 'Sale added successfully',
          id_penjualan,
        });
      });
    }
  );
});

// PUT endpoint to update sales (penjualan)
app.put('/api/penjualan/:id', (req, res) => {
  const { id } = req.params;
  const {
    id_produk,
    id_supplier,
    id_unit,
    jumlah_produk,
    total_harga,
    tanggal_penjualan,
  } = req.body;

  const query = `
    UPDATE penjualan
    SET id_produk = ?, id_supplier = ?, id_unit = ?, jumlah_produk = ?, total_harga = ?, tanggal_penjualan = ?
    WHERE id_penjualan = ?
  `;

  connection.query(
    query,
    [
      id_produk,
      id_supplier,
      id_unit,
      jumlah_produk,
      total_harga,
      tanggal_penjualan,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating sale: ', err);
        res.status(500).send('Server error');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Sale not found');
      } else {
        res.status(200).json({ message: 'Sale updated successfully' });
      }
    }
  );
});

// DELETE endpoint to delete a sale (penjualan)
app.delete('/api/penjualan/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM penjualan
    WHERE id_penjualan = ?
  `;

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting sale: ', err);
      res.status(500).send('Server error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Sale not found');
    } else {
      res.json({ message: 'Sale deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// GET endpoint to fetch penjualan by ID
app.get('/api/penjualans/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.total_harga,
      s.tanggal_penjualan
    FROM penjualan s
    WHERE s.id_penjualan = ?
  `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching penjualan data: ', err);
      res.status(500).send('Server error');
    } else if (results.length === 0) {
      res.status(404).send('Penjualan not found');
    } else {
      res.json(results[0]); // Return the first result (there should only be one)
    }
  });
});

