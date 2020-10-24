var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 200 },
  date_added: { type: Date, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", require: true },
  stock: {
    type: String,
    require: true,
    enum: ["Available", "Preorder"],
    default: "Available",
  },
});

ItemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

ItemSchema.virtual("date_added_formatted").get(function () {
  return moment(this.date_added).format("MMMM Do, YYYY");
});

module.exports = mongoose.model("Item", ItemSchema);
