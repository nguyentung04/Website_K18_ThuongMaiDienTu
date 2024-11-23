require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { generateToken, passport } = require("./config/passport");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require('jsonwebtoken');

require("./config/passport");

const Routes = require("./routes/Routes");
const commentsRoutes = require("./routes/commentsRoutes");
const comment_detailRoutes = require("./routes/comment_detailRoute");
const posts = require("./routes/posts");
const post_categories = require("./routes/post_categories");
const comment = require("./routes/comment");
const product_detailRoutes = require("./routes/product_detail/index");
const order_itemsRoutes = require("./routes/order_items/index");
const cart = require("./routes/cart/index");

const ordersRoutes = require("./routes/orders/index");
const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entity = req.params.entity || "default";
    const uploadPath = path.join(__dirname, "uploads", entity);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    cb(null, `${nameWithoutExt}${extension}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload/:entity", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  res.json({ filePath: `${file.filename}` });
});

app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/profile", passport.authenticate('google-token'), (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).send({ error: 'Unauthorized' });
  }
});



app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    console.log("Google Login Success - req.user:", req.user);
    if (req.user) {
      const token = generateToken(req.user);
      console.log("Generated Token:", token);
      res.redirect(`http://localhost:3001/?token=${token}`);
    } else {
      res.status(401).send({ error: 'User not authenticated' });
    }
  }
);

app.use("/api", Routes);
app.use("/api", commentsRoutes);
app.use("/api", comment_detailRoutes);
app.use("/api", product_detailRoutes);
app.use("/api", comment);
app.use("/api", posts);
app.use("/api", post_categories);
app.use("/api", ordersRoutes);
app.use("/api", order_itemsRoutes);
app.use("/api", cart);

app.listen(port, () => {
  console.log(`Server đã khởi chạy trên cổng ${port}`);
});
