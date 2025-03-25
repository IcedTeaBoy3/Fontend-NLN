// import React from 'react'
import { Button, Form,Radio } from 'antd'
import { WarpperHeader } from './style.js'
import  TableComponent  from '../TableComponent/TableComponent'
import { useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
// import { useMutation as useMutationHook, useQuery as useQueryHook } from 'react-query'
import { useMutationHook,useQueryHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as Message from '../Message/Message'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import { useRef } from 'react'
import { WarpperUploadFile } from './style.js'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { Space } from 'antd'
// import Highlighter from 'react-highlight-words'
const DashboardUser = () => {
  
  // Lưu chi tiết một sản phẩm
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    isAdmin: false
  })
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

  // Seach filter sort table
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInputNew = useRef(null);


  // lấy form
  const [formUpdate] = Form.useForm()

  // Gọi API cập nhật người dùng
  const mutationUpdate = useMutationHook((data) => {
    const { id,access_token, ...rests } = data
    return UserService.updateUser(id,rests,access_token)
  })
  const { data: dataUpdate, isPending: isPendingUpdate } = mutationUpdate
  // Gọi API xoá người dùng
  const mutationDelete = useMutationHook((data) => {
    const { id,access_token } = data
    return UserService.deleteUser(id,access_token)
  })
  const { data: dataDelete, isPending: isPendingDelete } = mutationDelete
  // Hàm lấy ra tất cả người dùng
  const getAllUsers = async () => {
    const res = await UserService.getAllUsers(user?.access_token)
    return res
  }
  const queryGetAllUsers= useQueryHook(['users'],getAllUsers)
  const { data: dataUser, isLoadingUser } = queryGetAllUsers
  // Gọi API xoá nhiều người dùng
  const mutationDeleteMany = useMutationHook((data) => {
    const { access_token,...ids } = data
    return UserService.deleteManyUsers(ids,access_token)
  })
  


  // Hàm lấy ra một sản phẩm
  const getDetailUser= async (id) => {
    const res = await UserService.getUser(id,user?.access_token)
    if(res?.data){
      setStateUserDetail({
        ...res.data
      })
    }
    setIsLoadingUpdate(false)
  }
  const handleUserDetail = () => {

    setIsOpenDrawer(true)
  }
  // fix lỗi lần đầu tiên không hiển thị dữ liệu
  useEffect(() => {
    if(rowSelected){
      getDetailUser(rowSelected)
      setIsLoadingUpdate(true)
    }
  },[rowSelected])
  // set lại dữ liệu trong form
  useEffect(() => {
    formUpdate.setFieldsValue(stateUserDetail)

  },[formUpdate,stateUserDetail])
  // 2 cái nút sửa và xoá
  const renderActions = () => {
    return (
      <div style={{display:'flex',gap:'10px'}}>
        <Button type="primary" className='bg-blue-500' onClick={handleUserDetail}><EditOutlined style={{fontSize:'20px'}}/></Button>
        <Button type="primary" danger onClick={() => setIsModalOpenDelete(true)}><DeleteOutlined style={{fontSize:'20px'}}/></Button>
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
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address?.length - b.address?.length,
    },
    {
      title: 'isAdmin',
      dataIndex: 'isAdmin',
      filters: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' },
      ],
      onFilter: (value, record) => record.isAdmin === value,

    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderActions,
    },
  ];
  const dataTable = dataUser?.data?.length && dataUser?.data?.map((user) => {
    return {
      key: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin ? 'Yes' : 'No',
    };
  });

  

  // Xử lý khi cập nhật sản phẩm thành công
  useEffect(() => {
    if(dataUpdate?.status === 'success'){
      Message.success('Cập nhật người dùng thành công')
      setIsOpenDrawer(false)
      mutationUpdate.reset()
    }else if(dataUpdate?.status === 'error'){
      Message.error('Cập nhật người dùng thất bại')
    }
  },[dataUpdate])

  // Xử lý khi xoá sản phẩm thành công
  useEffect(() => {
    if(dataDelete?.status === 'success'){
      Message.success('Xoá người dùng thành công')
      handleCancelDelete()
    }else if(dataDelete?.status === 'error'){
      Message.error('Xoá người dùng thất bại')
    }
  },[dataDelete])


  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  // Xử lý khi xoá người dùng
  const handleOkDelete = () => {
    // setIsModalOpenDelete(false)
    mutationDelete.mutate({id:rowSelected,access_token:user?.access_token},{
      onSettled: () => {
        queryGetAllUsers.refetch()
      }
    })
  }
  // Xử lý khi xoá nhiều người dùng
  const handleDeleteMany = (ids) => {
    mutationDeleteMany.mutate({ids,access_token:user?.access_token},{
      onSettled: () => {
        queryGetAllUsers.refetch()
      }
    })
  }


  // Xử lý khi cập nhật người dùng
  const handleOnUpdateUser = () => {
    
    mutationUpdate.mutate({...stateUserDetail,id:rowSelected,access_token:user?.access_token},{
      onSettled: () => {
        queryGetAllUsers.refetch()
      }
    })
  }
  // Xử lý khi thay đổi input khi cập nhật người dùng
  const handleOnchangeDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
    })
  }
  
  const handleOnchangeAvatarDetail = async ({ fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview){
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetail({
      ...stateUserDetail,
      avatar: file.preview
    })
  }
  return (
    <div>
      <WarpperHeader>
        Quản lý người dùng
      </WarpperHeader>
      <div style={{marginTop:'20px',borderTop:'1px solid rgb(26,148,255)'}}>

        <TableComponent 
          selectionType={"Checkbox"} 
          dataSource={dataTable} 
          isLoading={isLoadingUser} 
          columns={columns}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record.key)
              }, // click row
            }
          }}
          handleDeleteMany= {handleDeleteMany}
          nameExcel="Danh_sach_nguoi_dung"
        /> 
      </div>
      
      <DrawerComponent 
        title="Chi tiết người dùng" 
        placement="right" 
        isOpen={isOpenDrawer} 
        onClose={() => setIsOpenDrawer(false)}
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
            onFinish={handleOnUpdateUser}
            autoComplete="off"
            form={formUpdate}
           
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Name!',
                },
              ]}
            >
              <InputComponent value={stateUserDetail.name} onChange={handleOnchangeDetail} name="name"/>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Invalid email format!',
                },
              ]}
            >
              <InputComponent value={stateUserDetail.email} onChange={handleOnchangeDetail} name="email"/>
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone!',
                },
                {
                  pattern: /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/,
                  message: 'Phone number is not valid!',
                },
              ]}
            >
              <InputComponent value={stateUserDetail.phone} onChange={handleOnchangeDetail} name="phone"/>
            </Form.Item>
            <Form.Item
              label="address"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please input your address!',
                }
                
              ]}
            >
              <InputComponent value={stateUserDetail.address} onChange={handleOnchangeDetail} name="address"/>
            </Form.Item>
            
            <Form.Item
              label="isAdmin"
              name="isAdmin"
              rules={[
                {
                  required: true,
                  message: "Please select isAdmin!",
                },
              ]}
            >
              <Radio.Group
                value={stateUserDetail.isAdmin}
                onChange={handleOnchangeDetail}
                name="isAdmin"
              >
                <Radio value={true}>Admin</Radio>
                <Radio value={false}>User</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
            >
              <div>
              
                <WarpperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                  <Button>Select file</Button>
                </WarpperUploadFile>
                { stateUserDetail?.avatar && 
                  <img 
                    src={stateUserDetail?.avatar} 
                    alt="avatar" 
                    style={{width:'60px',height:'60px',borderRadius:'50%',marginLeft:'10px'}}
                  />
                }
              </div>
              
            </Form.Item>
            
            <Form.Item label={null} wrapperCol={{ offset: 20, span: 4 }}>
              <Button type="primary"  htmlType="submit" size='large'>
                Cập nhật
              </Button>
            </Form.Item> 
          </Form>
        </LoadingComponent>
      </DrawerComponent>
      <ModalComponent 
        title="Xoá người dùng" 
        open={isModalOpenDelete} 
        onOk={handleOkDelete} 
        onCancel={handleCancelDelete}
        style={{ borderRadius: 0 }} 
      >
        <LoadingComponent isLoading={isPendingDelete}>
          <p>Bạn có chắc chắn muốn người dùng này hay không ?</p>
        </LoadingComponent>
      </ModalComponent>
    </div>
  )
}

export default DashboardUser