-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gradina_app_db
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `evolution`
--

DROP TABLE IF EXISTS `evolution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evolution` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plant_id` int NOT NULL,
  `user_id` int NOT NULL,
  `date` date NOT NULL,
  `observation` text,
  `garden_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_garden_id` (`garden_id`),
  KEY `fk_plant_id` (`plant_id`),
  CONSTRAINT `evolution_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plantoteca` (`id`),
  CONSTRAINT `evolution_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_garden_id` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`),
  CONSTRAINT `fk_plant_id` FOREIGN KEY (`plant_id`) REFERENCES `plantoteca` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evolution`
--

LOCK TABLES `evolution` WRITE;
/*!40000 ALTER TABLE `evolution` DISABLE KEYS */;
INSERT INTO `evolution` VALUES (1,9,1,'2024-06-18','Am fertilizat plantele cu tinctură de Tătăneasca, dă rezultate bune, plantele sunt puternice și au un verde intens',9),(2,10,1,'2024-06-18','Acest soi de cartofi a avut o producție bună si au fost foarte rezistenti la secetă',12),(3,5,1,'2024-06-18','In acest anu nu au fost foarte dulci cireșele, a fost un an ploios',5),(4,11,1,'2024-06-18','Anul acesta castravbetii au fost amari din cauza secetei',20),(5,16,1,'2024-06-21','Primul an in care am cultivat brocoli, este foarte sănătoasă și ușor de întreținut',14),(7,9,1,'2024-06-21','Astăzi am mancat primele roșii din grădină, în anul acesta. Este un soi bun, cu roșii mari și cărnoase',9);
/*!40000 ALTER TABLE `evolution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garden`
--

DROP TABLE IF EXISTS `garden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garden` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plant_id` int NOT NULL,
  `date_planted` date NOT NULL,
  `status` varchar(10) DEFAULT 'active',
  `date_harvest` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plant_id` (`plant_id`),
  CONSTRAINT `garden_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `garden_ibfk_2` FOREIGN KEY (`plant_id`) REFERENCES `plantoteca` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garden`
--

LOCK TABLES `garden` WRITE;
/*!40000 ALTER TABLE `garden` DISABLE KEYS */;
INSERT INTO `garden` VALUES (1,1,1,'2022-11-13','active',NULL),(2,1,2,'2022-11-13','active',NULL),(3,1,3,'2022-11-13','active',NULL),(4,1,4,'2022-11-13','active',NULL),(5,1,5,'2022-11-21','harvested','2024-06-18'),(6,1,1,'2022-11-21','active',NULL),(7,1,7,'2024-02-19','active',NULL),(8,1,6,'2024-02-19','active',NULL),(9,1,9,'2024-03-10','active',NULL),(10,1,10,'2024-03-10','active',NULL),(11,1,11,'2024-03-10','active',NULL),(12,1,10,'2024-03-31','harvested','2024-06-18'),(13,1,11,'2024-03-31','harvested','2024-06-18'),(14,1,16,'2024-06-18','harvested','2024-06-21'),(15,1,15,'2024-06-18','active',NULL),(16,1,16,'2024-06-18','harvested','2024-06-18'),(17,1,18,'2024-06-18','active',NULL),(18,1,4,'2024-06-18','active',NULL),(19,1,8,'2024-06-18','active',NULL),(20,1,11,'2024-06-18','harvested','2024-06-18'),(21,1,16,'2024-06-18','harvested','2024-06-18'),(22,1,15,'2024-02-10','harvested','2024-04-18'),(23,1,18,'2024-06-20','harvested','2024-06-21'),(24,2,1,'2024-06-20','harvested','2024-06-21'),(25,2,2,'2024-06-20','active',NULL);
/*!40000 ALTER TABLE `garden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` text,
  `date_sent` datetime DEFAULT NULL,
  `notification_type` enum('extreme','period') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Suntem in perioada cea mai rece din an, ai grija ca plantele tale sa fie bine protejate de inghet','2024-01-19 01:53:40','extreme'),(2,1,'Suntem in perioada cea mai rece din an, ai grija ca plantele tale sa fie bine protejate de inghet','2024-04-19 01:54:10','extreme'),(3,1,'Suntem in perioada cea mai rece din an, ai grija ca plantele tale sa fie bine protejate de inghet','2024-04-19 01:54:11','extreme'),(4,1,'Este momentul sa plantezi Roșii','2024-04-19 01:55:06','period'),(5,1,'Este momentul sa plantezi Cartofi','2024-04-19 01:55:06','period'),(6,1,'Este momentul sa plantezi Castraveți','2024-04-19 01:55:06','period'),(7,1,'Este momentul sa plantezi Ardei','2024-04-19 01:55:06','period'),(8,1,'Este momentul sa plantezi Roșii','2024-04-19 01:55:13','period'),(9,1,'Este momentul sa plantezi Cartofi','2024-04-19 01:55:13','period'),(10,1,'Este momentul sa plantezi Castraveți','2024-04-19 01:55:13','period'),(11,1,'Este momentul sa plantezi Ardei','2024-04-19 01:55:13','period'),(12,1,'Este momentul sa plantezi Roșii','2024-04-19 01:55:17','period'),(13,1,'Este momentul sa plantezi Cartofi','2024-04-19 01:55:17','period'),(14,1,'Este momentul sa plantezi Castraveți','2024-04-19 01:55:17','period'),(15,1,'Este momentul sa plantezi Ardei','2024-04-19 01:55:17','period'),(16,1,'Este momentul sa plantezi Roșii','2024-04-19 01:55:30','period'),(17,1,'Este momentul sa plantezi Cartofi','2024-04-19 01:55:30','period'),(18,1,'Este momentul sa plantezi Castraveți','2024-04-19 01:55:30','period'),(19,1,'Este momentul sa plantezi Ardei','2024-04-19 01:55:30','period'),(20,1,'Este momentul sa plantezi Roșii','2024-04-19 01:55:36','period'),(21,1,'Este momentul sa plantezi Cartofi','2024-04-19 01:55:36','period'),(22,1,'Este momentul sa plantezi Castraveți','2024-04-19 01:55:36','period'),(23,1,'Este momentul sa plantezi Ardei','2024-04-19 01:55:36','period'),(24,1,'Este momentul să recoltăm Cais','2024-06-19 19:25:06','period'),(25,1,'Este momentul să recoltăm Cais','2024-06-20 22:42:53','period'),(26,1,'Este momentul să recoltăm Cais','2024-06-21 03:12:11','period');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plantoteca`
