import React, { useState, useEffect } from "react";
import { Button, Menu, MenuButton, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import { fetchProductsByGender } from "../../../../../service/api/products";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FilteredProducts.css";

const BASE_URL = "http://localhost:3000";

const GenderMenu = () => {
  const [gender, setGender] = useState("nam");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const getProducts = async (selectedGender) => {
    setLoading(true);
    try {
      const data = await fetchProductsByGender(selectedGender);
      setProducts(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải sản phẩm.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(gender);
  }, [gender]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="gender-menu-container">
      <Menu>
        <MenuButton as={Button} colorScheme="blue">
          Chọn giới tính: {gender === "nam" ? "Nam" : "Nữ"}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setGender("nam")}>Nam</MenuItem>
          <MenuItem onClick={() => setGender("nữ")}>Nữ</MenuItem>
        </MenuList>
      </Menu>

      <h2>Sản phẩm dành cho {gender === "nam" ? "Nam" : "Nữ"}</h2>

      {loading ? (
        <p className="loading">Đang tải sản phẩm...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="product-item-link">
                    <div className="product-item">
                      <img
                        src={`${BASE_URL}/uploads/products/${product.images}`}
                        alt={product.name}
                        className="product-image img-fluid"
                      />
                      <div className="product-actions">
                        <button className="add-to-cart-icon">
                          <FaShoppingCart size={25} style={{ color: "white" }} />
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.short_description}</p>
                      <div className="product-footer">
                        <p className="product-price">{formatPrice(product.price)}</p>
                        <button className="btn-buy">Mua ngay</button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GenderMenu;
