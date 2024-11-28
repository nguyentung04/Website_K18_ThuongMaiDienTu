// React component: components/MomoPayment.js
import React, { useState } from 'react';
import "./MomoPayment .css";
const MomoPayment = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/momo/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: parseInt(amount) })
            });

            const data = await response.json();
            
            if (data.payUrl) {
                window.location.href = data.payUrl;
            } else {
                alert('Có lỗi xảy ra khi tạo thanh toán');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Thanh toán MoMo</h2>
            <form onSubmit={handlePayment}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Số tiền (VND)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Nhập số tiền"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-pink-500 text-white py-2 rounded-lg ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'
                    }`}
                >
                    {loading ? 'Đang xử lý...' : 'Thanh toán với MoMo'}
                </button>
            </form>
        </div>
    );
};

export default MomoPayment;