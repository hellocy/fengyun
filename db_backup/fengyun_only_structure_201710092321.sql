/*
Navicat MySQL Data Transfer

Source Server         : huawei
Source Server Version : 50717
Source Host           : 139.159.217.156:3306
Source Database       : fengyun

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-10-09 23:21:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for animals
-- ----------------------------
DROP TABLE IF EXISTS `animals`;
CREATE TABLE `animals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aniName` varchar(50) DEFAULT NULL,
  `aniCnName` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for authority
-- ----------------------------
DROP TABLE IF EXISTS `authority`;
CREATE TABLE `authority` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `authName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for buy
-- ----------------------------
DROP TABLE IF EXISTS `buy`;
CREATE TABLE `buy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) DEFAULT NULL,
  `uName` varchar(50) DEFAULT NULL,
  `placeId` int(11) DEFAULT NULL,
  `sessionId` int(11) DEFAULT NULL,
  `sessionName` varchar(100) DEFAULT NULL,
  `detail` varchar(2500) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `balance` float(100,2) DEFAULT NULL,
  `buildTime` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for charge
-- ----------------------------
DROP TABLE IF EXISTS `charge`;
CREATE TABLE `charge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `uname` varchar(20) DEFAULT NULL,
  `count` float(11,2) DEFAULT NULL,
  `balance` float(11,0) DEFAULT NULL,
  `chargeTime` varchar(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msg_status` int(11) DEFAULT NULL COMMENT '0：未读   1： 已读',
  `content` text,
  `msg_to` int(10) DEFAULT NULL COMMENT 'uid, 消息发送给哪个用户',
  `datetime` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COMMENT '公告内容',
  `datetime` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for place
-- ----------------------------
DROP TABLE IF EXISTS `place`;
CREATE TABLE `place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `animal` varchar(50) DEFAULT NULL,
  `createTime` varchar(20) DEFAULT NULL,
  `subject` varchar(2000) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `sequence` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placeId` int(11) DEFAULT NULL,
  `placeName` varchar(255) DEFAULT NULL,
  `sequence` varchar(5) DEFAULT NULL,
  `sessionName` varchar(50) DEFAULT NULL,
  `openTime` varchar(20) DEFAULT NULL COMMENT '上/中/下',
  `openAnimalId` int(11) DEFAULT NULL,
  `openAnimalName` varchar(50) DEFAULT NULL,
  `rate` int(5) DEFAULT NULL,
  `date` varchar(20) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT '0：未开奖   1:  已开奖',
  `aniMaxCount` int(11) DEFAULT NULL COMMENT '本场动物最高可购买点数',
  `forbiddenAni` varchar(200) DEFAULT NULL COMMENT '禁止买入的动物id',
  `currentTotal` int(11) DEFAULT NULL COMMENT '已购买点数总和',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for uorder
-- ----------------------------
DROP TABLE IF EXISTS `uorder`;
CREATE TABLE `uorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `uname` varchar(50) DEFAULT NULL,
  `count` float(11,2) DEFAULT NULL,
  `balance` float(11,2) DEFAULT NULL,
  `datetime` varchar(20) DEFAULT NULL,
  `type` varchar(5) DEFAULT NULL COMMENT '"+"或“-”',
  `optname` varchar(10) DEFAULT NULL COMMENT '账户变更名称：充值 / 提点 / 下注 / 中奖',
  `status` int(11) DEFAULT NULL COMMENT '充值状态：0-待处理  1-已处理',
  `sessionName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `pwd` varchar(20) DEFAULT NULL,
  `role` int(2) DEFAULT NULL,
  `joinTime` varchar(20) DEFAULT NULL,
  `headImg` varchar(100) DEFAULT NULL,
  `balance` float(100,2) unsigned DEFAULT NULL,
  `authority` varchar(100) DEFAULT NULL COMMENT '管理员权限列表',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
