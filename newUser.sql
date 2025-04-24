

CREATE TABLE users (
    username VARCHAR2(50) PRIMARY KEY,
    password VARCHAR2(100) NOT NULL
);
SELECT * from users;


--INSERT INTO users (username, password) VALUES ('testuser', '123456');
--COMMIT;




DELETE FROM users;
--SELECT * FROM users WHERE password = '123123';
--
--SELECT table_name FROM user_tables WHERE table_name = 'USERS';
SELECT * FROM users WHERE username = 'Sir Rauf';

-- Pehle se maujood table ko delete karne ke liye
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE students CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN -- -942 means table doesn't exist, ignore this error
            RAISE;
        END IF;
END;
/

-- Nai table create karne ke liye
CREATE TABLE students (
    rollNumber VARCHAR2(50) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    math NUMBER CHECK (math BETWEEN 0 AND 100),
    eng NUMBER CHECK (eng BETWEEN 0 AND 100),
    urd NUMBER CHECK (urd BETWEEN 0 AND 100),
    sci NUMBER CHECK (sci BETWEEN 0 AND 100),
    total NUMBER GENERATED ALWAYS AS (math + eng + urd + sci) VIRTUAL,
    percentage NUMBER GENERATED ALWAYS AS ((math + eng + urd + sci) * 100 / 400) VIRTUAL
); 

SELECT * FROM students;




-- TESTING

--INSERT INTO students (rollNumber, name, math, eng, urd, sci) 
--VALUES ('101', 'Ali', 90, 80, 85, 70);
--COMMIT;
--
--
--INSERT INTO students (rollNumber, name, math, eng, urd, sci) 
--VALUES ('102', 'Aisha', 75, 88, 92, 80);
--
--COMMIT;
--
--SELECT * FROM students WHERE rollNumber = '1236';
--DELETE FROM students WHERE rollNumber = '101';
--COMMIT;
--
--SELECT * FROM students WHERE rollNumber = '8888';
--DELETE FROM students WHERE rollNumber = '102';
--COMMIT;
