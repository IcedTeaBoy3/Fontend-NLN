import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-9xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">
        Oops! Trang bạn tìm không tồn tại.
      </h2>
      <p className="text-gray-500 mt-2">
        Trang bạn đang cố truy cập có thể đã bị xóa hoặc không tồn tại.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
      >
        Quay về Trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage;
