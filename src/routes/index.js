import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
// import UnauthorizedPage from "../pages/UnauthorizedPage/UnauthorizedPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailOrderPage from "../pages/DetailOrderPage/DetailOrderPage";
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isPrivate: false

    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isPrivate: false

    },
    {
        path: '/order-success',
        page: OrderSuccess,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/detail-order/:id',
        page: DetailOrderPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/detail-order-admin/:id',
        page: DetailOrderPage,
        isShowHeader: true,
        isPrivate: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isPrivate: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isPrivate: false
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isPrivate: false
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
        isPrivate:false
    },
    {
        path: '/admin/dashboard',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page:NotFoundPage,
        isShowHeader: true,
    }
]
