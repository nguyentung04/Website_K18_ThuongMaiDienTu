-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 09, 2024 at 08:54 PM
-- Server version: 8.0.36
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dong_ho_bee`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Sản phẩm 1'),
(4, 'nguyen quan TUNGas1');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `paymentMethod` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `name`, `phone`, `address`, `paymentMethod`, `date`) VALUES
(68, 'ngut tung123', '0937564554', 'cvbnm', 'cod', '2024-08-06 19:06:46'),
(69, 'nguyen quan TUNG', '0965489623', 'Thị xã Sa Đéc', 'cod', '2024-08-06 19:12:31'),
(70, 'nguyen quan TUNG', '0965489623', 'Sbcnvbn,m', 'cod', '2024-08-06 19:16:21'),
(71, 'nguyen quan TUNG', '0965489623', 'Thị xã Sa Đéc', 'cod', '2024-08-06 19:21:43'),
(72, 'nguyen quan TUNG', '0965489623', 'Thị xã Sa Đéc', 'cod', '2024-08-06 19:27:35'),
(73, 'nguyen quan TUNG', '0965489623', 'Thị xã Sa Đéc', 'cod', '2024-08-06 19:28:53'),
(74, 'nguyen quan TUNG', '0965489623', 'Thị xã Sa Đéc', 'cod', '2024-08-06 19:47:02'),
(75, 'nguyen quan TUNG', '0965489623', 'sdsad', 'cod', '2024-08-06 19:48:08'),
(76, 'nguyen quan TUNGas', '0965489623', 'ct', 'cod', '2024-08-06 19:48:30'),
(78, 'nguyen quan TUNGas', '0965489623', 'sd', 'cod', '2024-08-06 19:52:22'),
(79, 'nguyen quan TUNGas', 'sd', 'Thị xã Sa Đéc', 'cod', '2024-08-06 20:31:55'),
(80, 'nguyen quan TUNGas', 'sd', 'sdff', 'cod', '2024-08-07 00:33:20'),
(81, 'nguyen quan TUNGas', 'sd', 'đfff', 'cod', '2024-08-07 01:07:56'),
(82, 'nguyen quan TUNG', '0965489623', 'ct', 'cod', '2024-08-07 20:30:12'),
(87, 'tung2', '0937843705', 'Thị xã Sa Đéc', 'cod', '2024-08-10 00:19:24');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `order_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `statuss` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Chờ xác nhận',
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `product_id`, `user_id`, `order_id`, `quantity`, `price`, `statuss`, `total`) VALUES
(3, 16, NULL, 68, 8, 13123, 'Chờ xác nhận', NULL),
(4, 13, NULL, 69, 3, 123123, 'Chờ xác nhận', NULL),
(5, 18, NULL, 70, 4, 13123, 'Chờ xác nhận', NULL),
(6, 12, NULL, 71, 4, 123123, 'Chờ xác nhận', 492492.00),
(7, 12, NULL, 72, 4, 123123, 'Chờ xác nhận', 492492.00),
(8, 8, NULL, 73, 5, 123123, 'Chờ xác nhận', 615615.00),
(9, 8, NULL, 74, 12, 123123, 'Chờ xác nhận', 1477476.00),
(10, 12, NULL, 75, 3, 123123, 'Chờ xác nhận', 369369.00),
(11, 8, NULL, 76, 4, 123123, 'Chờ xác nhận', 492492.00),
(12, 17, NULL, 78, 4, 13123, 'Chờ xác nhận', 52492.00),
(13, 17, NULL, 79, 1, 13123, 'Chờ xác nhận', 13123.00),
(14, 17, NULL, 80, 2, 13123, 'Chờ xác nhận', 26246.00),
(15, 16, NULL, 81, 3, 13123, 'Chờ xác nhận', 39369.00),
(16, 17, NULL, 82, 7, 13123, 'Chờ xác nhận', 91861.00),
(17, 16, NULL, 82, 4, 13123, 'Chờ xác nhận', 52492.00),
(23, 12, NULL, 87, 3, 123123, 'Chờ xác nhận', 369369.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` int DEFAULT NULL,
  `sell_price` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `price`, `sell_price`, `description`, `status`, `created_at`, `category_id`) VALUES
(6, 'Đồng hồ nam', 'uploads/products/1723014049909.jpg', 123123, 123, 'sadfv', 'khuyến mãi', '2024-08-06 11:44:26', 1),
(7, 'Đồng hồ nam 2', 'uploads/products/1723215127008.jpg', 123123, 123, 'sadfv', 'khuyến mãi', '2024-08-06 11:44:26', 1),
(8, 'Đồng hồ nam 3', 'uploads/products/1723013875896.jpg', 123123, 123, 'sadfv', 'khuyến mãi', '2024-08-06 11:44:26', 1),
(9, 'Đồng hồ nam 4', 'sdxvc', 123123, 123, 'sadfv', 'khuyến mãi', '2024-08-06 11:44:26', 1),
(10, 'sdfv', 'sdxvc', 123123, 123, 'sadfv', 'bán chạy', '2024-08-06 11:44:26', 1),
(11, 'sdfv', 'sdxvc', 123123, 123, 'sadfv', 'bán chạy', '2024-08-06 11:44:26', 1),
(12, 'sdfv', 'uploads/products/1723013899387.jpg', 123123, 123, 'sadfv', 'bán chạy', '2024-08-06 11:44:26', 1),
(13, 'sdfv', 'sdxvc', 123123, 123, 'sadfv', 'bán chạy', '2024-08-06 11:44:26', 1),
(14, 'sadv', 'dxcv', 13123, 123, 'zXcvbnm', 'bán chạy', '2024-08-06 11:44:26', 1),
(15, 'sadv', 'dxcv', 13123, 123, 'zXcvbnm', 'nổi bật', '2024-08-06 11:44:26', 1),
(16, 'sadv', 'dxcv', 13123, 123, 'zXcvbnm', 'nổi bật', '2024-08-06 11:44:26', 1),
(17, 'sadv', 'dxcv', 13123, 123, 'zXcvbnm', 'nổi bật', '2024-08-06 11:44:26', 1),
(18, 'sadv', 'dxcv', 13123, 123, 'zXcvbnm', 'nổi bật', '2024-08-06 11:44:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'User'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `image`, `phone`, `password`, `email`, `username`, `role`) VALUES
(3, 'tung', 'sadasd', '0937843705', '123456', 'fsdfcvxnb@gmail.com', 'tung123', 'User'),
(9, NULL, NULL, NULL, '$2b$10$PquRcjRPB6K5heUSF6H9SugnxiYS1By19irHx352a45pBcTxPDpLS', 'tungas@gmail.com', 'tung', 'admin'),
(10, NULL, NULL, NULL, '$2b$10$cArYVZl3WQhyxo/IM.FYB.3Ea.wZQQX323jHlVKWYuEln/I9wyq.y', 'admin@gmail.com', 'tung2', 'User');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`,`user_id`,`order_id`) USING BTREE;

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `order_detail_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
