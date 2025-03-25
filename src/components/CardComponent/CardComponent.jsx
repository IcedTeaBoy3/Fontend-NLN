
import { StyledNameProduct, WarpperReportText, WarpperPriceText, WarpperCardStyle } from './style';
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import StickerDiscountComponent from '../StickerDiscountComponent/StickerDiscountComponent';
import { Rate } from 'antd';
import { convertPrice } from '../../utils';
const CardComponent = (props) => {
  const navigate = useNavigate()
  const {name, image, description, price, countInStock, rating, type, selled, discount,id} = props
  const handleProductDetail = () => {
    navigate(`/product-details/${id}`)
  }
  return (
    <WarpperCardStyle
      hoverable
      styles={{ body: { padding: 10 } }}
      style={{ width: 200 }}
      cover={<img alt="example" src={image} />}
      onClick={() =>  handleProductDetail(id)}
    >
      <StickerDiscountComponent logoImage={logo} textSticker={discount}/>
      <StyledNameProduct>{name}</StyledNameProduct>
      <WarpperReportText>
        <div style={{borderRight:'1px solid #ccc',paddingRight:'8px'}}>
          <Rate allowHalf defaultValue={rating} value={rating} style={{ fontSize: 10 }}/>
        </div>
        <span> Đã bán {selled}+</span>
      </WarpperReportText>
      <WarpperPriceText>
          <span style={{marginRight:'8px'}}>{convertPrice(price)}</span>
    
      </WarpperPriceText>
    </WarpperCardStyle>
  )
}

export default CardComponent