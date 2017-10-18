/*
Navicat MySQL Data Transfer

Source Server         : huawei
Source Server Version : 50717
Source Host           : 139.159.217.156:3306
Source Database       : fengyun

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-10-09 23:20:30
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
-- Records of animals
-- ----------------------------
INSERT INTO `animals` VALUES ('1', 'ma', '马');
INSERT INTO `animals` VALUES ('2', 'hudie', '蝴蝶');
INSERT INTO `animals` VALUES ('3', 'jinlong', '金龙');
INSERT INTO `animals` VALUES ('4', 'yemao', '野猫');
INSERT INTO `animals` VALUES ('5', 'nigu', '尼姑');
INSERT INTO `animals` VALUES ('6', 'ji', '鸡');
INSERT INTO `animals` VALUES ('7', 'jinyu', '金鱼');
INSERT INTO `animals` VALUES ('8', 'malu', '马鹿');
INSERT INTO `animals` VALUES ('9', 'xianhe', '仙鹤');
INSERT INTO `animals` VALUES ('10', 'wugui', '乌龟');
INSERT INTO `animals` VALUES ('11', 'wuya', '乌鸦');
INSERT INTO `animals` VALUES ('12', 'daxiang', '大象');
INSERT INTO `animals` VALUES ('13', 'zhizhu', '蜘蛛');
INSERT INTO `animals` VALUES ('14', 'she', '蛇');
INSERT INTO `animals` VALUES ('15', 'kongque', '孔雀');
INSERT INTO `animals` VALUES ('16', 'laohu', '老虎');
INSERT INTO `animals` VALUES ('17', 'dae', '大鹅');
INSERT INTO `animals` VALUES ('18', 'yanzi', '燕子');
INSERT INTO `animals` VALUES ('19', 'houzi', '猴子');
INSERT INTO `animals` VALUES ('20', 'zhu', '猪');
INSERT INTO `animals` VALUES ('21', 'luoshi', '螺蛳');
INSERT INTO `animals` VALUES ('22', 'gou', '狗');
INSERT INTO `animals` VALUES ('23', 'tuzi', '兔子');
INSERT INTO `animals` VALUES ('24', 'feilong', '飞龙');
INSERT INTO `animals` VALUES ('25', 'jiamao', '家猫');
INSERT INTO `animals` VALUES ('26', 'pangxie', '螃蟹');
INSERT INTO `animals` VALUES ('27', 'niu', '牛');
INSERT INTO `animals` VALUES ('28', 'yang', '羊');
INSERT INTO `animals` VALUES ('29', 'baiyu', '白鱼');
INSERT INTO `animals` VALUES ('30', 'qiuyin', '蚯蚓');
INSERT INTO `animals` VALUES ('31', 'gezi', '鸽子');
INSERT INTO `animals` VALUES ('32', 'qingwa', '青蛙');
INSERT INTO `animals` VALUES ('33', 'baoshi', '宝石');
INSERT INTO `animals` VALUES ('34', 'mifeng', '蜜蜂');
INSERT INTO `animals` VALUES ('35', 'shanyu', '鳝鱼');
INSERT INTO `animals` VALUES ('36', 'laoshu', '老鼠');
