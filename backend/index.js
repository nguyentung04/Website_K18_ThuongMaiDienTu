// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const multer = require("multer");
// const fs = require("fs");
// const session = require("express-session");

// const Routes = require("./routes/Routes");
// const commentsRoutes = require("./routes/commentsRoutes");
// const comment_detailRoutes = require("./routes/comment_detailRoute");
// const posts = require("./routes/posts");
// const post_categories = require("./routes/post_categories");
// const comment = require("./routes/comment");
// const product_detailRoutes = require("./routes/product_detail/index");
// const citieslRoutes = require("./routes/cities/citiesRoutes");
// const districtsController = require("./routes/districts/index");
// const order_itemsRoutes = require("./routes/order_items/index");

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware để phân tích dữ liệu JSON và URL-encoded
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS middleware
// app.use(
//   cors({
//     origin: "http://localhost:3001",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Middleware để xử lý phiên
// app.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: true,
// }));

// // Phục vụ các tập tin tĩnh từ thư mục tải lên
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Cấu hình lưu trữ multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const entity = req.params.entity || "default";
//     const uploadPath = path.join(__dirname, "uploads", entity);
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname;
//     const extension = path.extname(originalName);
//     const nameWithoutExt = path.basename(originalName, extension);
//     cb(null, `${nameWithoutExt}${extension}`);
//   },
// });

// const upload = multer({ storage });

// // Tuyến đường để xử lý việc tải lên tệp
// app.post("/api/upload/:entity", upload.single("file"), (req, res) => {
//   const file = req.file;
//   if (!file) {
//     return res.status(400).send({ error: "No file uploaded" });
//   }
//   res.json({ filePath: `${file.filename}` });
// });

// // Sử dụng các routes khác
// app.use("/api", Routes);
// app.use("/api", commentsRoutes);
// app.use("/api", comment_detailRoutes);
// app.use("/api", product_detailRoutes);
// app.use("/api", citieslRoutes);
// app.use("/api", districtsController);
// app.use("/api", comment);
// app.use("/api", posts);
// app.use("/api", post_categories);
// app.use("/api", order_itemsRoutes);

// // Khởi động server
// app.listen(port, () => {
//   console.log(`Server đã khởi chạy ${port}`);
// });
// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Import Passport configuration
require("./config/passport");

const Routes = require("./routes/Routes");
const commentsRoutes = require("./routes/commentsRoutes");
const comment_detailRoutes = require("./routes/comment_detailRoute");
const posts = require("./routes/posts");
const post_categories = require("./routes/post_categories");
const comment = require("./routes/comment");
const product_detailRoutes = require("./routes/product_detail/index");
const order_itemsRoutes = require("./routes/order_items/index");
const ordersRoutes = require("./routes/orders/index");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình session để Passport hoạt động
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));

// Cấu hình Passport và session của nó
app.use(passport.initialize());
app.use(passport.session());

// Middleware để phân tích dữ liệu JSON và URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Phục vụ các tập tin tĩnh từ thư mục tải lên
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cấu hình lưu trữ multer
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

// Tuyến đường để xử lý việc tải lên tệp
app.post("/api/upload/:entity", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  res.json({ filePath: `${file.filename}` });
});

// Định tuyến cho đăng nhập bằng Google
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    // Chuyển hướng về trang chính sau khi đăng nhập thành công
    res.redirect("http://localhost:3001?username=" + req.user.name); // Đảm bảo URL này đúng với frontend của bạn
  }
);

// Sử dụng các routes khác
app.use("/api", Routes);
app.use("/api", commentsRoutes);
app.use("/api", comment_detailRoutes);
app.use("/api", product_detailRoutes);
app.use("/api", comment);
app.use("/api", posts);
app.use("/api", post_categories);
app.use("/api", ordersRoutes);
app.use("/api", order_itemsRoutes);

// Khởi động server
app.listen(port, () => {
  console.log(`Server đã khởi chạy trên cổng ${port}`);
});
