DROP DATABASE IF EXISTS `medir`;

CREATE DATABASE `medir` DEFAULT CHARSET utf8mb4;

USE `medir`;

CREATE TABLE `room` (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  root_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  index(name)
);

CREATE TABLE `dir` (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  parent_id BIGINT UNSIGNED,
  name VARCHAR(255) NOT NULL,
  index(parent_id)
);

CREATE TABLE `memo` (
  id BIGINT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  dir_id BIGINT UNSIGNED NOT NULL,
  content MEDIUMTEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  index(dir_id)
);
