import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status="403"
        title="403 - Truy cập bị từ chối"
        subTitle="Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang chủ."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay về Trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default UnauthorizedPage;
