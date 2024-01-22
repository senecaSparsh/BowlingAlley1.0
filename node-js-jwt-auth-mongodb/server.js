const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");
const Role = db.role;
const app = express();
const User = db.user; // Add this line to import the User model
const multer = require("multer");

var corsOptions = {
  origin: "http://localhost:8081",
};

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        new Role({
          name: "user",
        })
          .save()
          .then(() => {
            console.log("added 'user' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });

        new Role({
          name: "moderator",
        })
          .save()
          .then(() => {
            console.log("added 'moderator' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });

        new Role({
          name: "admin",
        })
          .save()
          .then(() => {
            console.log("added 'admin' to roles collection");
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
}
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // You need to create an 'uploads' directory in your project
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PRJ666 application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.post("/api/auth/update", upload.single("profilePicture"), (req, res) => {
  // handle the file upload logic here
  // you can access the file details with req.file
  // and other form data with req.body
  User.findByIdAndUpdate(req.user.id, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.file.filename,
    },
  })
    .then(() => {
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
