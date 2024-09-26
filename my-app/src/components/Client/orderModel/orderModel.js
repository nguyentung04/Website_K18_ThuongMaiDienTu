import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Heading,
  Input,
  Divider,
  Text,
  Img,
  Flex,
  FormErrorMessage,
  Select,
  FormLabel,
  FormControl,
  Textarea,
  ModalCloseButton,
} from "@chakra-ui/react";


const OrderModal = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  errors,
  quantity,
  decreaseQuantity,
  increaseQuantity,
  selectedProduct,
  formatPrice,
}) => {
  console.log(selectedProduct);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="1200px">
        <ModalHeader>Thông tin giao hàng</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mx="auto" p={4}>
            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              {/* Form Section */}
              <Box flex={7}>
                <form onSubmit={handleSubmit}>
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
                    <FormControl flex={1} isInvalid={errors.email}>
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

                    <FormControl flex={1} isInvalid={errors.phone}>
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
                        {/* Map provinces here */}
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
                      <option value="COD">Thanh toán khi giao hàng (COD)</option>
                      <option value="bankTransfer">Chuyển khoản</option>
                    </Select>
                    {errors.paymentMethod && (
                      <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Button type="submit" className="button_order">Đặt hàng</Button>
                </form>
              </Box>

              {/* Product Summary Section */}
              {selectedProduct && (
                <Box flex={5}>
                  <Box background="#e4cc972e" mb="40px" p="20px" borderRadius="6px">
                    <Flex justifyContent="space-between" columnGap="30px">
                      <Img
                        src={`/uploads/products/${selectedProduct.image}`}
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
                            <Button size="sm" variant="outline" onClick={decreaseQuantity}>
                              -
                            </Button>
                            <Input
                              px={2}
                              value={quantity}
                              readOnly
                              textAlign="center"
                              width="60px"
                            />
                            <Button size="sm" variant="outline" onClick={increaseQuantity}>
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
          <Button colorScheme="blue" onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;