--

DROP TABLE IF EXISTS `plantoteca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantoteca` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `plant_period` varchar(50) DEFAULT NULL,
  `prune_period` varchar(50) DEFAULT NULL,
  `fertilize_period` varchar(50) DEFAULT NULL,
  `harvest_period` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantoteca`
--

LOCK TABLES `plantoteca` WRITE;
/*!40000 ALTER TABLE `plantoteca` DISABLE KEYS */;
INSERT INTO `plantoteca` VALUES (1,'Măr','Perena','Pom fructifer','11','2','3,4','9'),(2,'Nuc','Perena','Pom fructifer','11','2',NULL,'9'),(3,'Cais','Perena','Pom fructifer','11','2','4','6'),(4,'Prun','Perena','Pom fructifer','11','2','4','8'),(5,'Cireș','Perena','Pom fructifer','11','2','4','6'),(6,'Viță de vie - Alb','Perena','Cațărătoare','2,11','5,11','4,5','9'),(7,'Kiwi','Perena','Cațărătoare','2,11','4,5','4,5','7,8'),(8,'Afin','Perena','Arbuști fructifer','11','1,2,12','3,4','7,8,9'),(9,'Roșii','Anuală','Legume','3,4',NULL,'4,5','8,9'),(10,'Cartofi','Anuală','Legume','3,4',NULL,'4,5','8,9'),(11,'Castraveți','Anuală','Legume','3,4',NULL,'4,5','6,7,8'),(12,'Morcovi','Anuală','Legume','3',NULL,NULL,'8'),(15,'Zmeură','Perenă','Arbuști fructiferi','10,11','2,11','4','5,6'),(16,'Brocoli','Anuală','Legume','2',NULL,'4','7'),(18,'Usturoi','Anuală','Legume','11',NULL,'3','6,7'),(20,'Ardei','Anuală','Legume','4',NULL,'5,6','8');
/*!40000 ALTER TABLE `plantoteca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Cristi','root'),(2,'User3','root');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-21 21:45:32
