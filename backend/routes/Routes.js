const express = require("express");
const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const connection = require('../config/database')
const nodemailer = require('nodemailer');
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");

//user
router.get("/users", userController.getAllUsers);
router.get("/login", userController.getAllUsers);
router.post("/login", userController.login);
router.get("/loginAdmin", userController.getAllUsers);
router.post("/loginAdmin", userController.loginAdmin);
router.post('/register', userController.register);
router.put('/users/:id/password', userController.updatePassword);
router.post('/reset-password', userController.resetPassword);
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const [rows] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }

        const user = rows[0];

        const newPassword = crypto.randomBytes(6).toString('hex');
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.promise().query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mcanh3690@gmail.com',
                pass: 'unhx omsc kavj umnv', 
            },
        });

        const mailOptions = {
            from: 'mcanh3690@gmail.com',
            to: email,
            subject: 'Mật khẩu mới của bạn',
            html: `<p>Mật khẩu của bạn đã được đặt lại. Dưới đây là mật khẩu mới:</p>
                   <p><strong>${newPassword}</strong></p>
                   <p>Hãy đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Mật khẩu mới đã được gửi qua email!' });
    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình xử lý', error });
    }
});


//products
router.get("/products", productController.getAllProductsAdmin);
router.get("/products_banchay", productController.bestSellProducts);
router.get("/products_noibat", productController.featuredProducts);
router.get("/products_khuyenmai", productController.sellProducts);
router.get("/products/:id", productController.GetOneProduct);

//categoris
router.get("/categories", categoryController.getAllCategories);
router.get("/product/categories/:id", categoryController.getAllCategories);


// User routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.postUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product routes
router.get("/products", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Category routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.postCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);


module.exports = router;