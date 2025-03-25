import React from 'react'
import { useEffect } from 'react'
const LikeButtonComponent = (props) => {
    const { dataHref } = props
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse(); // Kích hoạt SDK của Facebook sau khi component render
        }
    }, []);
    return (
        <div className="fb-like" data-href={dataHref} data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
    )
}

export default LikeButtonComponent