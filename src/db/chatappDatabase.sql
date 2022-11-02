-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-11-2022 a las 15:25:30
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `chatapp`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `createRoom` (IN `roomId` VARCHAR(40), IN `fromU` VARCHAR(40), IN `toU` VARCHAR(40))  BEGIN  
    INSERT INTO rooms (id) VALUES (roomId);
    INSERT INTO userroom (roomId, userId, otherUserId) VALUES (roomId, fromU, toU);
    INSERT INTO userroom (roomId, userId, otherUserId) VALUES (roomId, toU, fromU); 
    
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `chatWithSms` (`roomId` VARCHAR(40)) RETURNS LONGTEXT CHARSET utf8mb4 BEGIN

   DECLARE income longText;

   SET income = "ok";
   
   RETURN income;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_chat`
--

CREATE TABLE `group_chat` (
  `id` varchar(40) NOT NULL,
  `name` varchar(60) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_message`
--

CREATE TABLE `group_message` (
  `id` varchar(40) NOT NULL,
  `from_u_id` varchar(40) NOT NULL,
  `to_u_id` varchar(40) NOT NULL,
  `message` longtext DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `message`
--

CREATE TABLE `message` (
  `id` varchar(40) NOT NULL,
  `from_u_id` varchar(40) NOT NULL,
  `to_u_id` varchar(40) NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `room_id` varchar(40) NOT NULL,
  `smsHash` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificationstack`
--

CREATE TABLE `notificationstack` (
  `id` varchar(45) NOT NULL,
  `type` int(11) NOT NULL,
  `fromU` varchar(45) NOT NULL,
  `toU` varchar(45) NOT NULL,
  `accepted` tinyint(1) DEFAULT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notificationstack`
--

INSERT INTO `notificationstack` (`id`, `type`, `fromU`, `toU`, `accepted`, `dateCreated`) VALUES
('4677d834-c0ed-4bff-a212-378c2ae4bfd3', 1, 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2022-11-01 13:53:24'),
('51c6d750-4140-4e0b-8699-7d20da960f6e', 1, 'af03a2cb-4816-4ace-9a8b-e0494ce979a4', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2022-11-01 14:33:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificationtype`
--

CREATE TABLE `notificationtype` (
  `id` int(11) NOT NULL,
  `type` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notificationtype`
--

INSERT INTO `notificationtype` (`id`, `type`) VALUES
(1, 'contact');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `register_user`
--

CREATE TABLE `register_user` (
  `id` varchar(40) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `email` varchar(60) NOT NULL,
  `pw` text NOT NULL,
  `socket_id` text DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `register_user`
--

INSERT INTO `register_user` (`id`, `name`, `email`, `pw`, `socket_id`, `date_created`) VALUES
('06fead3a-3d6d-4840-895c-907a4248c6f8', 'test User #3', 'testuser3@gmail.com', '$2a$08$wO/qQAe8Wunz084IoCrHHOXlxzM1WPQBbYEJenvhEoABPHqEoKnlq', 'qM9FwCGVc4hO9zHmAAAH', '2022-09-30 23:58:15'),
('30cc6d89-e41b-46df-afaa-581eb1f5baa8', 'test User #4', 'test4@gmail.com', '$2a$08$.CzmPTX6dJUa81DM7CWL..kvHOXgf6pv37WAlcyWLiQNyknTBC6cm', NULL, '2022-09-29 21:57:30'),
('7608919b-1871-443e-b161-476751f0b81a', 'Karla', 'karla@gmail.com', '$2a$08$BdtoxtsVibtbsv8UGWE1C.wmHNdATrB.N/h2RB.FcXcILLTbtnLuW', '5V8HHel-gzTWgal8AAAF', '2022-10-31 01:20:54'),
('786f7325-1861-4c70-8808-6b96d7a954bf', 'Carlos', 'carlos@gmail.com', '$2a$08$DPdRXOgmUDVqBaxlEK0cvetB1DYZ.J751Nd8.lLZ6esJQiUli.Ta.', 'cMGSIxWubckk89leAAAB', '2022-11-02 09:51:42'),
('81cb6612-c051-45ad-ac14-afb7c342a0b2', 'test User #1', 'testuser@gmail.com', '$2a$08$ja7FQmi5vrmnfWny9km.JedsxbyFbFqYl3rwV2NpKL5epj2FdI/pm', NULL, '2022-09-29 21:57:45'),
('ac6a6e1a-589f-4185-ad6b-d450fcac9b21', 'test User #2', 'testuser2@gmail.com', '$2a$08$OmO7XhcvRhCLNGzK1wX71.zviW7tiWiUGumsNjqFECrZNSn3zHq36', NULL, '2022-09-29 21:57:54'),
('af03a2cb-4816-4ace-9a8b-e0494ce979a4', 'luis', 'luis@gmail.com', '$2a$08$gvW/s17aY0vWhWlRI73nv.krOS1IMFL582WV9.0CRsPUfv2QR06Ky', 'kj0HSiQviYAoeFXqAAAF', '2022-10-28 14:00:35'),
('be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', 'emilio', 'emilio@gmail.com', '$2a$08$gH0vO7LQga/Bn2hlmg7yau9yK3AFjplVdgSpZ7usNrjXMMQml7Yii', '7pevGx7bGWSGF5UUAAAj', '2022-11-01 14:32:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rooms`
--

CREATE TABLE `rooms` (
  `id` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rooms`
--

INSERT INTO `rooms` (`id`) VALUES
('1aeb60b4-ce81-46a6-b191-4a214fff7835'),
('6a4f940e-0537-4d9e-804f-79b87bdde6f3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stack_group`
--

CREATE TABLE `stack_group` (
  `user_id` varchar(40) NOT NULL,
  `group_id` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `userroom`
--

CREATE TABLE `userroom` (
  `roomId` varchar(40) NOT NULL,
  `userId` varchar(40) NOT NULL,
  `otherUserId` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `userroom`
--

INSERT INTO `userroom` (`roomId`, `userId`, `otherUserId`) VALUES
('1aeb60b4-ce81-46a6-b191-4a214fff7835', 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('1aeb60b4-ce81-46a6-b191-4a214fff7835', '786f7325-1861-4c70-8808-6b96d7a954bf', 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c'),
('6a4f940e-0537-4d9e-804f-79b87bdde6f3', 'af03a2cb-4816-4ace-9a8b-e0494ce979a4', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('6a4f940e-0537-4d9e-804f-79b87bdde6f3', '786f7325-1861-4c70-8808-6b96d7a954bf', 'af03a2cb-4816-4ace-9a8b-e0494ce979a4');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `group_chat`
--
ALTER TABLE `group_chat`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `group_message`
--
ALTER TABLE `group_message`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PK_room_id` (`room_id`);

--
-- Indices de la tabla `notificationstack`
--
ALTER TABLE `notificationstack`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_notif_type` (`type`),
  ADD KEY `FK_fromU` (`fromU`),
  ADD KEY `FK_toU` (`toU`);

--
-- Indices de la tabla `notificationtype`
--
ALTER TABLE `notificationtype`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `register_user`
--
ALTER TABLE `register_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `stack_group`
--
ALTER TABLE `stack_group`
  ADD KEY `FK_u_id` (`user_id`),
  ADD KEY `FK_group_id` (`group_id`);

--
-- Indices de la tabla `userroom`
--
ALTER TABLE `userroom`
  ADD KEY `FK_user_roon_id` (`roomId`),
  ADD KEY `FK_user_room_id` (`userId`),
  ADD KEY `otherUserId` (`otherUserId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `notificationtype`
--
ALTER TABLE `notificationtype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `PK_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Filtros para la tabla `notificationstack`
--
ALTER TABLE `notificationstack`
  ADD CONSTRAINT `FK_fromU` FOREIGN KEY (`fromU`) REFERENCES `register_user` (`id`),
  ADD CONSTRAINT `FK_notif_type` FOREIGN KEY (`type`) REFERENCES `notificationtype` (`id`),
  ADD CONSTRAINT `FK_toU` FOREIGN KEY (`toU`) REFERENCES `register_user` (`id`);

--
-- Filtros para la tabla `stack_group`
--
ALTER TABLE `stack_group`
  ADD CONSTRAINT `FK_group_id` FOREIGN KEY (`group_id`) REFERENCES `group_chat` (`id`),
  ADD CONSTRAINT `FK_u_id` FOREIGN KEY (`user_id`) REFERENCES `register_user` (`id`);

--
-- Filtros para la tabla `userroom`
--
ALTER TABLE `userroom`
  ADD CONSTRAINT `FK_user_room_id` FOREIGN KEY (`userId`) REFERENCES `register_user` (`id`),
  ADD CONSTRAINT `FK_user_roon_id` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `userroom_ibfk_1` FOREIGN KEY (`otherUserId`) REFERENCES `register_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
