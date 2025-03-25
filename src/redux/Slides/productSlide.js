import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  products: [],
  filterProducts: [],
  selectedPrice: "Tất cả", // Lưu bộ lọc giá hiện tại
  selectedStar: "Tất cả",  // Lưu bộ lọc sao hiện tại
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;
    },
    updateProduct: (state, action) => {
      state.products = action.payload;
      state.filterProducts = action.payload; // Cập nhật luôn filterProducts khi có sản phẩm mới
    },
    filterProductByPrice: (state, action) => {
      const price = action.payload;

      // Lọc trên products thay vì filterProducts
      switch (price) {
        case "Từ 0 - 2tr":
          state.filterProducts = state.products.filter(
            (product) => product.price >= 0 && product.price <= 2000000
          );
          break;
        case "2tr - 10tr":
          state.filterProducts = state.products.filter(
            (product) => product.price >= 2000000 && product.price <= 10000000
          );
          break;
        case "10tr - 20tr":
          state.filterProducts = state.products.filter(
            (product) => product.price >= 10000000 && product.price <= 20000000
          );
          break;
        case "20tr - 30tr": // Thêm khoảng bị thiếu
          state.filterProducts = state.products.filter(
            (product) => product.price >= 20000000 && product.price <= 30000000
          );
          break;
        case "30tr - 50tr": // Sửa lại khoảng giá
          state.filterProducts = state.products.filter(
            (product) => product.price >= 30000000 && product.price <= 50000000
          );
          break;
        case "trên 50tr":
          state.filterProducts = state.products.filter(
            (product) => product.price >= 50000000
          );
          break;
        case "Tất cả":
          state.filterProducts = state.products; // Hiển thị tất cả sản phẩm
          break;
        default:
          state.filterProducts = state.products; // Tránh trường hợp không lọc được
          break;
      }
    },
    filterProductByStar: (state, action) => {
      const star = action.payload;
      
      if (star === 0 || star === "Tất cả") {
        // Nếu chọn "Tất cả", hiển thị lại toàn bộ sản phẩm
        state.filterProducts = state.products;
      } else {
        state.filterProducts = state.products.filter(
          (product) => product.rating >= star && product.rating < star + 1
        );
      }
    }
    
  },
});

export const { searchProduct, updateProduct, filterProductByPrice,filterProductByStar  } =
  productSlice.actions;
export default productSlice.reducer;
