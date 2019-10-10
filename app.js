const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/queries");
const cors = require("cors");
const multer = require("multer");

app.use(cors());

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

app.get("/recipes", db.getRecipes);
app.get("/recipes/:title", db.getRecipeDetails);
app.get("/recipes/category/:category", db.getRecipesInCategory);
app.post("/recipes", db.createRecipe);
app.post("/recipes/image", upload.single("upload"), db.addPicture);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3050, () => {
  console.log("Server listening");
});
