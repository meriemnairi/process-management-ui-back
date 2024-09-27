
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Page = require("./models/Page");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose
  .connect(
    "mongodb+srv://meriemnairi:Wd7rUbJ2tk7PphRV@cluster0.03yyn.mongodb.net/"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route to add a new page
app.post("/api/pages/add", async (req, res) => {
  const { title, icon, color, form, link } = req.body;

  try {
    const newPage = new Page({ title, icon, color, form, link });
    await newPage.save();
    res.status(201).json({ message: "Page added successfully", page: newPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding page", error });
  }
});


app.put("/api/pages/update/:id", async (req, res) => {
  const { id } = req.params; 
  const { title, icon, color, form, link } = req.body; 

  try {
    
    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { title, icon, color, form, link },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json({ message: "Page updated successfully", page: updatedPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating page", error });
  }
});


app.get("/api/pages", async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pages", error });
  }
});



app.get("/api/pages/:id", async (req, res) => {
  try {
    //console.log("Page ID:", req.params.id); 

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid page ID format");
      return res.status(400).send("Invalid page ID format");
    }

    const page = await Page.findById(req.params.id);
    //console.log("Page found:", page); 

    if (!page) {
      console.log("Page not found for ID:", req.params.id);
      return res.status(404).send("Page not found");
    }

    page.views += 1;
    await page.save();
    res.json(page);
  } catch (err) {
    console.error("Error fetching page:", err); 
    res.status(500).send(err);
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
