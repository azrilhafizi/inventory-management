var Category = require("../models/category");
var Item = require("../models/item");

var async = require("async");
var validator = require("express-validator");
const { validationResult } = require("express-validator");

// Display all categories
exports.category_list = (req, res, next) => {
  Category.find({}, "name").exec(function (err, category_list) {
    if (err) return next(err);
    res.render("category_list", { title: "All Categories", category_list });
  });
};

// Category details
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, result) {
      if (err) return next(err);
      if (result.category == null) {
        var err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail", {
        category: result.category,
        category_items: result.category_items,
      });
    }
  );
};

// Add new category
exports.category_add_get = (req, res, next) => {
  res.render("category_form", { title: "Add new category" });
};

exports.category_add_post = [
  validator
    .body("name", "Category's name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  validator
    .body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Add new category",
        category: req.body,
        errors,
      });
      return;
    } else {
      var category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      category.save(function (err) {
        if (err) return next(err);
        res.redirect(category.url);
      });
    }
  },
];

// Delete category
exports.category_delete_get = (req, res, next) => {
  res.send("To be added");
};

exports.category_delete_post = (req, res, next) => {
  res.send("To be added");
};

// Update category
exports.category_update_get = (req, res, next) => {
  res.send("To be added");
};

exports.category_update_post = (req, res, next) => {
  res.send("To be added");
};
