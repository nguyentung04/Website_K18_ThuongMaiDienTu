import React, { useState } from 'react';
import { Box, Image, Text, Button, Flex } from "@chakra-ui/react";

const products = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "100.000 VND",
    image: "https://linktoimage1.com",
  },
  // ... other products
];

const itemsPerPage = 4;

const SimilarProducts = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNext = () => {
    setCurrentPage((prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentPage((prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box className="container-Similar-product">
      <Box className="related-products big-title">
        <Text as="h2">SẢN PHẨM TƯƠNG TỰ</Text>
      </Box>
      <Flex className="carousel-container" position="relative">
        <Flex className="carousel-wrapper">
          {currentProducts.map((product) => (
            <Box key={product.id} className="carousel-item" m={2}>
              <Image src={product.image} alt={product.name} />
              <Text>{product.id}</Text>
              <Text as="h3">{product.name}</Text>
              <Text>{product.price}</Text>
            </Box>
          ))}
        </Flex>
        <Button className="carousel-button prev" onClick={handlePrev} position="absolute" left={0}>
          ❮
        </Button>
        <Button className="carousel-button next" onClick={handleNext} position="absolute" right={0}>
          ❯
        </Button>
      </Flex>
    </Box>
  );
};

export default SimilarProducts;