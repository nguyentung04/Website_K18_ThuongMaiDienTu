import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import "./best_selling_products.css";

import { Autoplay } from "swiper/modules"; // Import Autoplay module
import OrderModal from "../../../../../components/Client/orderModel/orderModel";
const BASE_URL = "http://localhost:3000";

const BestSellingProducts = () => {
  const [featuredProducts, setbest_selling_products] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    note: "",
    paymentMethod: "COD",
  });
  const [errors, setErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Updated state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredResponse = await axios.get(
          `${BASE_URL}/api/products_khuyenmai`
        );
        setbest_selling_products(featuredResponse.data);
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleLike = (productId) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
    // Form validation and submit logic
  };
  const handleCloseModal = () => setIsOpen(false);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const increaseQuantity = () => setQuantity(quantity + 1);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };


  const handleAddToCartAndOpenModal = (e, product) => {
    e.stopPropagation(); // Prevent the event from triggering the product link
    addToCart(product); // Call the function to add the product to the cart
    handleOpenModal(product); // Open the modal with the product details
  };
  const addToCart = (product) => {
    if (product) {
      const details = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        quantity: quantity,
      };
  
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id
      );
  
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
      } else {
        cart.push(details);
      }
  
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderProductList = (products) => {
    return products.map((product) => {
      const discountPercentage = product.discountPrice
        ? Math.round(
            ((product.price - product.discountPrice) / product.price) * 100
          )
        : 0;

      return (
        <div
          className="swiper-wrappe"
          style={{
            display: "flex",
            width: "312px",
            marginBottom: "4px",
          }}
          key={product.id}
        >
          <div className="swiper-slide swiper-slide-active">
            <div className="product-box h-100 bg-gray relative">
              <button
                className="like-icon"
                onClick={() => toggleLike(product.id)}
              >
                <HeartIcon
                  size="24px"
                  color={
                    likedProducts.includes(product.id) ? "#b29c6e" : "white"
                  }
                />
              </button>
              <button
                className="add-to-cart-icon"
                onClick={(e) => handleAddToCartAndOpenModal(e, product)}
              >
                <FaShoppingCart
                  size="25"
                  style={{
                    color: "white",
                    stroke: "#b29c6e",
                    strokeWidth: 42,
                  }}
                />
              </button>
              <div className="product-box">
                <a href={`/product/${product.id}`} className="plain">
                  <div className="product-image">
                    <img
                      src={`${BASE_URL}/uploads/products/${product.image}`}
                      alt={product.name}
                    />
                  </div>
                  <div className="product-info">
                    <p className="product-title">{product.name}</p>
                    <div className="product-price">
                      {product.discountPrice ? (
                        <>
                          <div className="itproduct__discount">
                            <p
                              style={{
                                textDecoration: "line-through",
                                color: "gray",
                              }}
                            >
                              {formatPrice(product.price)}{" "}
                            </p>{" "}
                            <span style={{ marginLeft: "8px" }}>
                              -{discountPercentage}%
                            </span>
                          </div>
                          <p>{formatPrice(product.discountPrice)}</p>
                        </>
                      ) : (
                        <p>{formatPrice(product.price)}</p>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="best_selling_products">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>sản phẩm khuyến mãi</h2>
        </div>
      </div>
      <div className="products_blocks_wrapper">
        <Swiper
          spaceBetween={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={3000}
          modules={[Autoplay]}
          className="main-slider"
          slidesPerView={4}
        >
          {loading ? (
            <SwiperSlide>Loading...</SwiperSlide>
          ) : (
            featuredProducts.map((product, index) => (
              <SwiperSlide key={index} style={{ display: "flex" }}>
                {renderProductList([product])}
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
{/* 
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent maxW="1200px">
          <ModalHeader>Thông tin giao hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mx="auto" p={4}>
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                <Box flex={7}>
                  <form onSubmit={handleAddToCartAndOpenModal}>
                    <FormControl mb={3} isInvalid={errors.name}>
                      <FormLabel htmlFor="name">Tên khách hàng</FormLabel>
                      <Input
                        className="custom-input"
                        id="name"
                        placeholder="Nhập tên khách hàng"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      )}
                    </FormControl>

                    <Flex mb={3} gap={4}>
                      <FormControl mb={3} flex={1} isInvalid={errors.email}>
                        <FormLabel htmlFor="email">Địa chỉ email</FormLabel>
                        <Input
                          className="custom-input"
                          id="email"
                          placeholder="Địa chỉ email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl mb={3} flex={1} isInvalid={errors.phone}>
                        <FormLabel htmlFor="phone">Số điện thoại</FormLabel>
                        <Input
                          className="custom-input"
                          type="number"
                          id="phone"
                          placeholder="Số điện thoại"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <FormErrorMessage>{errors.phone}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                    <Flex mb={3} gap={4}>
                      <FormControl flex={1} isInvalid={errors.province}>
                        <FormLabel htmlFor="province">Tỉnh</FormLabel>
                        <Select
                          className="custom-input"
                          id="province"
                          value={formData.province}
                          onChange={handleChange}
                        >
                          <option value="">Chọn Tỉnh</option>
                        </Select>
                        {errors.province && (
                          <FormErrorMessage>{errors.province}</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl flex={1} isInvalid={errors.city}>
                        <FormLabel htmlFor="city">Thành phố</FormLabel>
                        <Select
                          className="custom-input"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!formData.province}
                        >
                          <option value="">Chọn Thành phố</option>
                        </Select>
                        {errors.city && (
                          <FormErrorMessage>{errors.city}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                    <FormControl mb={3} isInvalid={errors.address}>
                      <FormLabel htmlFor="address">Địa chỉ nhận hàng</FormLabel>
                      <Input
                        className="custom-input"
                        id="address"
                        placeholder="Nhập địa chỉ nhận hàng"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl mb={3}>
                      <FormLabel htmlFor="note">Ghi chú</FormLabel>
                      <Textarea
                        className="custom-input"
                        id="note"
                        rows={3}
                        placeholder="Nhập ghi chú"
                        value={formData.note}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl mb={3} isInvalid={errors.paymentMethod}>
                      <FormLabel htmlFor="paymentMethod">
                        Phương thức thanh toán
                      </FormLabel>
                      <Select
                        className="custom-input"
                        id="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="COD">
                          Thanh toán khi giao hàng (COD)
                        </option>
                        <option value="bankTransfer">Chuyển khoản</option>
                      </Select>
                      {errors.paymentMethod && (
                        <FormErrorMessage>
                          {errors.paymentMethod}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <Button type="submit" className="button_order">
                      Đặt hàng
                    </Button>
                  </form>
                </Box>

                {selectedProduct && (
                  <Box flex={5}>
                    <Box
                      background="#e4cc972e"
                      mb="40px"
                      p="20px"
                      borderRadius="6px"
                    >
                      <Flex justifyContent="space-between" columnGap="30px">
                        <Img
                          src={`${BASE_URL}/uploads/products/${selectedProduct.image}`}
                          alt={selectedProduct.name}
                          maxWidth="114px"
                        />
                        <Box width="78%">
                          <Heading as="h5" size="sm" mb={2}>
                            {selectedProduct.name}
                          </Heading>
                          <Text>MSP: {selectedProduct.id}</Text>
                          <Flex justify="space-between" align="center" my={4}>
                            <Flex align="center" gap={1}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={decreaseQuantity}
                              >
                                -
                              </Button>
                              <Input
                                px={2}
                                value={quantity}
                                readOnly
                                textAlign="center"
                                width="60px"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={increaseQuantity}
                              >
                                +
                              </Button>
                            </Flex>
                            <Text fontWeight="bold">
                              {selectedProduct.discountPrice
                                ? formatPrice(selectedProduct.discountPrice)
                                : formatPrice(selectedProduct.price)}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <Divider borderColor="black" />
                      <Box display="flex" justifyContent="space-between">
                        <Text my={3}>Vận chuyển:</Text>
                        <Text my={3}>Miễn phí</Text>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Heading as="h5" size="sm">
                          Tổng cộng:
                        </Heading>
                        <Heading as="h5" size="sm">
                            {selectedProduct.discountPrice
                              ? formatPrice(
                                  selectedProduct.discountPrice * quantity
                                )
                              : formatPrice(selectedProduct.price * quantity)}
                        </Heading>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
            <OrderModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmitModel}
        errors={errors}
        quantity={quantity}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        selectedProduct={selectedProduct}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default BestSellingProducts;
