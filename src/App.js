import {React  } from 'react'
import axios from 'axios';
import {BrowserRouter as Router,Routes , Route ,Navigate } from 'react-router-dom';
import LoginAdmin from './Components/components_login_admin/Login';
import MasterLayoutAadmin from './Pages/dashboard_admin/MasterLayoutAdmin';
import PageNotFound from './Pages/PageNotFound'; 
import ForgotPassword from './Pages/forgetpassword/ForgotPassword';
import ResetPasswordPage from './Pages/resetpassword/resetpassword';


axios.interceptors.request.use(function(config){
const token =localStorage.getItem("token");
config.headers.Authorization =token ? `Bearer ${token}` : '';
return config;
});

function App() {  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/Admin/Login" />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/ResetPassword/:token" element={<ResetPasswordPage/>} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/admin/*" element={<MasterLayoutAadmin />} />  
      <Route path="/Admin/Login" element={<LoginAdmin />} /> 
      </Routes>
        </Router>
  )

}

export default App;
