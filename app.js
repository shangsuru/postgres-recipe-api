const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/queries");
const port = 3050;
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + ".jpg");
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  }
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/recipes", db.getRecipes);
app.get("/recipes/:title", db.getRecipeDetails);
app.post("/recipes", db.createRecipe);
app.post("/recipes/image", upload.single("upload"), db.addPicture);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
