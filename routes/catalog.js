var category_controller = require("../controllers/category_controller");
var item_controller = require("../controllers/item_controller");

var express = require("express");
var router = express.Router();

// Category routes
router.get("/categories", category_controller.category_list);
router.get("/category/add", category_controller.category_add_get);
router.post("/category/add", category_controller.category_add_post);
router.get("/category/:id", category_controller.category_detail);
router.get("/category/:id/delete", category_controller.category_delete_get);
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/delete", category_controller.category_delete_post);
router.post("/category/:id/update", category_controller.category_update_post);

// Item routes
router.get("/", item_controller.index);
router.get("/items", item_controller.item_list);
router.get("/item/add", item_controller.item_add_get);
router.post("/item/add", item_controller.item_add_post);
router.get("/item/:id", item_controller.item_detail);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.post("/item/:id/update", item_controller.item_update_post);

module.exports = router;
