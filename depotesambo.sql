-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table depotesambo.detailpembelian
DROP TABLE IF EXISTS `detailpembelian`;
CREATE TABLE IF NOT EXISTS `detailpembelian` (
  `id_detail_pembelian` int NOT NULL AUTO_INCREMENT,
  `id_pembelian` int NOT NULL,
  `id_produk` int NOT NULL,
  `id_unit` int NOT NULL,
  `jumlah_produk` int NOT NULL,
  `harga` int NOT NULL,
  PRIMARY KEY (`id_detail_pembelian`),
  KEY `id_pembelian` (`id_pembelian`),
  KEY `id_produk` (`id_produk`),
  KEY `id_supplier` (`id_unit`) USING BTREE,
  CONSTRAINT `FK_detailpembelian_pembelian` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian` (`id_pembelian`) ON UPDATE CASCADE,
  CONSTRAINT `FK_detailpembelian_produk` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE,
  CONSTRAINT `FK_detailpembelian_units` FOREIGN KEY (`id_unit`) REFERENCES `units` (`id_unit`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table depotesambo.detailpembelian: ~11 rows (approximately)
DELETE FROM `detailpembelian`;
INSERT INTO `detailpembelian` (`id_detail_pembelian`, `id_pembelian`, `id_produk`, `id_unit`, `jumlah_produk`, `harga`) VALUES
	(1, 1, 1, 1, 5, 14000),
	(2, 2, 7, 1, 12, 17000),
	(3, 1, 2, 1, 3, 28000),
	(4, 4, 3, 1, 1, 14000),
	(5, 5, 4, 1, 1, 13500),
	(6, 6, 1, 1, 40, 22000),
	(7, 6, 2, 1, 20, 28000),
	(8, 6, 5, 1, 80, 5000),
	(9, 6, 6, 1, 80, 5000),
	(10, 7, 1, 1, 2, 22000),
	(11, 7, 2, 1, 3, 28000);

-- Dumping structure for table depotesambo.detailpenjualan
DROP TABLE IF EXISTS `detailpenjualan`;
CREATE TABLE IF NOT EXISTS `detailpenjualan` (
  `id_detail_penjualan` int NOT NULL AUTO_INCREMENT,
  `id_penjualan` int NOT NULL,
  `id_produk` int NOT NULL,
  `jumlah_produk` int NOT NULL,
  `harga` int NOT NULL,
  PRIMARY KEY (`id_detail_penjualan`),
  KEY `id_produk` (`id_produk`),
  KEY `id_penjualan` (`id_penjualan`) USING BTREE,
  CONSTRAINT `detailpenjualan_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE,
  CONSTRAINT `detailpenjualan_ibfk_2` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan` (`id_penjualan`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.detailpenjualan: ~26 rows (approximately)
DELETE FROM `detailpenjualan`;
INSERT INTO `detailpenjualan` (`id_detail_penjualan`, `id_penjualan`, `id_produk`, `jumlah_produk`, `harga`) VALUES
	(1, 1, 1, 1, 22000),
	(2, 2, 2, 3, 28000),
	(3, 2, 5, 2, 5000),
	(4, 3, 1, 2, 22000),
	(5, 3, 3, 2, 14000),
	(6, 4, 3, 1, 14000),
	(7, 5, 4, 1, 13500),
	(8, 6, 5, 1, 5000),
	(9, 7, 6, 1, 5000),
	(10, 8, 7, 1, 17000),
	(11, 9, 1, 1, 22000),
	(12, 9, 2, 1, 28000),
	(13, 9, 5, 1, 5000),
	(14, 9, 6, 1, 5000),
	(15, 10, 3, 1, 14000),
	(16, 11, 3, 8, 14000),
	(17, 12, 3, 1, 14000),
	(18, 13, 3, 11, 14000),
	(19, 14, 3, 1, 14000),
	(20, 15, 3, 1, 14000),
	(21, 16, 3, 1, 14000),
	(22, 17, 1, 1, 22000),
	(25, 19, 1, 1, 22000),
	(26, 20, 1, 5, 22000),
	(27, 20, 6, 3, 5000),
	(28, 21, 3, 1, 14000);

-- Dumping structure for table depotesambo.kategori
DROP TABLE IF EXISTS `kategori`;
CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.kategori: ~7 rows (approximately)
DELETE FROM `kategori`;
INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
	(1, 'Shampo'),
	(2, 'Sabun batang'),
	(3, 'Mentega'),
	(4, 'Tepung'),
	(5, 'Kecap'),
	(6, 'Lilin'),
	(7, 'SKM');

-- Dumping structure for table depotesambo.pembelian
DROP TABLE IF EXISTS `pembelian`;
CREATE TABLE IF NOT EXISTS `pembelian` (
  `id_pembelian` int NOT NULL AUTO_INCREMENT,
  `id_supplier` int NOT NULL,
  `tanggal_pembelian` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_harga` int NOT NULL,
  PRIMARY KEY (`id_pembelian`),
  KEY `FK_pembelian_suppliers` (`id_supplier`),
  CONSTRAINT `FK_pembelian_suppliers` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers` (`id_supplier`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.pembelian: ~7 rows (approximately)
DELETE FROM `pembelian`;
INSERT INTO `pembelian` (`id_pembelian`, `id_supplier`, `tanggal_pembelian`, `total_harga`) VALUES
	(1, 4, '2024-11-06 16:56:14', 10000),
	(2, 4, '2024-11-06 16:56:14', 10000),
	(3, 8, '2024-11-18 15:46:53', 20000),
	(4, 8, '2024-11-17 17:00:00', 14000),
	(5, 8, '2024-11-17 17:00:00', 13500),
	(6, 4, '2024-11-17 17:00:00', 2240000),
	(7, 8, '2024-11-17 17:00:00', 128000);

-- Dumping structure for table depotesambo.penjualan
DROP TABLE IF EXISTS `penjualan`;
CREATE TABLE IF NOT EXISTS `penjualan` (
  `id_penjualan` int NOT NULL AUTO_INCREMENT,
  `total_harga` int NOT NULL,
  `tanggal_penjualan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_penjualan`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.penjualan: ~20 rows (approximately)
DELETE FROM `penjualan`;
INSERT INTO `penjualan` (`id_penjualan`, `total_harga`, `tanggal_penjualan`) VALUES
	(1, 22000, '2024-11-12 17:00:00'),
	(2, 94000, '2024-11-17 17:00:00'),
	(3, 72000, '2024-11-17 17:00:00'),
	(4, 14000, '2024-11-17 17:00:00'),
	(5, 13500, '2024-11-17 17:00:00'),
	(6, 5000, '2024-11-17 17:00:00'),
	(7, 5000, '2024-11-17 17:00:00'),
	(8, 17000, '2024-11-17 17:00:00'),
	(9, 60000, '2024-11-17 17:00:00'),
	(10, 14000, '2024-11-18 17:00:00'),
	(11, 112000, '2024-11-18 17:00:00'),
	(12, 14000, '2024-11-18 17:00:00'),
	(13, 154000, '2024-11-18 17:00:00'),
	(14, 14000, '2024-11-18 17:00:00'),
	(15, 14000, '2024-11-18 17:00:00'),
	(16, 14000, '2024-11-18 17:00:00'),
	(17, 22000, '2024-11-18 17:00:00'),
	(19, 22000, '2024-11-23 17:00:00'),
	(20, 125000, '2024-11-23 17:00:00'),
	(21, 14000, '2024-11-23 17:00:00');

-- Dumping structure for table depotesambo.produk
DROP TABLE IF EXISTS `produk`;
CREATE TABLE IF NOT EXISTS `produk` (
  `id_produk` int NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `harga_beli` int NOT NULL,
  `harga_jual` int NOT NULL,
  `id_kategori` int NOT NULL,
  `id_unit` int NOT NULL,
  `isi_produk` int DEFAULT NULL,
  `stock_minimum` int DEFAULT NULL,
  `id_supplier` int NOT NULL,
  PRIMARY KEY (`id_produk`) USING BTREE,
  KEY `id_kategori` (`id_kategori`),
  KEY `id_unit` (`id_unit`),
  KEY `produk_ibfk_3` (`id_supplier`),
  CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE,
  CONSTRAINT `produk_ibfk_2` FOREIGN KEY (`id_unit`) REFERENCES `units` (`id_unit`) ON UPDATE CASCADE,
  CONSTRAINT `produk_ibfk_3` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers` (`id_supplier`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table depotesambo.produk: ~7 rows (approximately)
DELETE FROM `produk`;
INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga_beli`, `harga_jual`, `id_kategori`, `id_unit`, `isi_produk`, `stock_minimum`, `id_supplier`) VALUES
	(1, 'Shampo Emeron hijau kecil', 14000, 22000, 1, 1, 24, 15, 2),
	(2, 'Shampo Emeron hijau besar', 17000, 28000, 1, 1, 24, 13, 2),
	(3, 'Kecap tomat', 8500, 14000, 5, 1, 6, 12, 2),
	(4, 'Kecap payung', 8000, 13500, 5, 1, 6, 11, 2),
	(5, 'Sabun Lifebuoy btg lemon', 3500, 5000, 2, 1, 4, 50, 2),
	(6, 'Sabun Lifebuoy btg merah', 3500, 5000, 2, 1, 4, 70, 2),
	(7, 'Skm Frisian flag putih', 14000, 17000, 7, 1, NULL, NULL, 8);

-- Dumping structure for table depotesambo.stock
DROP TABLE IF EXISTS `stock`;
CREATE TABLE IF NOT EXISTS `stock` (
  `id_stock` int NOT NULL AUTO_INCREMENT,
  `id_unit` int NOT NULL,
  `id_kategori` int NOT NULL,
  `id_produk` int NOT NULL,
  `id_supplier` int NOT NULL,
  `jumlah_stock` int NOT NULL,
  `tgl_exp` date NOT NULL,
  `tgl_masuk` date NOT NULL,
  PRIMARY KEY (`id_stock`),
  KEY `id_kategori` (`id_kategori`),
  KEY `id_produk` (`id_produk`),
  KEY `id_supplier` (`id_supplier`),
  KEY `id_unit` (`id_unit`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_3` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers` (`id_supplier`) ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_4` FOREIGN KEY (`id_unit`) REFERENCES `units` (`id_unit`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.stock: ~5 rows (approximately)
DELETE FROM `stock`;
INSERT INTO `stock` (`id_stock`, `id_unit`, `id_kategori`, `id_produk`, `id_supplier`, `jumlah_stock`, `tgl_exp`, `tgl_masuk`) VALUES
	(1, 1, 1, 1, 2, 154, '2026-11-27', '2024-01-10'),
	(2, 1, 2, 5, 6, 1, '2024-11-11', '2024-11-10'),
	(3, 1, 2, 6, 5, 9, '2025-11-10', '2024-11-10'),
	(10, 3, 5, 3, 2, 3, '2025-11-11', '2024-11-11'),
	(11, 1, 7, 7, 1, 1000, '2025-02-24', '2024-11-01');

-- Dumping structure for table depotesambo.suppliers
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id_supplier` int NOT NULL AUTO_INCREMENT,
  `nama_supplier` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `alamat` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_supplier`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table depotesambo.suppliers: ~9 rows (approximately)
DELETE FROM `suppliers`;
INSERT INTO `suppliers` (`id_supplier`, `nama_supplier`, `alamat`, `email`, `no_hp`) VALUES
	(1, 'Valdo Ganteng', 'Jl jalan di hatimu', 'valdoganteng@gmail.com', '088233562800'),
	(2, 'Tika', 'gg sawo no 1028', 'saraTika@gmail.com', '0857934622433'),
	(3, 'Bella', 'gg pepaya no 32', 'bellabnt@gmail.com', '088267833032'),
	(4, 'Agung', 'jl basuki ht n0 84', 'Agng19@gmail.com', '08113310056'),
	(5, 'Yudis', 'jl semar no 81', 'yudisedit@gmail.com', '0857393168'),
	(6, 'Denis', 'jl raden patah no 46', 'denisprtm@gmail.com', '081278543889'),
	(7, 'Layla', 'jl rajawali no 31', 'laylakc@gmail.com', '08218998446'),
	(8, 'Anna', 'jl Lawu no 32', 'annael@gmail.com', '088233000999'),
	(9, 'Kimmy', 'jl anjasmoro no 387', 'kimmymy@gmail.com', '08766539976');

-- Dumping structure for table depotesambo.units
DROP TABLE IF EXISTS `units`;
CREATE TABLE IF NOT EXISTS `units` (
  `id_unit` int NOT NULL AUTO_INCREMENT,
  `nama_unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_unit`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table depotesambo.units: ~3 rows (approximately)
DELETE FROM `units`;
INSERT INTO `units` (`id_unit`, `nama_unit`) VALUES
	(1, 'Pcs'),
	(2, 'Kg'),
	(3, 'Box');

-- Dumping structure for table depotesambo.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `nama_user` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table depotesambo.users: ~3 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id_user`, `email`, `nama_user`, `role`, `username`, `no_hp`, `password`) VALUES
	(1, 'michelle.shannen@ti.ukdw.ac.id', 'Michelle Shannen', 'Admin', 'Michelle Shannen', '088212000888', 'password123'),
	(2, 'audrey.darmawan@ti.ukdw.ac.id', 'Audrey', 'Gudang', 'Audrey Darmawan', '088213786556', 'password123'),
	(3, 'mikael.dante@ti.ukdw.ac.id', 'Mikael', 'Kasir', 'Mikael Dante', '08578895433', 'password123');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
