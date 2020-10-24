var Item = require("../models/item");
var Category = require("../models/category");

var async = require("async");
var validator = require("express-validator");
const { validationResult } = require("express-validator");

// Index
exports.index = (req, res) => {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
    },
    function (err, result) {
      res.render("index", {
        title: "Kitchen Product Inventory Management",
        err,
        result,
      });
    }
  );
};

// Display all items
exports.item_list = (req, res, next) => {
  Item.find({}, "name price").exec(function (err, item_list) {
    if (err) return next(err);
    res.render("item_list", { title: "All items", item_list });
  });
};

// Display item details
exports.item_detail = (req, res, next) => {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      if (result.item == null) {
        var err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_detail", {
        name: result.item.name,
        item: result.item,
      });
    }
  );
};

// Add new item
exports.item_add_get = (req, res, next) => {
  async.parallel(
    {
      category: function (callback) {
        Category.find().exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      res.render("item_form", {
        title: "Add new item",
        categories: result.category,
      });
    }
  );
};

exports.item_add_post = [
  validator
    .body("name", "Item's name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator.body("price", "Price must not be empty").isNumeric().escape(),
  validator
    .body("category", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("stock")
    .matches(/\b(?:Available|Preorder)\b/)
    .withMessage("Stock is Available or Preorder only (case-sensitive)")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var item = new Item({
      name: req.body.name,
      description: req.body.description,
      date_added: new Date(),
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          category: function (callback) {
            Category.find().exec(callback);
          },
        },
        function (err, result) {
          if (err) return next(err);
          res.render("item_form", {
            title: "Add new item",
            categories: result.category,
            item,
            errors,
          });
        }
      );
      return;
    } else {
      item.save(function (err) {
        if (err) return next(err);
        res.redirect(item.url);
      });
    }
  },
];

// Delete item
exports.item_delete_get = (req, res) => {
  res.send("To be added");
};

exports.item_delete_post = (req, res) => {
  res.send("To be added");
};

// Update item
exports.item_update_get = (req, res) => {
  res.send("To be added");
};

exports.item_update_post = (req, res) => {
  res.send("To be added");
};
