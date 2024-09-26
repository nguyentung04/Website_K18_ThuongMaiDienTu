// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Input,
//   FormControl,
//   FormLabel,
//   Heading,
//   Select,
//   FormErrorMessage,
//   useToast,
// } from "@chakra-ui/react";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchUserById, updateUser } from "../../../../service/api/users";
// import axios from "axios";

// const EditUser = () => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [image, setImage] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("");
//   const toast = useToast();
//   const { id } = useParams();
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     const newErrors = {};
//     if (!name) newErrors.name = "Họ tên là bắt buộc.";
//     if (!email) newErrors.email = "Tài khoản là bắt buộc.";
//     else if (!/\S+@\S+\.\S+/.test(email))
//       newErrors.email = "Tài khoản không hợp lệ.";
//     if (!phone) newErrors.phone = "Số điện thoại là bắt buộc.";
//     else if (!/^\d{10}$/.test(phone))
//       newErrors.phone = "Số điện thoại không hợp lệ.";
//     if (!role) newErrors.role = "Phân quyền là bắt buộc.";
//     return newErrors;
//   };

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const data = await fetchUserById(id);
//         if (data) {
//           setUser(data);
//           setName(data.name || "");
//           setPassword(data.password || "");
//           setEmail(data.email || "");
//           setUsername(data.username || "");
//           setPhone(data.phone || "");
//           setRole(data.role || "");
//           setImage(data.image || "");
//         }
//       } catch (error) {
//         toast({
//           title: "Error fetching user.",
//           description: "Failed to fetch user details.",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//         });
//         console.error("Failed to fetch user:", error);
//       }
//     };
//     getUser();
//   }, [id, toast]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = validate();
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length > 0) {
//       return;
//     }

//     let imageUrl = image;

//     if (imageFile) {
//       const formData = new FormData();
//       formData.append("file", imageFile);

//       try {
//         const response = await axios.post(
//           `http://localhost:3000/api/upload/users`,
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         imageUrl = response.data.filePath;
//       } catch (error) {
//         toast({
//           title: "Image Upload Error",
//           description: "Failed to upload image.",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//         });
//         return;
//       }
//     }

//     try {
//       const userData = {
//         name,
//         password,
//         username,
//         email,
//         phone,
//         role,
//         image: imageUrl,
//       };
//       await updateUser(id, userData);
//       toast({
//         title: "User updated.",
//         description: "User details have been updated successfully.",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//       });
//       navigate("/admin/user");
//     } catch (error) {
//       console.error("Update error:", error);
//       toast({
//         title: "Error updating user.",
//         description: error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleCancel = () => {
//     navigate("/admin/user");
//   };

//   return (
//     <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
//       <Heading mb={5}>Sửa thông tin</Heading>
//       <FormControl id="name" mb={4} isInvalid={errors.name}>
//         <FormLabel>Họ tên</FormLabel>
//         <Input value={name} onChange={(e) => setName(e.target.value)} />
//         <FormErrorMessage>{errors.name}</FormErrorMessage>
//       </FormControl>
//       <FormControl id="email" mb={4} isInvalid={errors.email}>
//         <FormLabel>Tài khoản</FormLabel>
//         <Input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <FormErrorMessage>{errors.email}</FormErrorMessage>
//       </FormControl>
//       <FormControl id="phone" mb={4} isInvalid={errors.phone}>
//         <FormLabel>Số điện thoại</FormLabel>
//         <Input
//           type="text"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//         <FormErrorMessage>{errors.phone}</FormErrorMessage>
//       </FormControl>
//       <FormControl id="role" mb={4} isInvalid={errors.role}>
//         <FormLabel>Phân quyền</FormLabel>
//         <Select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="Admin">Admin</option>
//           <option value="User">User</option>
//         </Select>
//         <FormErrorMessage>{errors.role}</FormErrorMessage>
//       </FormControl>
      
//       <FormControl id="image" mb={4}>
//         <FormLabel>Ảnh</FormLabel>
//         <Input type="file" onChange={handleImageChange} />
//       </FormControl>
//       <Button colorScheme="teal" mr="10px" onClick={handleSubmit}>
//         Đồng ý
//       </Button>
//       <Button colorScheme="gray" onClick={handleCancel}>
//         Hủy
//       </Button>
//     </Box>
//   );
// };

// export default EditUser;
 

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Select,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserById, updateUser } from "../../../../service/api/users";


const EditUser = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Họ tên là bắt buộc.";
    if (!email) newErrors.email = "Tài khoản là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Tài khoản không hợp lệ.";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";
    if (!role) newErrors.role = "Phân quyền là bắt buộc.";
    return newErrors;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserById(id);
        if (data) {
          setUser(data);
          setName(data.name || "");
          setPassword(data.password || "");
          setEmail(data.email || "");
          setUsername(data.username || "");
          setPhone(data.phone || "");
          setRole(data.role || "");
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tìm nạp người dùng.",
          description: "Không lấy được thông tin chi tiết của người dùng.",
          status: "lỗi",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch user:", error);
      }
    };
    getUser();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

   

    try {
      const userData = {
        name,
        password,
        username,
        email,
        phone,
        role,
      };
      await updateUser(id, userData);
      toast({
        title: "User updated.",
        description: "User details have been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/user");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error updating user.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };



  const handleCancel = () => {
    navigate("/admin/user");
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Heading mb={5}>Sửa thông tin</Heading>
      <FormControl id="name" mb={4} isInvalid={errors.name}>
        <FormLabel>Họ tên</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl id="email" mb={4} isInvalid={errors.email}>
        <FormLabel>Tài khoản</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>
      <FormControl id="phone" mb={4} isInvalid={errors.phone}>
        <FormLabel>Số điện thoại</FormLabel>
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <FormErrorMessage>{errors.phone}</FormErrorMessage>
      </FormControl>
      <FormControl id="role" mb={4} isInvalid={errors.role}>
        <FormLabel>Phân quyền</FormLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="aser">User</option>
        </Select>
        <FormErrorMessage>{errors.role}</FormErrorMessage>
      </FormControl>
      
      
      <Button colorScheme="teal" mr="10px" onClick={handleSubmit}>
        Đồng ý
      </Button>
      <Button colorScheme="gray" onClick={handleCancel}>
        Hủy
      </Button>
    </Box>
  );
};

export default EditUser;