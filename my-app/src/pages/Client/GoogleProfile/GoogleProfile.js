import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const googleId = JSON.parse(localStorage.getItem('googleUser'))?.id;

    if (googleId) {
      axios
        .get(`http://localhost:3000/api/userByGoogleId/${googleId}`)
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((err) => {
          setError('Không thể lấy thông tin người dùng');
          console.error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setError('Không tìm thấy thông tin người dùng.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h1>Thông tin người dùng</h1>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Google ID:</strong> {user.google_id}</p>
        </div>
      ) : (
        <p>Không tìm thấy người dùng với google_id này.</p>
      )}
    </div>
  );
};

export default GoogleProfile;
