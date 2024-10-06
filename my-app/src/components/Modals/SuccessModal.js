import React from 'react';
import './Modal.css';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content success">
        <h2>Thành công</h2>
        <p>{message}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default SuccessModal;
