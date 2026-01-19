-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.0.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para products
CREATE DATABASE IF NOT EXISTS `hotelsrec` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `hotelsrec`;

-- Volcando estructura para tabla hotelsrec.users
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `surname` varchar(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Volcando datos para la tabla hotelsrec.users: ~20 rows (aproximadamente)
INSERT INTO `users` (`email`, `password`, `name`, `surname`, `id`) VALUES
	('prueba00@gmail.com', 'prueba00', 'Laura', 'Webber', 1),
	('prueba01@gmail.com', 'prueba01', 'Antonio', 'Suárez', 2),
	('prueba02@gmail.com', 'prueba02', 'Martín', 'Fernández', 3),
	('prueba03@gmail.com', 'prueba03', 'José', 'Rodríguez', 4),
	('prueba04@gmail.com', 'prueba04', 'Natalia', 'Fernández', 5),
	('prueba05@gmail.com', 'prueba05', 'Tania', 'Bajo', 6),
	('prueba06@gmail.com', 'prueba06', 'David', 'Fernández', 7),
	('prueba07@gmail.com', 'prueba07', 'Álvaro', 'Aguilar', 8),
	('prueba08@gmail.com', 'prueba08', 'Xin', 'Pan', 9),
	('prueba09@gmail.com', 'prueba09', 'Eduardo', 'Valdés', 10),
	('prueba10@gmail.com', 'prueba10', 'Jorge', 'López', 11),
	('prueba11@gmail.com', 'prueba11', 'Javier', 'López', 12),
	('prueba12@gmail.com', 'prueba12', 'Luis', 'López', 13),
	('prueba13@gmail.com', 'prueba13', 'Carmen', 'Peláez', 14),
	('prueba14@gmail.com', 'prueba14', 'Carmen', 'Martos', 15),
	('prueba15@gmail.com', 'prueba15', 'Celia', 'Barral', 16),
	('prueba16@gmail.com', 'prueba16', 'Jorge', 'Toraño', 17),
	('prueba17@gmail.com', 'prueba17', 'Pablo', 'Toraño', 18),
	('prueba18@gmail.com', 'prueba18', 'Raúl', 'Arca', 19),
	('prueba19@gmail.com', 'prueba19', 'David', 'Maldonado', 20),
	('prueba20@gmail.com', 'prueba20', 'Alex', 'Galán', 21);



-- Volcando estructura para tabla hotelsrec.hotels
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `address` varchar(80) DEFAULT NULL,
  `phoneNumber` varchar(9) DEFAULT NULL,
  `capacity` varchar(25) DEFAULT NULL,
  `diningRoomCapacity` varchar(25) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `community` varchar(30) DEFAULT NULL,
  `stars` bigint(20) DEFAULT NULL,
  `averagePrice` float DEFAULT NULL,
  `longitude` FLOAT DEFAULT NULL,
  `latitude` FLOAT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
-- insertar hoteles con script

-- Volcando estructura para tabla hotelsrec.usersRatings
CREATE TABLE IF NOT EXISTS `usersRatings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rating` bigint(20) DEFAULT NULL,
  `userEmail` varchar(50) DEFAULT NULL,
  `hotelName` varchar(50) DEFAULT NULL,
  `comment` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `user_hotel` (`userEmail`, `hotelName`),
  CONSTRAINT `user` FOREIGN KEY (`userEmail`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `hotel` FOREIGN KEY (`hotelName`) REFERENCES `hotels` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
-- insertar valoraciones con script

CREATE TABLE IF NOT EXISTS `preferences` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(50) NOT NULL,
  `hotelName` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),

  -- Evita que el mismo hotel se recomiende dos veces al mismo usuario
  UNIQUE KEY `user_hotel_recommendation` (`userEmail`, `hotelName`),

  -- Claves foráneas
  CONSTRAINT `fk_preferences_user`
    FOREIGN KEY (`userEmail`)
    REFERENCES `users` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT `fk_preferences_hotel`
    FOREIGN KEY (`hotelName`)
    REFERENCES `hotels` (`name`)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
