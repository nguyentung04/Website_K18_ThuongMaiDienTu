require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { generateToken, passport } = require("./config/passport");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");

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

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/profile",
  passport.authenticate("google-token"),
  (req, res) => {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).send({ error: "Unauthorized" });
    }
  }
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    console.log("Google Login Success - req.user:", req.user);
    if (req.user) {
      const token = generateToken(req.user);
      console.log("Generated Token:", token);
      res.redirect(`http://localhost:3001/?token=${token}`);
    } else {
      res.status(401).send({ error: "User not authenticated" });
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
  console.log(`Server is running on port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//payment
app.post("/payment", async (req, res) => {
  console.log("Body received:", req.body);

  const accessKey = "F8BBA842ECF85";
  const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const partnerCode = "MOMO";
  const orderInfo = req.body.orderInfo;
  const redirectUrl = "http://localhost:3001/formcheckout";
  const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
  const requestType = "payWithMethod";
  const amount = Number(req.body.amount); // Đảm bảo là số
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = "";
  const orderGroupId = "";
  const autoCapture = true;
  const lang = "vi";

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  console.log("RAW SIGNATURE:", rawSignature);

  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  console.log("SIGNATURE:", signature);

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature,
  });

  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody, "utf8"),
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (err) {
    console.error("MoMo API Error:", err.response?.data || err.message);
    return res.status(500).json({
      statusCode: 500,
      message: "server error",
      error: err.response?.data || err.message,
    });
  }
});

app.post("/callback", async (req, res) => {
  console.log("callback: ");
  console.log(res.body);

  return res.status(200).json(req.body);
});

app.post("/transaction-status", async (req, res) => {
  const { orderId } = req.body;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&redirectUrl=${redirectUrl}&requestId=${orderId}&requestType=${requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId,
    signature,
    lang: "vi",
  });
});
