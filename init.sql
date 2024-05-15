-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 15, 2024 at 01:35 PM
-- Server version: 8.4.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yourdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a` (
  `s_key` varchar(255) NOT NULL,
  `s_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a_announcement`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a_announcement` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_expired` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `informant_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a_bill`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a_bill` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `cost` double DEFAULT NULL,
  `is_paid` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `room_id` int DEFAULT NULL,
  `customer_id` varchar(36) DEFAULT NULL,
  `informant_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a_mail`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a_mail` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_received` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `informant_id` varchar(36) DEFAULT NULL,
  `room_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a_maintenance`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a_maintenance` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_fixed` enum('yes','no') DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `informant_id` varchar(36) DEFAULT NULL,
  `room_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `25a84a36f8de455fb2e01f4446edb71a_room`
--

CREATE TABLE `25a84a36f8de455fb2e01f4446edb71a_room` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `is_active` enum('yes','no') DEFAULT 'yes',
  `tenant_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `25a84a36f8de455fb2e01f4446edb71a_room`
--

INSERT INTO `25a84a36f8de455fb2e01f4446edb71a_room` (`id`, `name`, `description`, `is_active`, `tenant_id`) VALUES
(3, 'A01', 'This is a test room', 'yes', NULL),
(4, 'A02', 'This is a test room', 'yes', NULL),
(5, 'A03', 'This is a test room', 'yes', NULL),
(6, 'A04', 'Test', 'yes', NULL),
(7, 'A05', 'Test', 'no', NULL),
(8, 'A06', 'Des', 'yes', NULL),
(9, 'A07', 'Room', 'yes', NULL),
(10, 'A08', 'AA', 'yes', NULL),
(11, 'A09', '4', 'yes', NULL),
(12, 'A10', 'Normal', 'no', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `_Organization`
--

CREATE TABLE `_Organization` (
  `org_code` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state_province` varchar(255) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `_Organization`
--

INSERT INTO `_Organization` (`org_code`, `name`, `street_address`, `city`, `state_province`, `postal_code`, `country`, `email`, `phone`, `description`, `created_at`) VALUES
('25a84a36f8de455fb2e01f4446edb71a', 'Test Organization', '123 Test Street', 'Test City', 'Test State', '12345', 'Test Country', 'test@example.com', '123-456-7890', 'This is a test organization', '2024-05-13 17:39:35');

-- --------------------------------------------------------

--
-- Table structure for table `_User`
--

CREATE TABLE `_User` (
  `id` varchar(36) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','owner','user') DEFAULT 'user',
  `org_code` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `_User`
--

INSERT INTO `_User` (`id`, `firstname`, `lastname`, `username`, `password`, `role`, `org_code`, `created_at`, `email`) VALUES
('4fcc71e5-3b28-4a08-8322-c82fcd9267a1', 'user', 'user', 'user', '$2a$10$vTjb4I7RZZhcu0RLdNGpP.4FcyrfmIeAmSiDLh4ZudgFEX/mTd.22', 'user', '25a84a36f8de455fb2e01f4446edb71a', '2024-05-15 12:44:23', 'user@email.com'),
('b2b457f8-cae6-452b-954d-61a5c8ce9851', 'admin', 'admin', 'admin', '$2a$10$qszIeAuRaLMNLr2b4KnjZuexgH89NpM/3VDfyuhdCOEc7VyjMDo5u', 'owner', '25a84a36f8de455fb2e01f4446edb71a', '2024-05-15 12:44:57', 'admin@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `_User_reset_tokens`
--

CREATE TABLE `_User_reset_tokens` (
  `id` int NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `_User_reset_tokens`
--

INSERT INTO `_User_reset_tokens` (`id`, `user_id`, `token`, `expiry_date`, `created_at`) VALUES
(1, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', '2f0fa7e5-eed6-4c71-b363-9ffd41a3bc07', '2024-05-13 02:03:55', '2024-05-12 18:03:54'),
(2, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', '10c65fca-70f3-4ad2-8b5d-cd2e79d5df5a', '2024-05-13 02:13:43', '2024-05-12 18:13:42'),
(3, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', '2aa8aa49-8ecb-4cd8-b2c5-438dca87cc73', '2024-05-13 02:17:09', '2024-05-12 18:17:08'),
(4, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', '449ece1d-cd1f-46fa-bfbf-0b12e5a9516b', '2024-05-13 02:19:27', '2024-05-12 18:19:27'),
(5, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'ba5a159b-3cc3-48bf-abf4-ccab95ea0a5f', '2024-05-13 02:44:26', '2024-05-12 18:44:25'),
(6, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'f64d443f-10e9-459c-8396-6e7a55091723', '2024-05-13 02:46:14', '2024-05-12 18:46:14'),
(7, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'JwzUIF3ZgxFbVBOI', '2024-05-14 02:47:46', '2024-05-12 19:47:46'),
(8, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'Wo7nyjBt5ntgm25L', '2024-05-14 02:48:53', '2024-05-12 19:48:53'),
(9, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'nPf1zaVQd5BOR7JG', '2024-05-14 02:51:06', '2024-05-12 19:51:06'),
(10, '301b7821-c7e9-4c57-9c76-5b22e9f5d6d4', 'j2agevoGATMUKoAj', '2024-05-14 02:57:48', '2024-05-12 19:57:47'),
(15, 'a4ca5eee-2bb7-4261-80ed-9df4f891507b', 'MYfi3hhM0S2sx0hD', '2024-05-14 03:50:57', '2024-05-12 20:50:57'),
(16, 'a4ca5eee-2bb7-4261-80ed-9df4f891507b', 'k6CWktMAoZIvn6BH', '2024-05-14 03:50:58', '2024-05-12 20:50:58'),
(17, 'a4ca5eee-2bb7-4261-80ed-9df4f891507b', '7Y0Cf3JhW4Jo4DgB', '2024-05-14 03:50:59', '2024-05-12 20:50:58'),
(18, '94160e7b-0f04-4feb-b7a8-a6a174b07a16', 'D5ZdKojTbTATzVLq', '2024-05-14 03:54:23', '2024-05-12 20:54:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `25a84a36f8de455fb2e01f4446edb71a_announcement`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_announcement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `informant_id` (`informant_id`);

--
-- Indexes for table `25a84a36f8de455fb2e01f4446edb71a_bill`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `informant_id` (`informant_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `25a84a36f8de455fb2e01f4446edb71a_mail`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_mail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `informant_id` (`informant_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `25a84a36f8de455fb2e01f4446edb71a_maintenance`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `informant_id` (`informant_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `25a84a36f8de455fb2e01f4446edb71a_room`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `_Organization`
--
ALTER TABLE `_Organization`
  ADD PRIMARY KEY (`org_code`);

--
-- Indexes for table `_User`
--
ALTER TABLE `_User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `org_code` (`org_code`);

--
-- Indexes for table `_User_reset_tokens`
--
ALTER TABLE `_User_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `25a84a36f8de455fb2e01f4446edb71a_announcement`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_announcement`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `25a84a36f8de455fb2e01f4446edb71a_bill`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_bill`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `25a84a36f8de455fb2e01f4446edb71a_mail`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_mail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `25a84a36f8de455fb2e01f4446edb71a_maintenance`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_maintenance`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `25a84a36f8de455fb2e01f4446edb71a_room`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_room`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `_User_reset_tokens`
--
ALTER TABLE `_User_reset_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `25a84a36f8de455fb2e01f4446edb71a_announcement`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_announcement`
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_announcement_ibfk_1` FOREIGN KEY (`informant_id`) REFERENCES `_User` (`id`);

--
-- Constraints for table `25a84a36f8de455fb2e01f4446edb71a_bill`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_bill`
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_bill_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `25a84a36f8de455fb2e01f4446edb71a_room` (`id`),
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_bill_ibfk_2` FOREIGN KEY (`informant_id`) REFERENCES `_User` (`id`),
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_bill_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `_User` (`id`);

--
-- Constraints for table `25a84a36f8de455fb2e01f4446edb71a_mail`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_mail`
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_mail_ibfk_1` FOREIGN KEY (`informant_id`) REFERENCES `_User` (`id`),
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_mail_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `25a84a36f8de455fb2e01f4446edb71a_room` (`id`);

--
-- Constraints for table `25a84a36f8de455fb2e01f4446edb71a_maintenance`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_maintenance`
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_maintenance_ibfk_1` FOREIGN KEY (`informant_id`) REFERENCES `_User` (`id`),
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_maintenance_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `25a84a36f8de455fb2e01f4446edb71a_room` (`id`);

--
-- Constraints for table `25a84a36f8de455fb2e01f4446edb71a_room`
--
ALTER TABLE `25a84a36f8de455fb2e01f4446edb71a_room`
  ADD CONSTRAINT `25a84a36f8de455fb2e01f4446edb71a_room_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `_User` (`id`);

--
-- Constraints for table `_User`
--
ALTER TABLE `_User`
  ADD CONSTRAINT `_User_ibfk_1` FOREIGN KEY (`org_code`) REFERENCES `_Organization` (`org_code`);

--
-- Constraints for table `_User_reset_tokens`
--
ALTER TABLE `_User_reset_tokens`
  ADD CONSTRAINT `_User_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `_User` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
