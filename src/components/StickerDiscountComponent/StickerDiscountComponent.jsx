
const StickerDiscountComponent = ({logoImage,textSticker}) => {
  return (
    <div>
        <img src={logoImage} style={{ width:'78px', height:'32px', position:'absolute',top:-3,left:-3}}/>
        <span style={{ position:'absolute',top:1,left:3,color:'white',fontSize:'12px',fontWeight:'bold'}}>
          Giảm {textSticker}%
        </span>
    </div>
  )
}

export default StickerDiscountComponent