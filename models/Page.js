const mongoose = require("mongoose");
const slugify = require("slugify"); 

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    form: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }, 
    views: { type: Number, required: true, default: 0 }, 
  },
  { timestamps: true }
);


PageSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
