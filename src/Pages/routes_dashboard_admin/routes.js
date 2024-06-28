import Product from "../dashboard_admin_pages/Product";
import Category from "../dashboard_admin_pages/Category";
import AddCategory from "../dashboard_admin_pages/addcategory";
import Dashboard from "../dashboard_admin_pages/Dashboard";
import AddProduct from "../dashboard_admin_pages/addproduct";
import Seller from "../dashboard_admin_pages/Seller";
import AddSeller from "../dashboard_admin_pages/addseller";
import Branch from "../dashboard_admin_pages/Branch";
import AddBranch from "../dashboard_admin_pages/addbranch";
import Store from "../dashboard_admin_pages/Store";
import AddStore from "../dashboard_admin_pages/addstore";
import EditSeller from "../dashboard_admin_pages/editseller";
import EditStore from "../dashboard_admin_pages/editstore";
import EditSection from "../dashboard_admin_pages/editsection";
import Section from "../dashboard_admin_pages/Section";
import AddSection from "../dashboard_admin_pages/addsection";
import AddSection_toStore from "../dashboard_admin_pages/addSection_toStore";
import EditSectionToStore from "../dashboard_admin_pages/editSectionToStore";
import SectionToStore from "../dashboard_admin_pages/SectionToStore";
import DeliveryWorker from "../dashboard_admin_pages/DeliveryWorker";
import AddDeliveryWorker from "../dashboard_admin_pages/adddeliveryworker";
import EditDeliveryWorker from "../dashboard_admin_pages/editdeliveryworker";
import Discount from "../dashboard_admin_pages/Discount";
import AddDiscount from "../dashboard_admin_pages/adddiscount";
import EditDiscount from "../dashboard_admin_pages/editdiscount";
import AdminProfile from "../../Components/components_login_admin/AdminProfile";
import ChangePassword from "../../Components/components_login_admin/ChangePassword";
const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/Product', exact: true, name: 'product', component: Product },
    { path: '/Product/Add', exact: true, name: 'addproduct', component: AddProduct },
    { path: '/Category', exact: true, name: 'category', component: Category },
    { path: '/Category/Add', exact: true, name: 'addcategory', component: AddCategory },
    { path: '/Dashboard', exact: true, name: 'dashboard', component: Dashboard },
    { path: '/Seller', exact: true, name: 'seller', component: Seller },
    { path: '/Seller/Add', exact: true, name: 'addseller', component: AddSeller },
    { path: '/Seller/EditSeller/:id', exact: true, name: 'editseller', component: EditSeller },
    { path: '/Branch', exact: true, name: 'branch', component: Branch },
    { path: '/Branch/Add', exact: true, name: 'addbranch', component: AddBranch },
    { path: '/Store', exact: true, name: 'store', component: Store },
    { path: '/Store/Add', exact: true, name: 'addstore', component: AddStore },
    { path: '/Store/EditStore/:id', exact: true, name: 'editstore', component: EditStore },
    { path: '/Section/', exact: true, name: 'section', component: Section },
    { path: '/Section/Add', exact: true, name: 'addsection', component: AddSection },
    { path: '/Section/EditSection/:id', exact: true, name: 'editsection', component: EditSection },
    { path: '/Section/SectionToStore', exact: true, name: 'sectiontostore', component: SectionToStore },
    { path: '/Section/AddSectionToStore', exact: true, name: 'addsection_tostore', component: AddSection_toStore },
    { path: '/Section/SectionToStore/EditSectionToStore/:id', exact: true, name: 'editsectiontostore', component: EditSectionToStore },
    { path: '/DeliveryWorker', exact: true, name: 'deliveryworker', component: DeliveryWorker },
    { path: '/DeliveryWorker/Add', exact: true, name: 'adddeliveryworker', component: AddDeliveryWorker },
    { path: '/DeliveryWorker/EditDeliveryWorker/:id', exact: true, name: 'editdeliveryworker', component: EditDeliveryWorker },
    { path: '/Discount', exact: true, name: 'discount', component: Discount },
    { path: '/Discount/Add', exact: true, name: 'adddiscount', component: AddDiscount },
    { path: '/Discount/EditDiscount/:id', exact: true, name: 'editdiscount', component: EditDiscount },
    { path: '/AdminProfile', exact: true, name: 'adminprofile', component: AdminProfile },
    { path: '/ChangePassword', exact: true, name: 'changepassword', component: ChangePassword },







];


export default routes;