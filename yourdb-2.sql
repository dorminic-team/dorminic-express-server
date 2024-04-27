-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 27, 2024 at 08:27 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.17

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
-- Table structure for table `organization_9ab670b2`
--

CREATE TABLE `organization_9ab670b2` (
  `room_number` varchar(10) NOT NULL,
  `isPaidByTenant` tinyint(1) DEFAULT '1',
  `tenant_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `organization_9ab670b2`
--

INSERT INTO `organization_9ab670b2` (`room_number`, `isPaidByTenant`, `tenant_id`) VALUES
('101', 1, '4ed0e05c-f07b-4bd2-83d5-9345c5cc4832'),
('102', 0, NULL),
('103', 0, '4ed0e05c-f07b-4bd2-83d5-9345c5cc4832'),
('104', 0, NULL),
('105', 0, '4ed0e05c-f07b-4bd2-83d5-9345c5cc4832'),
('201', 0, NULL),
('202', 0, '4ed0e05c-f07b-4bd2-83d5-9345c5cc4832'),
('203', 0, NULL),
('204', 0, NULL),
('205', 0, NULL),
('301', 0, NULL),
('302', 0, NULL),
('303', 0, NULL),
('304', 0, NULL),
('305', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organization_beb4d237`
--

CREATE TABLE `organization_beb4d237` (
  `room_number` varchar(10) NOT NULL,
  `isRent` tinyint(1) DEFAULT '0',
  `isPaidByTenant` tinyint(1) DEFAULT '0',
  `tenant_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `_bills`
--

CREATE TABLE `_bills` (
  `bill_id` int NOT NULL,
  `org_code` varchar(8) DEFAULT NULL,
  `water_fee` decimal(10,2) NOT NULL,
  `electric_fee` decimal(10,2) NOT NULL,
  `rental_fee` decimal(10,2) NOT NULL,
  `month` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `isPaid` tinyint(1) DEFAULT '0' COMMENT '0 = Not Paid 1 = Paid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_bills`
--

INSERT INTO `_bills` (`bill_id`, `org_code`, `water_fee`, `electric_fee`, `rental_fee`, `month`, `year`, `isPaid`, `created_at`, `user_id`) VALUES
(1, '9ab670b2', 50.00, 70.00, 1000.00, 4, 2024, 0, '2024-04-24 08:14:33', '01b3572f-85fc-48e8-8a9c-9a671e9b0518');

-- --------------------------------------------------------

--
-- Table structure for table `_organization`
--

CREATE TABLE `_organization` (
  `org_code` varchar(8) NOT NULL,
  `verify_code` varchar(8) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_organization`
--

INSERT INTO `_organization` (`org_code`, `verify_code`, `name`, `description`) VALUES
('9ab670b2', 'dfaab644', 'Test Organization', 'This is a test organization'),
('beb4d237', 'bdb50b08', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `_otherbills`
--

CREATE TABLE `_otherbills` (
  `bill_id` int NOT NULL,
  `org_code` varchar(8) NOT NULL,
  `bill_name` varchar(255) NOT NULL,
  `description` text,
  `amount` decimal(10,2) NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isPaid` tinyint(1) DEFAULT '0' COMMENT '0 = Not Paid\r\n1 = Paid'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_otherbills`
--

INSERT INTO `_otherbills` (`bill_id`, `org_code`, `bill_name`, `description`, `amount`, `month`, `year`, `user_id`, `created_at`, `isPaid`) VALUES
(1, '9ab670b2', 'Maintenance fee', 'Common Area Maintenance fee', 150.75, 4, 2024, '01b3572f-85fc-48e8-8a9c-9a671e9b0518', '2024-04-24 08:25:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `_user`
--

CREATE TABLE `_user` (
  `uuid` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `role` enum('USER','ADMIN','MODERATOR') DEFAULT 'USER',
  `org_code` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `_user`
--

INSERT INTO `_user` (`uuid`, `username`, `password`, `firstname`, `lastname`, `role`, `org_code`) VALUES
('01b3572f-85fc-48e8-8a9c-9a671e9b0518', 'a', '$2a$10$/e2ZIznAmY5LOhjZvRNapujwZIc2FrnpiombzEaMEzA3jjoFgXo0C', 'a', 'a', 'USER', '9ab670b2'),
('085a205e-ca27-42bb-92b3-3b35cde086d3', 'testuser', '$2a$10$xNZjCOF3ILBxL0Y3mFcuvukDcrplPYXmck2zbiAKniwdUxHgWjfQ6', 'John', 'Doe', 'USER', '9ab670b2'),
('4ed0e05c-f07b-4bd2-83d5-9345c5cc4832', 'Nattawat', '$2a$10$HT2/UPavv/RHvt..PlVJ/evqzI6CljfIJ.mmHreP.Z.fQGsMsW4jW', 'Nattawat', 'Nattachanasit', 'USER', '9ab670b2'),
('51ec6d05-9715-4d66-9ccc-fa0ba0d876bd', 'kl', '$2a$10$aFM73jcbq12rPFT6qgiYPOdoMkM7cEE/u5NkkygL/WAyZNepx4QUK', 'Khamlaow', 'Jansang', 'ADMIN', '9ab670b2'),
('837924e8-d258-4fb1-8b6a-2d28dff068ec', 'adminuser', '$2a$10$usUAt43CprD6QzBUCuD7u.78P2.i5bNe8VojjZNvBpOqHwjGXxzHK', 'Admin', 'User', 'ADMIN', '9ab670b2'),
('a7b0b1c0-3aea-4b93-9ce7-931ea78c7bac', 'b', '$2a$10$xOlJCp21RI3NIoCWVh4cruHxbfAtDeSdw1ersM/kPDgxbKhN5WWcK', 'b', 'b', 'USER', 'beb4d237'),
('b0a296c2-e4f4-4205-9313-32a77d57126b', '0', '$2a$10$UhvyN2EgYP/yeeyCwMfBceyolxfDbES14CMdco9eiCDZcSi8cI.Pq', '0', '0', 'ADMIN', 'beb4d237'),
('c2c55abb-f587-446b-88b0-76275d00067a', 'testadmin', '$2a$10$qR0DJJcTHtZSwb0jZYSg1OPKtyIM04hENYCKWOXfJI2If34ZegPMO', 'John', 'Doe', 'ADMIN', '9ab670b2'),
('d46ca9ed-2106-40b2-a8f1-ce3e31158672', '9', '$2a$10$/cltWi19/43aT9VCKHzkO.7C2AayPpkJz.k0UireJYN2sD3UFXiWi', 'Nattawat', 'Nattachanasit', 'ADMIN', '9ab670b2'),
('e8d5cad1-af2e-4b52-a666-62d2dfd3b0cb', 'N', '$2a$10$sgb.iRprEEBVHK3z9WAmteEq4GF6.Fi37RO.MBX8XXkuAd3HuYvK.', 'N', 'N', 'ADMIN', '9ab670b2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `organization_9ab670b2`
--
ALTER TABLE `organization_9ab670b2`
  ADD PRIMARY KEY (`room_number`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `organization_beb4d237`
--
ALTER TABLE `organization_beb4d237`
  ADD PRIMARY KEY (`room_number`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `_bills`
--
ALTER TABLE `_bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `org_code` (`org_code`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `_organization`
--
ALTER TABLE `_organization`
  ADD PRIMARY KEY (`org_code`);

--
-- Indexes for table `_otherbills`
--
ALTER TABLE `_otherbills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `org_code` (`org_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `_user`
--
ALTER TABLE `_user`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `uuid_2` (`uuid`),
  ADD KEY `fk_org_code` (`org_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `_bills`
--
ALTER TABLE `_bills`
  MODIFY `bill_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `_otherbills`
--
ALTER TABLE `_otherbills`
  MODIFY `bill_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `organization_9ab670b2`
--
ALTER TABLE `organization_9ab670b2`
  ADD CONSTRAINT `organization_9ab670b2_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `_user` (`uuid`) ON DELETE SET NULL;

--
-- Constraints for table `organization_beb4d237`
--
ALTER TABLE `organization_beb4d237`
  ADD CONSTRAINT `organization_beb4d237_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `_user` (`uuid`) ON DELETE SET NULL;

--
-- Constraints for table `_bills`
--
ALTER TABLE `_bills`
  ADD CONSTRAINT `_bills_ibfk_1` FOREIGN KEY (`org_code`) REFERENCES `_organization` (`org_code`),
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `_user` (`uuid`) ON DELETE CASCADE;

--
-- Constraints for table `_otherbills`
--
ALTER TABLE `_otherbills`
  ADD CONSTRAINT `_otherbills_ibfk_1` FOREIGN KEY (`org_code`) REFERENCES `_organization` (`org_code`),
  ADD CONSTRAINT `_otherbills_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `_user` (`uuid`);

--
-- Constraints for table `_user`
--
ALTER TABLE `_user`
  ADD CONSTRAINT `fk_org_code` FOREIGN KEY (`org_code`) REFERENCES `_organization` (`org_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
