-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2018 at 06:09 PM
-- Server version: 5.7.11
-- PHP Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `votter`
--
CREATE DATABASE IF NOT EXISTS `votter` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `votter`;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_data`
--

DROP TABLE IF EXISTS `tbl_data`;
CREATE TABLE `tbl_data` (
  `candidate_id` varchar(25) NOT NULL,
  `candidate_name` varchar(300) DEFAULT NULL,
  `candidate_desc` varchar(3000) DEFAULT NULL,
  `candidate_thumb` varchar(300) DEFAULT NULL,
  `candidate_type` enum('JUNIOR','SENIOR') NOT NULL DEFAULT 'JUNIOR',
  `candidate_post` enum('HB','HG','GS','GC') NOT NULL,
  `votes` int(10) NOT NULL DEFAULT '0',
  `timestamp` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
CREATE TABLE `tbl_users` (
  `userId` varchar(30) NOT NULL,
  `userEmail` varchar(200) NOT NULL,
  `userPass` varchar(100) NOT NULL,
  `sessionKey` varchar(100) NOT NULL DEFAULT 'empty',
  `userFullName` varchar(50) NOT NULL,
  `accessLevel` enum('PLVL01','PLVL02','PLVL03','PLVL04','PLVL05') NOT NULL,
  `userType` varchar(15) NOT NULL,
  `loggedIn` enum('Y','N') NOT NULL DEFAULT 'N',
  `deviceType` enum('DEV_WEB_STD','DEV_ANDROID_APP','DEV_DATA_FETCH','DEV_DEFAULT') NOT NULL,
  `state` enum('READY','RESET_REQUESTED','DISABLED','LOCKED') NOT NULL DEFAULT 'READY',
  `editCode` varchar(100) DEFAULT NULL,
  `extra` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`userId`, `userEmail`, `userPass`, `sessionKey`, `userFullName`, `accessLevel`, `userType`, `loggedIn`, `deviceType`, `state`, `editCode`, `extra`) VALUES
('client', 'client', '81dc9bdb52d04dc20036dbd8313ed055', 'E8D28', 'Client', 'PLVL01', 'admin', 'Y', 'DEV_WEB_STD', 'LOCKED', NULL, '{"voteClass":"STD06"}'),
('root', 'admin', '81dc9bdb52d04dc20036dbd8313ed055', '86C72', 'Administrator', 'PLVL03', 'admin', 'Y', 'DEV_WEB_STD', 'READY', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_vote`
--

DROP TABLE IF EXISTS `tbl_vote`;
CREATE TABLE `tbl_vote` (
  `vote_id` int(11) NOT NULL,
  `candidate_id` text NOT NULL,
  `class` text NOT NULL,
  `votes` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_data`
--
ALTER TABLE `tbl_data`
  ADD PRIMARY KEY (`candidate_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userEmail` (`userEmail`),
  ADD UNIQUE KEY `userId` (`userId`),
  ADD KEY `userEmail_2` (`userEmail`);

--
-- Indexes for table `tbl_vote`
--
ALTER TABLE `tbl_vote`
  ADD PRIMARY KEY (`vote_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_vote`
--
ALTER TABLE `tbl_vote`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=361;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
