#! /usr/bin/env node

console.log(
  "This script populates some test to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Category = require("./models/category");
var Item = require("./models/item");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  categorydetail = { name, description };
  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, date_added, price, category, stock, cb) {
  itemdetail = { name, description, date_added, price, category, stock };
  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Kitchenware",
          "tools, utensils, appliances, dishes, and cookware used in food preparation, or the serving of food",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Kitchen Appliances",
          "device which assists in household functions",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Drinkware",
          "Drinkware, beverageware, and barware are general terms for the class of vessels from which people drink",
          callback
        );
      },
    ],
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Coffee Press",
          "A French press, also known as a cafetière, cafetière à piston, caffettiera a stantuffo, press pot, coffee press, or coffee plunger, is a coffee brewing device",
          new Date(),
          80,
          categories[0],
          "Available",
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Mixer",
          "A mixer is a kitchen device that uses a gear-driven mechanism to rotate a set of 'beaters' in a bowl containing the food or liquids to be prepared by mixing them",
          new Date(),
          30,
          categories[0],
          "Preorder",
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Beer glassware",
          "Beer glassware comprise vessels made of glass, designed or commonly used for serving and drinking beer",
          new Date(),
          30,
          categories[2],
          "Available",
          callback
        );
      },
    ],
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
