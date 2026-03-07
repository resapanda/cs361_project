/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.29-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs361_baninh
-- ------------------------------------------------------
-- Server version	10.11.15-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DailyCheckins`
--

DROP TABLE IF EXISTS `DailyCheckins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DailyCheckins` (
  `daily_checkin_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `food_morning` tinyint(1) DEFAULT 0,
  `food_treat` tinyint(1) DEFAULT 0,
  `food_night` tinyint(1) DEFAULT 0,
  `toilet_pee` tinyint(1) DEFAULT 0,
  `toilet_poop` tinyint(1) DEFAULT 0,
  `mood` varchar(10) NOT NULL CHECK (`mood` in ('Bad','Neutral','Good')),
  `symptoms` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`daily_checkin_id`),
  KEY `fk_Profiles_DailyCheckins` (`profile_id`),
  CONSTRAINT `fk_Profiles_DailyCheckins` FOREIGN KEY (`profile_id`) REFERENCES `Profiles` (`profile_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DailyCheckins`
--

LOCK TABLES `DailyCheckins` WRITE;
/*!40000 ALTER TABLE `DailyCheckins` DISABLE KEYS */;
INSERT INTO `DailyCheckins` VALUES (9,4,'2026-02-06',0,1,0,1,0,'Good','',''),(21,18,'2026-02-09',0,1,0,1,1,'Bad','asthma',''),(22,19,'2026-02-09',0,1,0,0,1,'Good','n/a','Quick check-in from Home'),(23,18,'2026-02-09',0,1,0,0,1,'Bad','','');
/*!40000 ALTER TABLE `DailyCheckins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Profiles`
--

DROP TABLE IF EXISTS `Profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL CHECK (`gender` in ('boy','girl')),
  `age` int(11) DEFAULT NULL CHECK (`age` >= 0),
  `breed` varchar(100) DEFAULT 'Mixed Breed',
  `weight` decimal(5,2) DEFAULT NULL CHECK (`weight` > 0),
  `photo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  KEY `fk_Users_Profiles` (`user_id`),
  CONSTRAINT `fk_Users_Profiles` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Profiles`
--

LOCK TABLES `Profiles` WRITE;
/*!40000 ALTER TABLE `Profiles` DISABLE KEYS */;
INSERT INTO `Profiles` VALUES (4,2,'lucky','girl',1,'Beagle',20.00,''),(18,15,'lucky','boy',4,'Beagle',40.00,''),(19,16,'lucky','boy',4,'Golden Retriever',41.00,''),(20,15,'mugi','boy',1,'Persian',15.00,'');
/*!40000 ALTER TABLE `Profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (2,'haru.banin@gmail.com','$2b$10$84X12.Zm.U8rgHH81E2FzORrREs6KS0UBej1hfv5/82zExaMTj85K'),(14,'haru.banin1@gmail.com','$2b$10$IS4Eg5sfL5bOu7otcZ8tC.SAE4EA7FrzzKRnX/5hJzE2I2FWPkQDi'),(15,'haru.banin2@gmail.com','$2b$10$fipbAWWxHgyKxArsnZybSe3C/0rfTPOkwm4A5zNTJXD7XtVLge1qe'),(16,'haru.banin5@gmail.com','$2b$10$U/v1NGvy5bsXCGcypLblAu3oMTqBHmxmm5VcrafeLSHA8omktYQ3i');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VetRecords`
--

DROP TABLE IF EXISTS `VetRecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `VetRecords` (
  `vet_record_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `clinic` varchar(100) DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`vet_record_id`),
  KEY `fk_Profiles_VetRecords` (`profile_id`),
  CONSTRAINT `fk_Profiles_VetRecords` FOREIGN KEY (`profile_id`) REFERENCES `Profiles` (`profile_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VetRecords`
--

LOCK TABLES `VetRecords` WRITE;
/*!40000 ALTER TABLE `VetRecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `VetRecords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-06 15:52:53
