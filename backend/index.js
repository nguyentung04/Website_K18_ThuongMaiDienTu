const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const Routes = require("./routes/Routes");
const commentsRoutes = require("./routes/commentsRoutes");
const comment_detailRoutes = require("./routes/comment_detailRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Phục vụ các tập tin tĩnh từ thư mục tải lên
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Cấu hình lưu trữ multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entity = req.params.entity || 'default'; // Lấy thực thể từ tham số URL, mặc định là 'default'
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
    cb(null, `${nameWithoutExt}${extension}`); // Thêm dấu thời gian vào tên tệp
  },
});

const upload = multer({ storage });

// Tuyến đường để xử lý việc tải lên tệp
app.post("/api/upload/:entity", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  res.json({ filePath: `${file.filename}` }); // Trả về đường dẫn tệp tin
});

// Use other routes
app.use('/api', Routes);
app.use('/api', commentsRoutes);
app.use('/api', comment_detailRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
