import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct(state, action) {
      const { orderItems } = action.payload;
    
      // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItemIndex = state.orderItems.findIndex(
        (item) => item.product === orderItems.product
      );
    
      if (existingItemIndex !== -1) {
        // Lấy sản phẩm hiện tại trong giỏ hàng
        const existingItem = state.orderItems[existingItemIndex];
        const newAmount = existingItem.amount + orderItems.amount;
    
       
        
        // Cập nhật số lượng sản phẩm
        state.orderItems[existingItemIndex] = { ...existingItem, amount: newAmount};
      } else {
        
        state.orderItems.push(orderItems);
      }

    },
    
    updatePrice(state, action) {
      const { itemsPrice, shippingPrice, totalPrice } = action.payload;
      state.itemsPrice = itemsPrice;
      state.shippingPrice = shippingPrice;
      state.totalPrice = totalPrice;
    },

    updateOrderProduct(state, action) {
      const { product, amount } = action.payload;
      const itemIndex = state.orderItems.findIndex((item) => item.product === product);
      const itemIndexSelected = state.orderItemsSelected.findIndex((item) => item.product === product);
      if (itemIndex !== -1) {
        state.orderItems[itemIndex].amount = amount;
      }

      if (itemIndexSelected !== -1) {
        state.orderItemsSelected[itemIndexSelected].amount = amount;
      }
    },

    removeOrderProduct(state, action) {
      const product = action.payload;
      
      state.orderItems = state.orderItems.filter((item) => item.product !== product);
      state.orderItemsSelected = state.orderItemsSelected.filter((item) => item.product !== product);
    },
    removeMultipleOrderProducts: (state, action) => {
      state.orderItems = state.orderItems.filter(item => !action.payload.includes(item.product));
      state.orderItemsSelected = state.orderItemsSelected.filter(item => !action.payload.includes(item.product));
    },
    selectedOrder: (state, action) => {
      const { selectedProducts } = action.payload;
      state.orderItemsSelected = state.orderItems.filter(item =>
        selectedProducts.includes(item.product)
      );
          
    },
    resetOrderState: (state) => {
      state.orderItems = [];
      state.orderItemsSelected = [];
      state.shippingAddress = {};
      state.paymentMethod = "";
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      state.user = '';
      state.isPaid = false;
      state.paidAt = '';
      state.isDelivered = false;
      state.deliveredAt = '';
    },
  },
});

export const { addOrderProduct, updateOrderProduct, removeOrderProduct, removeMultipleOrderProducts,updatePrice,selectedOrder,resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
