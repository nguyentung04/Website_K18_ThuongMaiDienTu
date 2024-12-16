import React, { useState } from 'react';

const CustomCheckbox = ({ id, label, onChange, checked }) => {
  // Sử dụng state để theo dõi trạng thái của checkbox
  const [isChecked, setIsChecked] = useState(checked);

  // Hàm xử lý thay đổi trạng thái checkbox
  const handleChange = (event) => {
    const newChecked = event.target.checked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <li>
      <label htmlFor={id} style={{ position: 'relative', paddingLeft: '30px', cursor: 'pointer', userSelect: 'none' }}>
        <input
          className="custom-checkbox"
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        <span
          style={{
            content: '',
            position: "absolute",
            left:" 0",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px", backgroundColor: isChecked ? '#b29c6e' : '#fff',
            border: "2px solid #b29c6e", /* Màu khung của checkbox */
            background: "#fff", /* Màu nền của checkbox */
            borderRadius:" 4px", /* Bo tròn góc của checkbox */
          }}
        >
          {isChecked && <span style={{
         content: '',
         position: "absolute",
         left:" 2.5px",
         top: "19%",
         transform: "translateY(-50%)",
         width: "12px",
         height:" 6px",
         border: "solid #fff",
         borderWidth:" 0 0 2px 2px",
         transform: "rotate(-54deg)",
          }} />}
        </span>
        {label}
      </label>
    </li>
  );
};

export default CustomCheckbox;
