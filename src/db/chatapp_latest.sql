-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-03-2023 a las 18:04:11
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
('20852145-1a29-4f91-ba50-deaa0c7452b9', 1, 'cc9f2b77-37fe-4136-8115-219a2d144990', '7608919b-1871-443e-b161-476751f0b81a', 1, '2022-12-14 17:51:25'),
('2b546cf3-19e2-4da4-9c58-3d10a9e00292', 1, 'ac18f410-90d0-47c5-ab5e-2b96e10a88d1', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-17 00:44:43'),
('3229614f-b873-4eb8-9678-5dc8c9160d61', 1, '7608919b-1871-443e-b161-476751f0b81a', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-15 01:41:37'),
('4296f8e1-da72-4230-bdf9-fda093aeaf87', 1, 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-15 01:45:34'),
('4677d834-c0ed-4bff-a212-378c2ae4bfd3', 1, 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2022-11-01 13:53:24'),
('51c6d750-4140-4e0b-8699-7d20da960f6e', 1, 'af03a2cb-4816-4ace-9a8b-e0494ce979a4', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2022-11-01 14:33:24'),
('5b239a37-cc1c-436f-9cc9-d81c9f1921be', 1, '786f7325-1861-4c70-8808-6b96d7a954bf', 'cc9f2b77-37fe-4136-8115-219a2d144990', 1, '2022-12-14 17:22:24'),
('629dad34-6c26-4127-917d-d662ed34a48d', 1, '786f7325-1861-4c70-8808-6b96d7a954bf', '81cb6612-c051-45ad-ac14-afb7c342a0b2', 0, '2023-02-19 22:11:44'),
('6469d5b3-7981-44a2-9f38-333f671f19be', 1, 'ea32fadf-3287-4078-ae58-0af84cdf8104', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-17 00:54:16'),
('6b7fc2c4-b015-47bc-a891-1489affbdbcd', 1, '5200f986-b9de-4819-bc5a-b2da6045b1bd', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-17 00:54:32'),
('6e36084d-fc40-4656-8086-9baaa5752b6c', 1, 'edaa5e29-cce4-4332-8731-ad9a0cb2ad12', '786f7325-1861-4c70-8808-6b96d7a954bf', 1, '2023-02-17 01:02:54'),
('800ae578-5e6c-4508-bd05-a94ee2c2c147', 1, 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f', 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', 1, '2023-02-13 23:47:51'),
('9c4d381a-5ecc-49be-a5c7-b488f7e69263', 1, 'af03a2cb-4816-4ace-9a8b-e0494ce979a4', '7608919b-1871-443e-b161-476751f0b81a', 1, '2022-12-14 00:56:16');

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
-- Estructura de tabla para la tabla `pictures_user`
--

CREATE TABLE `pictures_user` (
  `public_id` varchar(40) DEFAULT NULL,
  `imge_url` text DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `userId` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `public_id` varchar(40) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `imge_created_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `register_user`
--

INSERT INTO `register_user` (`id`, `name`, `email`, `pw`, `socket_id`, `date_created`, `public_id`, `image_url`, `imge_created_at`) VALUES
('06fead3a-3d6d-4840-895c-907a4248c6f8', 'test User #3', 'testuser3@gmail.com', '$2a$08$wO/qQAe8Wunz084IoCrHHOXlxzM1WPQBbYEJenvhEoABPHqEoKnlq', 'qM9FwCGVc4hO9zHmAAAH', '2022-09-30 23:58:15', NULL, NULL, NULL),
('30cc6d89-e41b-46df-afaa-581eb1f5baa8', 'test User #4', 'test4@gmail.com', '$2a$08$.CzmPTX6dJUa81DM7CWL..kvHOXgf6pv37WAlcyWLiQNyknTBC6cm', NULL, '2022-09-29 21:57:30', NULL, NULL, NULL),
('5200f986-b9de-4819-bc5a-b2da6045b1bd', 'Emmanuel', 'enmanuel@gmail.com', '$2a$08$pEoUw4FdHvd6RsPcOIq6E.xvQ8Y9J7/YyeUzEbC881mmbJZRVjIs2', NULL, '2023-02-17 00:42:56', NULL, NULL, NULL),
('7608919b-1871-443e-b161-476751f0b81a', 'Karla', 'karla@gmail.com', '$2a$08$BdtoxtsVibtbsv8UGWE1C.wmHNdATrB.N/h2RB.FcXcILLTbtnLuW', '6-O0PPQvGGcv2xFMAAAB', '2023-02-05 02:06:13', 'dtvtpyeky3kepp7hxpzo', 'https://res.cloudinary.com/dsl5g1rs2/image/upload/v1675562773/dtvtpyeky3kepp7hxpzo.jpg', NULL),
('786f7325-1861-4c70-8808-6b96d7a954bf', 'Carlos', 'carlos@gmail.com', '$2a$08$DPdRXOgmUDVqBaxlEK0cvetB1DYZ.J751Nd8.lLZ6esJQiUli.Ta.', '1lTYAyETyisPZDgmAAAF', '2023-02-05 02:33:28', 'd8tsjc8mggtlaea3v0ka', 'https://res.cloudinary.com/dsl5g1rs2/image/upload/v1675564408/d8tsjc8mggtlaea3v0ka.jpg', NULL),
('81cb6612-c051-45ad-ac14-afb7c342a0b2', 'test User #1', 'testuser@gmail.com', '$2a$08$ja7FQmi5vrmnfWny9km.JedsxbyFbFqYl3rwV2NpKL5epj2FdI/pm', NULL, '2022-09-29 21:57:45', NULL, NULL, NULL),
('ac18f410-90d0-47c5-ab5e-2b96e10a88d1', 'Jordan', 'jordam@gmail.com', '$2a$08$mW2QJbK9J8i6M3MYuCzdMezL27WS1v9vX0epCeS2yhpIc9drgz6tq', NULL, '2023-02-17 00:43:28', NULL, NULL, NULL),
('ac6a6e1a-589f-4185-ad6b-d450fcac9b21', 'test User #2', 'testuser2@gmail.com', '$2a$08$OmO7XhcvRhCLNGzK1wX71.zviW7tiWiUGumsNjqFECrZNSn3zHq36', NULL, '2022-09-29 21:57:54', NULL, NULL, NULL),
('af03a2cb-4816-4ace-9a8b-e0494ce979a4', 'luis', 'luis@gmail.com', '$2a$08$gvW/s17aY0vWhWlRI73nv.krOS1IMFL582WV9.0CRsPUfv2QR06Ky', '31S3BN7PZf2xApNkAAAB', '2023-02-05 01:52:02', 'ceq9iej7gkapi79tvqdk', 'https://res.cloudinary.com/dsl5g1rs2/image/upload/v1675561922/ceq9iej7gkapi79tvqdk.jpg', NULL),
('be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', 'emilio', 'emilio@gmail.com', '$2a$08$gH0vO7LQga/Bn2hlmg7yau9yK3AFjplVdgSpZ7usNrjXMMQml7Yii', '7IcWL7W28zqaaCaJAAAJ', '2023-02-05 01:51:13', 'ph3ddau0dxhqxozg8fvb', 'https://res.cloudinary.com/dsl5g1rs2/image/upload/v1675561873/ph3ddau0dxhqxozg8fvb.jpg', NULL),
('cc9f2b77-37fe-4136-8115-219a2d144990', 'hermis', 'hermis@gmail.com', '$2a$08$UG1llEH13YodLHuoAHJCgedGrnnG9B.HXuFhiHnwgSggChalEY21G', 'bDTI1K8qgXDaAGK7AAAB', '2023-02-05 02:35:36', 'e5edtyge0izbwga72sgx', 'https://res.cloudinary.com/dsl5g1rs2/image/upload/v1675564535/e5edtyge0izbwga72sgx.jpg', NULL),
('e05d8f21-b6dd-42c7-b37d-0c78cab2e42f', 'Genesis', 'genesis@gmail.com', '$2a$08$YhKzLgX3lgW5a.61XtIYAu9lP18J3EvZcekljsRs9usMdcHD1E2qu', NULL, '2023-02-13 23:47:14', NULL, NULL, NULL),
('ea32fadf-3287-4078-ae58-0af84cdf8104', 'Ana iris', 'ana@gmail.com', '$2a$08$ezmFphooZj3MYc1DR18XMOtzVEsNjnVU81d1N1Zbmg.NiNOFtvyBu', NULL, '2023-02-17 00:41:46', NULL, NULL, NULL),
('edaa5e29-cce4-4332-8731-ad9a0cb2ad12', 'bianca', 'bianca@gmail.com', '$2a$08$4px7Cg6WJIE71cARuSG3t.WSdUIB0u.qBCKE5kKr3ROI48/Ppwvay', NULL, '2023-02-17 01:02:13', NULL, NULL, NULL);

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
('028aaa93-6007-4af7-afb9-8ed0a3a45c8e'),
('1aeb60b4-ce81-46a6-b191-4a214fff7835'),
('1bea074a-a94d-4bec-82e9-83b2a017145f'),
('253b7ed5-ac47-4e26-bf9e-6c5c60c6607a'),
('2873a935-d096-43e0-b311-ea8ade201391'),
('36a55c52-87f4-446a-b208-3f1632aaf366'),
('68b6d9ce-d915-4d7a-8dea-b1c181c98c17'),
('6a4f940e-0537-4d9e-804f-79b87bdde6f3'),
('762890be-9c1a-4bb1-b7f2-329e2bac779e'),
('87d5132a-03dc-4dc9-978c-b82298a9b11a'),
('9a88d52e-91c4-4b68-b092-229bd0e8147f'),
('b80f28d0-1bd9-4fa5-947b-b0d772950445');

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
('6a4f940e-0537-4d9e-804f-79b87bdde6f3', '786f7325-1861-4c70-8808-6b96d7a954bf', 'af03a2cb-4816-4ace-9a8b-e0494ce979a4'),
('2873a935-d096-43e0-b311-ea8ade201391', 'af03a2cb-4816-4ace-9a8b-e0494ce979a4', '7608919b-1871-443e-b161-476751f0b81a'),
('2873a935-d096-43e0-b311-ea8ade201391', '7608919b-1871-443e-b161-476751f0b81a', 'af03a2cb-4816-4ace-9a8b-e0494ce979a4'),
('762890be-9c1a-4bb1-b7f2-329e2bac779e', '786f7325-1861-4c70-8808-6b96d7a954bf', 'cc9f2b77-37fe-4136-8115-219a2d144990'),
('762890be-9c1a-4bb1-b7f2-329e2bac779e', 'cc9f2b77-37fe-4136-8115-219a2d144990', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('b80f28d0-1bd9-4fa5-947b-b0d772950445', 'cc9f2b77-37fe-4136-8115-219a2d144990', '7608919b-1871-443e-b161-476751f0b81a'),
('b80f28d0-1bd9-4fa5-947b-b0d772950445', '7608919b-1871-443e-b161-476751f0b81a', 'cc9f2b77-37fe-4136-8115-219a2d144990'),
('87d5132a-03dc-4dc9-978c-b82298a9b11a', 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f', 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c'),
('87d5132a-03dc-4dc9-978c-b82298a9b11a', 'be38cc8f-dbab-4c2e-91f2-dc6cd16c5e2c', 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f'),
('9a88d52e-91c4-4b68-b092-229bd0e8147f', '7608919b-1871-443e-b161-476751f0b81a', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('9a88d52e-91c4-4b68-b092-229bd0e8147f', '786f7325-1861-4c70-8808-6b96d7a954bf', '7608919b-1871-443e-b161-476751f0b81a'),
('68b6d9ce-d915-4d7a-8dea-b1c181c98c17', 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('68b6d9ce-d915-4d7a-8dea-b1c181c98c17', '786f7325-1861-4c70-8808-6b96d7a954bf', 'e05d8f21-b6dd-42c7-b37d-0c78cab2e42f'),
('253b7ed5-ac47-4e26-bf9e-6c5c60c6607a', 'ac18f410-90d0-47c5-ab5e-2b96e10a88d1', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('253b7ed5-ac47-4e26-bf9e-6c5c60c6607a', '786f7325-1861-4c70-8808-6b96d7a954bf', 'ac18f410-90d0-47c5-ab5e-2b96e10a88d1'),
('1bea074a-a94d-4bec-82e9-83b2a017145f', 'ea32fadf-3287-4078-ae58-0af84cdf8104', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('1bea074a-a94d-4bec-82e9-83b2a017145f', '786f7325-1861-4c70-8808-6b96d7a954bf', 'ea32fadf-3287-4078-ae58-0af84cdf8104'),
('028aaa93-6007-4af7-afb9-8ed0a3a45c8e', '5200f986-b9de-4819-bc5a-b2da6045b1bd', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('028aaa93-6007-4af7-afb9-8ed0a3a45c8e', '786f7325-1861-4c70-8808-6b96d7a954bf', '5200f986-b9de-4819-bc5a-b2da6045b1bd'),
('36a55c52-87f4-446a-b208-3f1632aaf366', 'edaa5e29-cce4-4332-8731-ad9a0cb2ad12', '786f7325-1861-4c70-8808-6b96d7a954bf'),
('36a55c52-87f4-446a-b208-3f1632aaf366', '786f7325-1861-4c70-8808-6b96d7a954bf', 'edaa5e29-cce4-4332-8731-ad9a0cb2ad12');

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
-- Indices de la tabla `pictures_user`
--
ALTER TABLE `pictures_user`
  ADD KEY `userId` (`userId`);

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
-- Filtros para la tabla `pictures_user`
--
ALTER TABLE `pictures_user`
  ADD CONSTRAINT `pictures_user_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `register_user` (`id`);

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
