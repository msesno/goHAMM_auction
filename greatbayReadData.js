var mysql = require("mysql");
var inquirer = require("inquirer");// create the connection information for the sql database
var connection = mysql.createConnection({
 host: "localhost",  // Your port; if not 3306
 port: 3306,  // Your username
 user: "root",  // Your password
 password: "Mafewsez69$",
 database: "greatbayDB"
});// connect to the mysql server and sql database
connection.connect(function(err) {
 if (err) throw err;
 // run the start function after the connection is made to prompt the user
 start();
});

// function which prompts the user for what action they should take

function start() {
 inquirer
   .prompt({
     name: "postOrBid",
     type: "list",
     message: "Would you like to [POST] an auction or [BID] on an auction?",
     choices: ["POST", "BID", "EXIT"]
   })
   .then(function(answer) {
     if (answer.postOrBid === "POST"){
      postAuction();
     }
     
     if (answer.postOrBid === "BID"){
      bidAuction();
     }

     });// based on their answer, either call the bid or the post functions    
}

// function to handle posting new items up for auction

function postAuction() {
 // prompt for info about the item being put up for auction
 inquirer
   .prompt([
     {
       name: "item",
       type: "input",
       message: "What is the item you would like to submit?"
     },
     {
       name: "currentprice",
       type: "input",
       message: "What would you like your starting price to be?",
       validate: function(value) {
         if (isNaN(value) === false) {
           return true;
         }
         return false;
       }
     },
     {
      name: "bidid",
      type: "input",
      message: "What is the bidid you would like to submit?"
    }
   ])
   .then(function(answer) {

    createItem(answer);
    start();
    

     });// when finished prompting, insert a new item into the db with that info    
}

function bidAuction() {
 // query the database for all items being auctioned
 connection.query("SELECT * FROM items", function(err, results) {
   if (err) throw err;
   // once you have the items, prompt the user for which they'd like to bid on
   inquirer
     .prompt([
       {
         name: "choice",
         type: "rawlist",
         choices: function() {
           var choiceArray = [];
           for (var i = 0; i < results.length; i++) {
             choiceArray.push(results[i].item_name);
           }
           return choiceArray;
         },
         message: "What item would you like to place a bid on?"
       },
       {
         name: "bidprice",
         type: "input",
         message: "How much would you like to bid?"
       }
     ])
     .then(function(answer) {
      
      updateItem(answer);

       });// get the information of the chosen item      
 });
}

function createItem(answer) {
  console.log("Inserting a new item...\n");
  var query = connection.query(
    "INSERT INTO items SET ?",
    {
      item: answer.item,
      currentprice: answer.currentprice,
      bidid: answer.bidid
    },
    function(err, res) {
      console.log(res.affectedRows + " item inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      readItems();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function updateItem() {
  console.log("Updating item price...\n");
  var query = connection.query(
    "UPDATE items SET ? WHERE ?",
    [
      {
        currentprice: answer.bidprice
      },
      {
        item: answer.choice
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      deleteItem();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}

function deleteItem() {
  console.log("Deleting old price...\n");
  connection.query(
    "DELETE FROM items WHERE ?",
    {
      item: answer.choice
    },
    function(err, res) {
      console.log(res.affectedRows + " products deleted!\n");
      // Call readProducts AFTER the DELETE completes
      readItems();
    }
  );
}

function readItems() {
  console.log("Selecting all items...\n");
  connection.query("SELECT * FROM items", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
}
