DROP DATABASE IF EXISTS greatbayDB;
CREATE DATABASE greatbayDB;
USE greatbayDB;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(30) NOT NULL,
  currentprice VARCHAR(30) NOT NULL,
  bidid INT,
  PRIMARY KEY (id)
);

CREATE TABLE bids (
  id INT NOT NULL AUTO_INCREMENT,
  bidprice VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);



-- INSERT INTO items (item, currentprice, bidid) values ('rolex', 1000, 1);
-- INSERT INTO items (item, currentprice, bidid) values ('jordans', 50, 2);

-- INSERT INTO bids (bidprice) values (200);
-- INSERT INTO bids (bidprice) values (600);


SELECT * FROM items;
SELECT * FROM bids;

SELECT item, currentprice
FROM items
INNER JOIN bids ON items.bidid = bids.id;

SELECT * FROM items i
INNER JOIN bids b  
WHERE i.bidid = b.id;
