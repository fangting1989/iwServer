/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : fsbase

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-03-28 17:41:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_billcomment
-- ----------------------------
DROP TABLE IF EXISTS `t_billcomment`;
CREATE TABLE `t_billcomment` (
  `BillCommentID` bigint(20) NOT NULL AUTO_INCREMENT,
  `Content` text COLLATE utf8_bin,
  `Point` decimal(6,2) DEFAULT NULL,
  `ComPerson` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `Mobile` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `PersonCode` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `MemBillID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`BillCommentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_billcomment
-- ----------------------------
INSERT INTO `t_billcomment` VALUES ('-4', 0x63657368696E6569726F6E67207A68656A69616E6734, '3.00', null, null, null, '-4');
INSERT INTO `t_billcomment` VALUES ('-3', 0x63657368696E6569726F6E67207A68656A69616E6733, '3.00', null, null, null, '-1');
INSERT INTO `t_billcomment` VALUES ('-2', 0x63657368696E6569726F6E67207A68656A69616E6732, '3.00', null, null, null, '-3');
INSERT INTO `t_billcomment` VALUES ('-1', 0x63657368696E6569726F6E67207A68656A69616E6731, '3.00', null, null, null, '-2');

-- ----------------------------
-- Table structure for t_imgs
-- ----------------------------
DROP TABLE IF EXISTS `t_imgs`;
CREATE TABLE `t_imgs` (
  `tableid` int(11) NOT NULL,
  `tablename` varchar(255) DEFAULT NULL,
  `imgpath` varchar(255) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tableid`),
  KEY `index_id_name` (`tableid`,`tablename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_imgs
-- ----------------------------

-- ----------------------------
-- Table structure for t_member
-- ----------------------------
DROP TABLE IF EXISTS `t_member`;
CREATE TABLE `t_member` (
  `MemberID` bigint(20) NOT NULL AUTO_INCREMENT,
  `MemName` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `MemPwd` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `MemMobile` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `MemOld` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `MemAge` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `MemMail` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `WeChatOpenID` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `CostAmount` decimal(10,2) DEFAULT NULL,
  `CostNum` int(11) DEFAULT NULL,
  `WeChatImg` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `WeChatName` varchar(80) COLLATE utf8_bin DEFAULT NULL,
  `MemSex` int(11) DEFAULT NULL,
  PRIMARY KEY (`MemberID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_member
-- ----------------------------
INSERT INTO `t_member` VALUES ('-17', 'ft17', null, null, null, null, null, null, '1000.00', '17', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-16', 'ft16', null, null, null, null, null, null, '1000.00', '16', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-15', 'ft15', null, null, null, null, null, null, '1000.00', '15', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-14', 'ft14', null, null, null, null, null, null, '1000.00', '14', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-13', 'ft13', null, null, null, null, null, null, '1000.00', '13', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-12', 'ft12', null, null, null, null, null, null, '1000.00', '12', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-11', 'ft11', null, null, null, null, null, null, '1000.00', '11', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-10', 'ft10', null, null, null, null, null, null, '1000.00', '10', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-9', 'ft9', null, null, null, null, null, null, '1000.00', '9', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-8', 'ft8', null, null, null, null, null, null, '1000.00', '8', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-7', 'ft7', null, null, null, null, null, null, '1000.00', '7', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-6', 'ft6', null, null, null, null, null, null, '1000.00', '6', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-5', 'ft5', null, null, null, null, null, null, '1000.00', '5', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-4', 'ft4', null, null, null, null, null, null, '1000.00', '4', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-3', 'ft3', null, null, null, null, null, null, '1000.00', '3', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-2', 'ft2', null, null, null, null, null, null, '1000.00', '2', null, 'ft', null);
INSERT INTO `t_member` VALUES ('-1', 'ft1', null, null, null, null, null, null, '1000.00', '1', null, 'ft', null);
INSERT INTO `t_member` VALUES ('5', null, null, null, null, null, null, 'ofr7ZwBNyvp2QP6-TMaKWJEM9YoE', null, null, 'http://wx.qlogo.cn/mmopen/XxT9TiaJ1ibf1ic3QwiczuKNf4yGt2CxlFCYysxjvaNPnhUL64RGiaCMibic0dSiaUkOdHSrr5G96ibIfxUhdU0Xdvsrm9w/0', 'Mr\'s F', null);
INSERT INTO `t_member` VALUES ('6', null, null, null, null, null, null, 'ofr7ZwGHihnf8l7bWIRDGOO_HnJ0', null, null, 'http://wx.qlogo.cn/mmopen/lBEfRIb95jbd88jaEVUv32h4YygiaxjeicOiaN1sFCbd5MnkqWsxDgvomc2KeNjQLrKPMRlKAg3resOXjxTMEANE80DF830YtGf/0', '赵！', null);
INSERT INTO `t_member` VALUES ('7', null, null, null, null, null, null, 'ofr7ZwA9i95mR-clHCoD2vKD7zlU', null, null, 'http://wx.qlogo.cn/mmopen/yonk0lp5zz3YB1nogKialiafgva5v9diaPXe4jmMlWbcSQBze0a3GZ3AOxZS5p9WO6diaegoaBCPVAht0rbhibvI9R9YlYahmqB4t/0', '厮守&流年', null);
INSERT INTO `t_member` VALUES ('8', null, null, null, null, null, null, 'ofr7ZwDDRCfFjTe5wbvjbm5q9KTU', null, null, 'http://wx.qlogo.cn/mmopen/yonk0lp5zz3YB1nogKialiaa0aPicxo0wmQbkNWgIJibH5z9QHOIZQKedn8ct5kpK58vKQI2VUWUfib9G5cRibWhzAmfTSVK1yh9Bu/0', '臭狗熊', null);

-- ----------------------------
-- Table structure for t_membill
-- ----------------------------
DROP TABLE IF EXISTS `t_membill`;
CREATE TABLE `t_membill` (
  `MemBillID` bigint(20) NOT NULL AUTO_INCREMENT,
  `MemBillAmount` decimal(10,2) DEFAULT NULL,
  `BillCostTime` date DEFAULT NULL,
  `BillPayTime` date DEFAULT NULL,
  `BillPayCode` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `BillPayType` int(11) DEFAULT NULL,
  `BillPoint` decimal(10,2) DEFAULT NULL,
  `MemID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`MemBillID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_membill
-- ----------------------------
INSERT INTO `t_membill` VALUES ('-12', '200.55', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-11', '20.45', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-10', '20.23', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-9', '28.12', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-8', '28.90', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-7', '22.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-6', '10.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-5', '500.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-4', '40.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-3', '300.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-2', '20.00', '2017-01-01', null, null, null, null, '-2');
INSERT INTO `t_membill` VALUES ('-1', '200.00', '2017-01-01', null, null, null, null, '-2');

-- ----------------------------
-- Table structure for t_module
-- ----------------------------
DROP TABLE IF EXISTS `t_module`;
CREATE TABLE `t_module` (
  `ModuleID` int(11) NOT NULL AUTO_INCREMENT,
  `ModuleTypeID` int(11) DEFAULT NULL,
  `ModuleName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModuleIndex` int(11) DEFAULT NULL,
  `Valid` int(11) DEFAULT NULL,
  `ModuleIcon` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModuleUrl` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModulePermission` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModuleDesc` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`ModuleID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_module
-- ----------------------------
INSERT INTO `t_module` VALUES ('1', '5', '11', '3', '1', null, '2', null, '333');

-- ----------------------------
-- Table structure for t_moduletype
-- ----------------------------
DROP TABLE IF EXISTS `t_moduletype`;
CREATE TABLE `t_moduletype` (
  `ModuleTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `ModuleTypeName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModuleTypeIndex` int(11) DEFAULT NULL,
  `ModuleTypePID` int(11) DEFAULT NULL,
  `Valid` decimal(1,0) DEFAULT NULL,
  `ModuleTypeIcon` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `ModuleTypeDesc` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`ModuleTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_moduletype
-- ----------------------------
INSERT INTO `t_moduletype` VALUES ('4', '11222333', '22333', null, '1', '11222', null);
INSERT INTO `t_moduletype` VALUES ('5', '测试系统', '22', null, '1', '11', null);
INSERT INTO `t_moduletype` VALUES ('6', '测试系统2', '20', null, '1', 'fa-plus', null);

-- ----------------------------
-- Table structure for t_news
-- ----------------------------
DROP TABLE IF EXISTS `t_news`;
CREATE TABLE `t_news` (
  `newsid` int(11) NOT NULL,
  `newstitle` varchar(255) DEFAULT NULL,
  `newsubtitle` varchar(255) DEFAULT NULL,
  `newscontent` text,
  `newsimgs` varchar(255) DEFAULT NULL,
  `newsdesc` varchar(255) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_news
-- ----------------------------

-- ----------------------------
-- Table structure for t_prod
-- ----------------------------
DROP TABLE IF EXISTS `t_prod`;
CREATE TABLE `t_prod` (
  `prodid` int(11) NOT NULL AUTO_INCREMENT,
  `prodname` varchar(255) DEFAULT NULL,
  `prodenname` varchar(255) DEFAULT NULL,
  `prodshortinfo` varchar(255) DEFAULT NULL,
  `prodinfo` text,
  `prodkeyword` varchar(255) DEFAULT NULL,
  `prodprice` decimal(10,2) DEFAULT NULL,
  `prodcount` varchar(255) DEFAULT NULL,
  `prodtags` varchar(255) DEFAULT NULL,
  `proddesc` varchar(255) DEFAULT NULL,
  `addtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`prodid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_prod
-- ----------------------------
INSERT INTO `t_prod` VALUES ('1', '12313', null, null, '<p>12313</p><p>12</p><p>12</p><p>12</p><p>21</p>', null, '12313.00', null, null, null, null);

-- ----------------------------
-- Table structure for t_role
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role` (
  `RoleID` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `RoleValid` int(11) DEFAULT NULL,
  `RoleCreatedate` date DEFAULT NULL,
  `RoleDesc` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_role
-- ----------------------------

-- ----------------------------
-- Table structure for t_rolemodule
-- ----------------------------
DROP TABLE IF EXISTS `t_rolemodule`;
CREATE TABLE `t_rolemodule` (
  `RoleModuleID` int(11) NOT NULL AUTO_INCREMENT,
  `RoleID` int(11) DEFAULT NULL,
  `ModuleID` int(11) DEFAULT NULL,
  `ModulePermission` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`RoleModuleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_rolemodule
-- ----------------------------

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `UserMobile` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `UserStatus` decimal(1,0) DEFAULT NULL,
  `CreateDate` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `UserMail` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `UserAddress` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `UserPwd` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('1', '方挺1', '18657181338', '1', null, null, null, '123456');

-- ----------------------------
-- Table structure for t_userrole
-- ----------------------------
DROP TABLE IF EXISTS `t_userrole`;
CREATE TABLE `t_userrole` (
  `RoleID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `UserRoleID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`UserRoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of t_userrole
-- ----------------------------

-- ----------------------------
-- Table structure for t_wechatcallback
-- ----------------------------
DROP TABLE IF EXISTS `t_wechatcallback`;
CREATE TABLE `t_wechatcallback` (
  `appid` varchar(50) DEFAULT NULL,
  `attach` varchar(100) NOT NULL,
  `cash_fee` varchar(25) DEFAULT NULL,
  `fee_type` varchar(15) DEFAULT NULL,
  `is_subscribe` varchar(20) DEFAULT NULL,
  `mch_id` varchar(20) DEFAULT NULL,
  `nonce_str` varchar(50) DEFAULT NULL,
  `openid` varchar(50) DEFAULT NULL,
  `out_trade_no` varchar(32) DEFAULT NULL,
  `result_code` varchar(50) DEFAULT NULL,
  `return_code` varchar(50) DEFAULT NULL,
  `total_fee` varchar(25) DEFAULT NULL,
  `time_end` varchar(50) DEFAULT NULL,
  `trade_type` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`attach`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_wechatcallback
-- ----------------------------
