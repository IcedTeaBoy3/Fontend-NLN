import { useEffect } from "react";

const CommentComponent = ({ dataHref, width = "100%", numPosts = 5 }) => {
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse(); // Kích hoạt SDK của Facebook sau khi component render
        }
    }, []);

    return (
        <div 
            className="fb-comments" 
            data-href={dataHref} 
            data-width={width} 
            data-numposts={numPosts}>
        </div>
    );
};

export default CommentComponent;
