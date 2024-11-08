// server.js
import express from 'express';
import connection from './db.js'; // Your MySQL connection file
const app = express();
const port = 3000;

// Endpoint to get stock data
app.get('/api/stocks', (req, res) => {
  const query = `
    SELECT produk.nama_produk, kategori.nama_kategori, suppliers.nama_supplier, stock.jumlah_stock
    FROM produk
    JOIN kategori ON produk.id_kategori = kategori.id_kategori
    JOIN suppliers ON produk.id_supplier = suppliers.id_supplier
    JOIN stock ON produk.id_produk = stock.id_produk
    WHERE stock.jumlah_stock < produk.stock_minimum
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
