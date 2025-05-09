
import { Dropdown, Space, Table, Button } from 'antd';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { DownOutlined,FileExcelOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";
const TableComponent = (props) => {
    const { selectionType, dataSource, columns = [], isLoading=false,onRow,handleDeleteMany,nameExcel } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      // getCheckboxProps: (record) => ({
      //   disabled: record.name === 'Disabled User',
      //   // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
     // Hàm xuất file Excel
    const exportToExcel = (nameExcel) => {
      // bỏ cột key ra khỏi file Excel
      const dataSourceNew = dataSource.map(({ key, ...rest }) => rest);
      const worksheet = XLSX.utils.json_to_sheet(dataSourceNew); // Chuyển dữ liệu thành sheet
      const workbook = XLSX.utils.book_new(); // Tạo workbook
      XLSX.utils.book_append_sheet(workbook, worksheet,nameExcel); // Thêm sheet vào workbook

      // Xuất file Excel
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data,`${nameExcel ?? "Exel" }.xlsx`); // Lưu file
    };

    const items = [
      {
        key: 'update',
        label: 'Update',
        onClick: () => {
          
        },
      },
      {
        key: 'delete',
        label: 'Delete',
        onClick: () => {
          handleDeleteMany(selectedRowKeys);
        },
      },
    ];
    return (
      <LoadingComponent isLoading={isLoading}>
        <div style={{ margin: '10px 0px',display:'flex',justifyContent:'space-between' }}>

          {selectedRowKeys.length > 0 && (
            <Dropdown
              menu={{
                items,
              }}
              overlayStyle={{ width: '150px' }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Button type="primary" className='bg-blue-500'> 
                  Hành động
                  <DownOutlined />
                </Button>
              </a>
            </Dropdown>
          )}
          <Button type="primary" icon={<FileExcelOutlined />} onClick={() => exportToExcel(nameExcel)} >
            Xuất Excel
          </Button>
        </div>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={dataSource}
          onRow={onRow}
          {...props}
        />
      </LoadingComponent>
    );
}

export default TableComponent;