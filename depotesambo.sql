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

-- Dumping structure for table depotesambo.detailpenjualan
CREATE TABLE IF NOT EXISTS `detailpenjualan` (
  `id_detail_penjualan` int NOT NULL AUTO_INCREMENT,
  `id_produk` int NOT NULL,
  `jumlah_produk` int NOT NULL,
  `harga` int NOT NULL,
  PRIMARY KEY (`id_detail_penjualan`),
  KEY `id_produk` (`id_produk`),
  CONSTRAINT `detailpenjualan_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.detailpenjualan: ~0 rows (approximately)
DELETE FROM `detailpenjualan`;

-- Dumping structure for table depotesambo.kategori
CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.kategori: ~6 rows (approximately)
DELETE FROM `kategori`;
INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
	(1, 'Shampo'),
	(2, 'Sabun batang'),
	(3, 'Mentega'),
	(4, 'Tepung'),
	(5, 'Kecap'),
	(6, 'Lilin');

-- Dumping structure for table depotesambo.pembelian
CREATE TABLE IF NOT EXISTS `pembelian` (
  `id_pembelian` int NOT NULL AUTO_INCREMENT,
  `jumlah_produk` int NOT NULL,
  `tanggal_pembelian` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_produk` int NOT NULL,
  `id_supplier` int NOT NULL,
  PRIMARY KEY (`id_pembelian`),
  KEY `id_produk` (`id_produk`),
  KEY `id_supplier` (`id_supplier`),
  CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON UPDATE CASCADE,
  CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers` (`id_supplier`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.pembelian: ~2 rows (approximately)
DELETE FROM `pembelian`;
INSERT INTO `pembelian` (`id_pembelian`, `jumlah_produk`, `tanggal_pembelian`, `id_produk`, `id_supplier`) VALUES
	(1, 42, '2024-11-06 16:56:14', 4, 3),
	(2, 48, '2024-11-06 16:56:14', 3, 3);

-- Dumping structure for table depotesambo.penjualan
CREATE TABLE IF NOT EXISTS `penjualan` (
  `id_penjualan` varchar(50) NOT NULL,
  `id_detail_penjualan` int NOT NULL,
  `total_harga` int NOT NULL,
  `tanggal_penjualan` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_penjualan`),
  KEY `id_detail_penjualan` (`id_detail_penjualan`),
  CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`id_detail_penjualan`) REFERENCES `detailpenjualan` (`id_detail_penjualan`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.penjualan: ~0 rows (approximately)
DELETE FROM `penjualan`;

-- Dumping structure for table depotesambo.produk
CREATE TABLE IF NOT EXISTS `produk` (
  `id_produk` int NOT NULL AUTO_INCREMENT,
  `nama_produk` varchar(255) NOT NULL,
  `harga_beli` int NOT NULL,
  `harga_jual` int NOT NULL,
  `id_kategori` int NOT NULL,
  `id_unit` int NOT NULL,
  `isi_produk` int NOT NULL,
  `stock_minimum` int DEFAULT NULL,
  PRIMARY KEY (`id_produk`) USING BTREE,
  KEY `id_kategori` (`id_kategori`),
  KEY `id_unit` (`id_unit`),
  CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON UPDATE CASCADE,
  CONSTRAINT `produk_ibfk_2` FOREIGN KEY (`id_unit`) REFERENCES `units` (`id_unit`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table depotesambo.produk: ~6 rows (approximately)
DELETE FROM `produk`;
INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga_beli`, `harga_jual`, `id_kategori`, `id_unit`, `isi_produk`, `stock_minimum`) VALUES
	(1, 'Shampo Emeron hijau kecil', 14000, 22000, 1, 1, 24, 15),
	(2, 'Shampo Emeron hijau besar', 17000, 28000, 1, 1, 24, 13),
	(3, 'Kecap tomat', 8500, 14000, 5, 1, 6, 12),
	(4, 'Kecap payung', 8000, 13500, 5, 1, 6, 11),
	(5, 'Sabun Lifebuoy btg lemon', 3500, 5000, 2, 1, 4, 50),
	(6, 'Sabun Lifebuoy btg merah', 3500, 5000, 2, 1, 4, 70);

-- Dumping structure for table depotesambo.stock
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table depotesambo.stock: ~4 rows (approximately)
DELETE FROM `stock`;
INSERT INTO `stock` (`id_stock`, `id_unit`, `id_kategori`, `id_produk`, `id_supplier`, `jumlah_stock`, `tgl_exp`, `tgl_masuk`) VALUES
	(1, 1, 1, 1, 2, 189, '2026-11-27', '2024-01-10'),
	(2, 1, 2, 5, 6, 13, '2024-11-11', '2024-11-10'),
	(3, 1, 2, 6, 5, 14, '2025-11-10', '2024-11-10'),
	(9, 1, 1, 1, 3, 5, '2025-11-11', '2024-11-11');

-- Dumping structure for table depotesambo.suppliers
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id_supplier` int NOT NULL AUTO_INCREMENT,
  `nama_supplier` varchar(50) NOT NULL,
  `alamat` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  PRIMARY KEY (`id_supplier`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table depotesambo.suppliers: ~6 rows (approximately)
DELETE FROM `suppliers`;
INSERT INTO `suppliers` (`id_supplier`, `nama_supplier`, `alamat`, `email`, `no_hp`) VALUES
	(2, 'Tika', 'gg sawo no 1028', 'saraTika@gmail.com', '0857934622433'),
	(3, 'Bella', 'gg pepaya no 32', 'bellabnt@gmail.com', '088267833032'),
	(4, 'Agung', 'jl basuki ht n0 84', 'Agng19@gmail.com', '08113310056'),
	(5, 'Yudis', 'jl semar no 81', 'yudistp@gmail.com', '0857 393168'),
	(6, 'Denis', 'jl raden patah no 46', 'denisprtm@gmail.com', '081278543889'),
	(7, 'Layla', 'jl rajawali no 31', 'laylakc@gmail.com', '08218998446');

-- Dumping structure for table depotesambo.units
CREATE TABLE IF NOT EXISTS `units` (
  `id_unit` int NOT NULL AUTO_INCREMENT,
  `nama_unit` varchar(50) NOT NULL,
  PRIMARY KEY (`id_unit`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table depotesambo.units: ~3 rows (approximately)
DELETE FROM `units`;
INSERT INTO `units` (`id_unit`, `nama_unit`) VALUES
	(1, 'Pcs'),
	(2, 'Kg'),
	(3, 'Box');

-- Dumping structure for table depotesambo.users
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nama_user` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `no_hp` varchar(12) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table depotesambo.users: ~3 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id_user`, `nama_user`, `role`, `username`, `no_hp`, `password`) VALUES
	(1, 'Michelle Shannen', 'Admin', 'MichelleS', '088212000888', 'password123'),
	(2, 'Audrey', 'Gudang', 'AudreyD', '088213786556', 'password123'),
	(3, 'Mikael', 'kasir', 'Mikael', '08578895433', 'password123');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
