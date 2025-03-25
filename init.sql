CREATE TABLE IF NOT EXISTS `user` (
  `no` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `id` varchar(100) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(20) NOT NULL,
  `agg_slt1` tinyint(1) NOT NULL DEFAULT 0 COMMENT '선택동의 1',
  PRIMARY KEY (`no`),
  KEY `id` (`id`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `chat` (
  `no` int(8) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `id` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '받는분',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_id` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '보낸분',
  `readed` char(1) CHARACTER SET utf8 NOT NULL,
  `room_no` int(11) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`no`),
  KEY `id` (`id`),
  KEY `from_id` (`from_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chat_room` (
  `no` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) CHARACTER SET utf8 NOT NULL,
  `manager_id` varchar(45) CHARACTER SET utf8 NOT NULL,
  `last_content` text NOT NULL COMMENT '마지막 대화내용',
  `last_active_time` timestamp ON UPDATE current_timestamp() COMMENT '마지막 active time',
  `create_time` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  PRIMARY KEY (`no`),
  KEY `user_id` (`user_id`),
  KEY `manager_id` (`manager_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='대화방 정보';

CREATE TABLE IF NOT EXISTS `work_notification_2025` (
    `no` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(45) CHARACTER SET utf8 NOT NULL,
    `type` varchar(20) NOT NULL,
    `create_time` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
    PRIMARY KEY (`no`),
    KEY `user_id` (`user_id`)
 ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COMMENT='2025년 업무알림';