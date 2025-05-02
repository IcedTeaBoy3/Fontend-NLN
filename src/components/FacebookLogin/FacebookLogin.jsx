import { useEffect } from "react";

const FacebookLogin = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID,
        cookie: true,
        xfbml: true,
        version: "v18.0", // kiểm tra version mới nhất
      });
    };
  }, []);

  const handleLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          console.log("Welcome! Fetching your info.... ");
          window.FB.api("/me", { fields: "name,email" }, function (userInfo) {
            console.log("User Info: ", userInfo);
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
      Login with Facebook
    </button>
  );
};

export default FacebookLogin;