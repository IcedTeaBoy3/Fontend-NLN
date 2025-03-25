export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export const renderOptions = (data) => {
  let results = [];
  if(data){
    results = data?.map((value) => {
      return {
        label: value,
        value: value
      }
    })
  }
  results.push({
    label: 'Thêm loại sản phẩm',
    value: 'add_type'
  })
  return results;
}
export const convertPrice = (price) => {
  try{
    return price?.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
  }catch (e){
    return e;
  }
}