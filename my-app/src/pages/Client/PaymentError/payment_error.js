import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const PaymentError = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="red.50"
      p={5}
    >
      <Heading as="h1" size="xl" mb={4} color="red.600">
        Payment Failed
      </Heading>
      <Text fontSize="lg" mb={6} color="red.500">
        Unfortunately, your payment could not be processed. Please try again.
      </Text>
      <Button colorScheme="red" onClick={handleRetry}>
        Retry Payment
      </Button>
    </Box>
  );
};

export default PaymentError;
