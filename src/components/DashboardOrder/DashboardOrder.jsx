
import { Button } from 'antd'
import { WarpperHeader } from './style.js'
import  TableComponent  from '../TableComponent/TableComponent.jsx'
import { useState } from 'react'
import InputComponent from '../InputComponent/InputComponent.jsx'
import {useQueryHook } from '../../hooks/useMutationHook.js'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import { orderConstant } from '../../../constant.js'
import { useRef } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
const DashboardOrder = () => {
  const naviagte = useNavigate()
  
  // Lấy token ra
  const user =  useSelector(state => state.user)

  // Seach filter sort table
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInputNew = useRef(null)

 
  const getAllOrders = async () => {
    const res = await OrderService.getAllOrderAdmin(user?.access_token)
    return res
  }
  const queryGetAllOrders= useQueryHook(['orders'],getAllOrders)
  const { data: dataOrder, isLoadingOrder } = queryGetAllOrders
  // fix lỗi lần đầu tiên chưa có data
  

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInputNew}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => searchInputNew.current?.select(), 100);
          }
        },
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });
  const columns = [
    {
      title: 'Name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Is Paid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid - b.isPaid,
      
    },
    {
      title: 'Is Delivered',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered - b.isDelivered,
      
    },
    {
      title: 'Shipping Method',
      dataIndex: 'shippingMethod',
      sorter: (a, b) => a.shippingMethod - b.shippingMethod,
     
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod - b.paymentMethod,
     
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <div style={{display:'flex',gap:'10px'}}>
          <Button type="primary" 
            onClick={() => {
            naviagte(`/detail-order-admin/${record.key}`)
          }}
          >Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];
  const dataTable = dataOrder?.data?.length && dataOrder?.data?.map((order) => {
    return {
      key: order?._id,
      userName: order?.shippingAddress.fullName,
      isPaid: order?.isPaid ? 'Paid' : 'Not Paid',
      isDelivered: order?.isDelivered ? 'Delivered' : 'Not Delivered',
      shippingMethod: orderConstant.shippingMethod[order?.shippingMethod],
      paymentMethod: orderConstant.paymentMethod[order?.paymentMethod],
      totalPrice: order?.totalPrice,
    };
  });

  return (
    <div>
      <WarpperHeader>
        Quản lý đơn hàng
      </WarpperHeader>
      <div style={{marginTop:'20px',borderTop:'1px solid rgb(26,148,255)'}}>

        <TableComponent 
          selectionType={"Checkbox"} 
          dataSource={dataTable} 
          isLoading={isLoadingOrder} 
          columns={columns}
          // handleDeleteMany= {handleDeleteMany}
          nameExcel="Danh_sach_don_hang"
        /> 
      </div>
      
    </div>
  )
}

export default DashboardOrder