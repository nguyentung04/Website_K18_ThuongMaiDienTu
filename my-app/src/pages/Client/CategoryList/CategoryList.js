import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../../service/api/Category";
import { Link } from "react-router-dom";
const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadCategories = async () => {
        try {
          const data = await fetchCategories();
          setCategories(data);
        } catch (error) {
          setError("Không thể tải danh sách danh mục.");
        } finally {
          setLoading(false);
        }
      };
  
      loadCategories(); // Gọi API khi component được render
    }, []);
  
    if (loading) {
      return <p>Đang tải danh sách...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }
  
    return (
      <div>
        <h1>Danh sách tên loại sản phẩm</h1>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/categories/${category.id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default CategoryList;
