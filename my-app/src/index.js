// index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Thay đổi từ 'react-dom' sang 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const root = ReactDOM.createRoot(document.getElementById('root')); // Sử dụng createRoot để tạo root
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
