-- init-user.sql

-- 1) 신규 사용자 생성
CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'%' 
  IDENTIFIED BY '${DB_PASSWORD}';

-- 2) 해당 DB에 권한 부여
GRANT ALL PRIVILEGES 
  ON `${DB_NAME}`.* 
  TO '${DB_USERNAME}'@'%';

-- 3) 변경된 권한 즉시 적용
FLUSH PRIVILEGES;
