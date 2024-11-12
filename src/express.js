// src/express.js
import express from 'express';
import connection from './db.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

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
app.put('/api/stocks/:id', express.json(), (req, res) => {
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
    SET id_produk = ?, id_supplier = ?, id_unit = ?, id_kategori = ?, jumlah_stock = ?, tgl_masuk = ?, tgl_exp = ?
    WHERE id_stock = ?
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
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating data: ', err);
        res.status(500).send('Server error');
      } else {
        res.json({ message: 'Stock updated successfully' });
      }
    }
  );
});

// GET endpoint to fetch stock by ID
app.get('/api/stocks/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.id_stock, s.jumlah_stock, s.tgl_masuk, s.tgl_exp,
           p.nama_produk, sp.nama_supplier, u.nama_unit, k.nama_kategori
    FROM stock s
    JOIN produk p ON s.id_produk = p.id_produk
    JOIN suppliers sp ON s.id_supplier = sp.id_supplier  -- Corrected table name here
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
