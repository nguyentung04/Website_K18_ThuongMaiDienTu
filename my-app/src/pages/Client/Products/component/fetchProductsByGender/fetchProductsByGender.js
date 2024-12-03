import React, { useEffect, useState } from "react";
import { fetchProductsByGender } from "../../../../../service/api/products";

const ProductsByGender = ({ gender }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProductsByGender(gender); // 'nam' hoặc 'nữ'
        setProducts(data);
      } catch (error) {
        setError("Không thể tải sản phẩm");
      }
    };

    getProducts();
  }, [gender]);

  return (
    <div>
      {error && <p>{error}</p>}
      <h2>Sản phẩm dành cho {gender === 'nam' ? 'Nam' : 'Nữ'}</h2>
      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.short_description}</p>
              <p>{product.price} VND</p>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm</p>
        )}
      </div>
    </div>
  );
};

export default ProductsByGender;
