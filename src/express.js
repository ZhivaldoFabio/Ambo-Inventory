// src/express.js
import express from 'express';
import connection from './db.js';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
