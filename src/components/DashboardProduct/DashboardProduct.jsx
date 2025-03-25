// import React from 'react'
import { Button, Form, InputNumber, Select  } from 'antd'
import { WarpperHeader } from './style.js'
import { DeleteOutlined, EditOutlined, PlusOutlined,SearchOutlined} from '@ant-design/icons'
import  TableComponent  from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent.jsx'
import { useEffect, useState, useRef  } from 'react'
import { WarpperUploadFile } from './style.js'
import { getBase64, renderOptions } from '../../utils.js'
import { useMutationHook,useQueryHook } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import * as Message from '../Message/Message'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import { useSelector } from 'react-redux'
import DrawerComponent from '../DrawerComponent/DrawerComponent.jsx'
import ModalComponent from '../ModalComponent/ModalComponent.jsx'
import { useQuery } from '@tanstack/react-query'


// import { Highlighter } from 'react-table'
import {  Space } from 'antd'
const DashboardProduct = () => {
  // Lưu trạng thái sản phẩm để tạo sản phẩm
  const initial =() => ({
    name: '',
    type: '',
    countInStock: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    discount: '',
    newType: ''
  })
  const [stateProduct, setStateProduct] = useState({
    name: '',
    type: '',
    countInStock: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    discount: '',
    newType: ''
  })
  // Lưu chi tiết một sản phẩm
  const [stateDetailProduct, setStateDetailProduct] = useState({
    name: '',
    type: '',
    countInStock: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    discount: '',
    newType: ''
  })
  // Mở và đóng modal trạng thái tạo sản phẩm
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Mở và đóng drawer cập nhật sản phẩm
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  // Mở và đóng modal trạng thái xoá sản phẩm
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  // Lưu trạng thái row được chọn
  const [rowSelected, setRowSelected] = useState('')
  // 
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  // Lấy token ras
  const user =  useSelector(state => state.user)
  // Lưu trạng thái select
  const [typeSelect, setTypeSelect] = useState('')
  // Lưu số sản phẩm hiển thị
  const [limit,setLimit] = useState(20)

  // Tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  // lấy form
  const [formCreate] = Form.useForm()
  const [formUpdate] = Form.useForm()

  // Gọi API tạo sản phẩm
  const mutation = useMutationHook((data) => {
    const { access_token, ...rests } = data
    return ProductService.createProduct(rests,access_token)
  })
  const { data, isPending } = mutation
  // Gọi API cập nhật sản phẩm
  const mutationUpdate = useMutationHook((data) => {
    const { id,access_token, ...rests } = data
    return ProductService.updateProduct(id,rests,access_token)
  })
  const { data: dataUpdate, isPending: isPendingUpdate } = mutationUpdate
  // Gọi API xoá sản phẩm
  const mutationDelete = useMutationHook((data) => {
    const { id,access_token } = data
    return ProductService.deleteProduct(id,access_token)
  })
  const { data: dataDelete, isPending: isPendingDelete } = mutationDelete
  // Gọi API lấy tất cả sản phẩm
  const getAllProducts = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const res = await ProductService.getAllProducts('',limit)
    return res
  }
  const queryProduct= useQuery({
    queryKey:['products',limit],
    queryFn:getAllProducts,
    retry: 3,
    retryDelay: 1000,
  })
  const { data: dataProduct, isLoading } = queryProduct
  // Gọi API lấy tất cả loại sản phẩm
  const fetchAllProductsType = async () => {
    const res = await ProductService.getAllProductsType()
    return res
  }
  const queryProductType = useQueryHook(['productsType'],fetchAllProductsType)
  const { data: dataProductType,isLoadingProductType } = queryProductType
  
  // Gọi API lấy chi tiết sản phẩm
  const getDetailProduct = async (id) => {
    const res = await ProductService.getDetailProduct(id)
    if(res?.data){
      setStateDetailProduct({
        ...res.data
      })
    }
    setIsLoadingUpdate(false)
  }
  // Gọi API xoá nhiều sản phẩm
  const mutationDeleteMany = useMutationHook((data) => {
    const { access_token,...ids } = data
    return ProductService.deleteManyProducts(ids,access_token) 
  })


  // Xử lý khi xoá nhiều sản phẩm
  const handleDeleteMany = (ids) => {
    mutationDeleteMany.mutate({ids,access_token:user?.access_token},{
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

 
  const handleDetailProduct = () => {

    setIsOpenDrawer(true)
  }
  // fix lỗi lần đầu tiên không hiển thị dữ liệu
  useEffect(() => {
    if(rowSelected){
      getDetailProduct(rowSelected)
      setIsLoadingUpdate(true)
    }
  },[rowSelected])
  // set lại dữ liệu trong form
  useEffect(() => {
    formUpdate.setFieldsValue(stateDetailProduct)

  },[formUpdate,stateDetailProduct])
  // 2 cái nút sửa và xoá
  const renderActions = () => {
    return (
      <div style={{display:'flex',gap:'10px'}}>
        <Button type="primary" className='bg-blue-500' onClick={handleDetailProduct}><EditOutlined style={{fontSize:'20px'}}/></Button>
        <Button type="primary" danger onClick={() => setIsModalOpenDelete(true)}><DeleteOutlined style={{fontSize:'20px'}} /></Button>
      </div>
    )
  }
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
          ref={searchInput}
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
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
    }
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
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a,b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a,b) => a.type.length - b.type.length,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a,b) => a.price - b.price,
      filters: [
        {
          text: 'Từ 0 đến 5tr',
          value: '0-5',
        },
        {
          text: 'Từ 5tr đến 10tr',
          value: '5-10',
        },
        {
          text: 'Từ 10tr đến 20tr',
          value: '10-20',
        },
        {
          text: 'Từ 20tr đến 50tr',
          value: '20-50',
        },
        {
          text: 'Trên 50tr',
          value: '>=',
        }

      ],
      onFilter: (value, record) => {
        if(value === '0-5'){
          return record.price >= 0 && record.price <= 5000000
        }else if(value === '5-10'){
          return record.price >= 5000000 && record.price <= 10000000
        }else if(value === '10-20'){
          return record.price >= 10000000 && record.price <= 20000000
        }else if(value === '20-50'){
          return record.price >= 20000000 && record.price <= 50000000
        }else if(value === '>='){
          return record.price >= 50000000
        }
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a,b) => a.rating - b.rating,
      filters: [
        {
          text: 'Rating >= 3',
          value: '>=',
        },
        {
          text: 'Rating < 3',
          value: '<',
        },
      ],
      onFilter: (value, record) => {
        if(value === '>='){
          return record.rating >= 3
        }else if(value === '<'){
          return record.rating < 3
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderActions,
    },
  ];
  const dataTable = dataProduct?.data?.length && dataProduct?.data?.map((product) => {
    return {
      key: product._id,
      name: product.name,
      type: product.type,
      price: product.price,
      rating: product.rating,
    };
  });

  
  // Xử lý khi tạo sản phẩm thành công
  useEffect(() => {
    
    if(data?.status === 'success'){
      Message.success('Tạo sản phẩm thành công')
      handleCancel()
      mutation.reset()
    }else if(data?.status === 'error'){
      Message.error('Tạo sản phẩm thất bại')
      mutation.reset()
    }
  },[data])

  // Xử lý khi cập nhật sản phẩm thành công
  useEffect(() => {
    if(dataUpdate?.status === 'success'){
      Message.success('Cập nhật sản phẩm thành công')
      setIsOpenDrawer(false)
      mutationUpdate.reset()
    }else if(dataUpdate?.status === 'error'){
      console.log('error',);
      
      Message.error('Cập nhật sản phẩm thất bại')
    }
  },[dataUpdate])

  // Xử lý khi xoá sản phẩm thành công
  useEffect(() => {
    if(dataDelete?.status === 'success'){
      Message.success('Xoá sản phẩm thành công')
      handleCancelDelete()
    }else if(dataDelete?.status === 'error'){
      Message.error('Xoá sản phẩm thất bại')
    }
  },[dataDelete])


  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setStateProduct({
      name: '',
      type: '',
      countInStock: '',
      price: '',
      description: '',
      rating: '',
      image: ''
    })
    // Xoá dữ liệu trong form
    formCreate.resetFields()
    setIsModalOpen(false)
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  const handleOkDelete = () => {
    // setIsModalOpenDelete(false)
    mutationDelete.mutate({id:rowSelected,access_token:user?.access_token},{
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  // Xử lý khi thêm sản phấm
  const handleOnFinish = () => {
    const params = {
      name : stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    }
    mutation.mutate({...params,access_token:user?.access_token},{
      onSettled: () => {
        queryProduct.refetch()
      }
    })
    
  }

  // Xử lý khi cập nhật sản phẩm
  const handleOnUpdateProduct = () => {
    mutationUpdate.mutate({...stateDetailProduct,id:rowSelected,access_token:user?.access_token},{
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  // Xử lý khi đóng drawer
  const handleOnCloseDrawer = () => {
    // setStateDetailProduct({
    //   name: '',
    //   type: '',
    //   countInStock: '',
    //   price: '',
    //   description: '',
    //   rating: '',
    //   image: ''
    // })
    
    setIsOpenDrawer(false)
  }

  // Xử lý khi thay đổi input khi tạo sản phẩm
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }
  // Xử lý khi thay đổi input khi cập nhật sản phẩm
  const handleOnchangeDetail = (e, field) => {
    if (typeof e === 'object' && e.target) {
      // Trường hợp Input bình thường (e là event)
      setStateDetailProduct({
        ...stateDetailProduct,
        [e.target.name]: e.target.value,
      })
    } else {
      // Trường hợp InputNumber (e là giá trị, field là tên)
      setStateDetailProduct({
        ...stateDetailProduct,
        [field]: e,
      })
    }
  };
  const handleOnchangeAvatar = async ({ fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview){
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }
  const handleOnchangeAvatarDetail = async ({ fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview){
      file.preview = await getBase64(file.originFileObj);
    }
    setStateDetailProduct({
      ...stateDetailProduct,
      image: file.preview
    })
  }
  const handleChangeSelect = (value) => {
    
    setStateProduct({
      ...stateProduct,
      type: value
    })
  }
  
  return (
    <div>
      <WarpperHeader>
        Quản lý sản phẩm
      </WarpperHeader>
      <div style={{marginTop:'20px'}}>

        <Button 
          onClick={() => setIsModalOpen(true)}
          style={{ height: '150px', width:'150px', borderRadius:"6px", borderStyle:"dashed"}}>
          <PlusOutlined style={{ fontSize:'60px'}}/>
        </Button>
      </div>
      <div style={{marginTop:'20px',borderTop:'1px solid rgb(26,148,255)'}}>

        <TableComponent 
          nameExcel="Danh_sach_san_pham"
          selectionType={"Checkbox"} 
          dataSource={dataTable} 
          isLoading={isLoading} 
          columns={columns}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record.key)
              }, // click row
            }
          }}
          handleDeleteMany={handleDeleteMany}
        /> 
      </div>
      
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <LoadingComponent isLoading={isPending}>
          <Form
            name="formCreate"
            labelCol={{ span: 6}}
            wrapperCol={{span: 18}}
            style={{maxWidth: 800, padding: '20px'}}
            initialValues={{remember: true, }}
            onFinish={handleOnFinish}
            autoComplete="off"
            form={formCreate}
             
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào tên sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name"/>
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào loại sản phẩm!',
                },
              ]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                initialvalues="-- Chọn loại sản phẩm --"
                onChange={handleChangeSelect}
                options={renderOptions(dataProductType?.data)}

              />
            </Form.Item>
            { stateProduct.type === 'add_type' && (

              <Form.Item
                label="Thêm loại SP"
                name="newType"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập vào loại sản phẩm mới!',
                  },
                ]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType"/>
              </Form.Item>
            )}
            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào số lượng sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào giá sản phẩm!',
                }
                
              ]}
            >
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào mô tả sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/>
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào đánh giá sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating"/>
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giảm giá sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount"/>
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              
            >
              <div>
              
                <WarpperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                  <Button>Chọn file</Button>
                </WarpperUploadFile>
                { stateProduct?.image && 
                  <img 
                    src={stateProduct?.image} 
                    alt="avatar" 
                    style={{width:'60px',height:'60px',borderRadius:'50%',marginLeft:'10px'}}
                  />
                }
              </div>
              
            </Form.Item>
            

            <Form.Item label={null} wrapperCol={{ offset: 20, span: 4 }}>
              <Button type="primary" className='bg-blue-500' htmlType="submit" size='large'>
                Thêm
              </Button>
            </Form.Item> 
          </Form>
        </LoadingComponent>
      </ModalComponent>
      <DrawerComponent 
        title="Cập nhật sản phẩm" 
        placement="right" 
        isOpen={isOpenDrawer} 
        onClose={handleOnCloseDrawer}
        width={600}
        forceRender
      >
        <LoadingComponent isLoading={isPendingUpdate || isLoadingUpdate}>
          <Form
            name="formUpdate"
            labelCol={{ span: 6}}
            wrapperCol={{span: 18}}
            style={{maxWidth: 600, padding: '20px'}}
            initialValues={{remember: true, }}
            onFinish={handleOnUpdateProduct}
            autoComplete="off"
            form={formUpdate}
           
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào tên sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateDetailProduct.name} onChange={handleOnchangeDetail} name="name"/>
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào loại sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateDetailProduct.type} onChange={handleOnchangeDetail} name="type"/>
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào số lượng sản phẩm!',
                },
                { type: 'number', min: 0, message: 'Số lượng phải lớn hơn 0!' }
              ]}
            >
              <InputNumber 
                value={stateDetailProduct.countInStock} 
                onChange={(value) => handleOnchangeDetail(value, "countInStock")} 
                name="countInStock" 
                min={0} 
                style={{ width: '50%' }}
              />
            </Form.Item>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: 'Vui lòng nhập vào giá sản phẩm!' },
                { type: 'number', min: 1, message: 'Giá phải lớn hơn 0!' }
              ]}
            >
              <InputNumber 
                value={stateDetailProduct.price} 
                onChange={(value) => handleOnchangeDetail(value, "price")}
                name="price"
                style={{ width: '100%' }} // Giá phải > 0
              />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào mô tả sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateDetailProduct.description} onChange={handleOnchangeDetail} name="description"/>
            </Form.Item>
            <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[
                { required: true, message: 'Vui lòng nhập vào đánh giá sản phẩm!' },
                { type: 'number', min: 1, max: 5, message: 'Đánh giá phải từ 1 đến 5!' }
              ]}
            >
              <InputNumber 
                value={stateDetailProduct.rating} 
                onChange={(value) => handleOnchangeDetail(value, "rating")} 
                name="rating"
                min={1} 
                max={5} // Chỉ cho phép nhập từ 1 đến 5
                style={{ width: '50%' }}
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào giảm giá sản phẩm!',
                },
              ]}
            >
              <InputComponent value={stateDetailProduct.discount} onChange={handleOnchangeDetail} name="discount"/>
            </Form.Item>
            <Form.Item
              label="Hình ảnh"
              name="image"
              rules={[]}
            >
              <div>
                <WarpperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                  <Button>Chọn ảnh</Button>
                </WarpperUploadFile>
                { stateDetailProduct?.image && 
                  <img 
                    src={stateDetailProduct?.image} 
                    alt="avatar" 
                    style={{width:'60px',height:'60px',borderRadius:'50%',marginLeft:'10px'}}
                  />
                }
              </div>
            </Form.Item>
            
            <Form.Item label={null} wrapperCol={{ offset: 20, span: 4 }}>
              <Button type="primary" className='bg-blue-500' htmlType="submit" size='large'>
                Cập nhật
              </Button>
            </Form.Item> 
          </Form>
        </LoadingComponent>
      </DrawerComponent>
      <ModalComponent 
        title="Xoá sản phẩm" 
        open={isModalOpenDelete} 
        onOk={handleOkDelete} 
        onCancel={handleCancelDelete}
        style={{ borderRadius: 0 }} 
      >
        <LoadingComponent isLoading={isPendingDelete}>
          <p>Bạn có chắc chắn muốn xoá sản phẩm này không?</p>
        </LoadingComponent>
      </ModalComponent>
    </div>
  )
}

export default DashboardProduct