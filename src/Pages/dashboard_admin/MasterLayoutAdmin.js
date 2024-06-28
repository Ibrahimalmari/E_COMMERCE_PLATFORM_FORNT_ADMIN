import {React,useState ,useEffect} from 'react'
import {  Routes ,Navigate ,Route  } from "react-router-dom"
import swal from "sweetalert";
import Header from '../../Components/components_dashboard_admin/Header'
import Sidebar from '../../Components/components_dashboard_admin/Sidebar'
import "./MasterLayoutAdmin.css"
import routes from '../routes_dashboard_admin/routes'
import PageNotFound from '../PageNotFound'
export default function MasterLayoutAdmin() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };


    useEffect(() => {
      const checkInactivityAndDeleteToken = () => {
        const lastActivity = localStorage.getItem('lastActivity');
        const currentTime = new Date().getTime();
        const inactiveDuration = 20 * 60 * 1000;
    
        if (lastActivity && (currentTime - parseInt(lastActivity) > inactiveDuration)) {
          swal({
            title: "Your session has expired!",
            text: "Please login again.",
            icon: "warning",
            button: "OK",
            closeOnClickOutside: false, // هذا الخيار يمنع إغلاق الرسالة عند النقر خارجها
          });
          localStorage.removeItem('token');
          localStorage.removeItem("name");
          localStorage.removeItem("role_auth");
          localStorage.removeItem("id");
          localStorage.removeItem("lastActivity");
        }
      };
      checkInactivityAndDeleteToken();
  
    }, []); 
  



  return (    
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} openSidebarToggle={openSidebarToggle} />
      <Sidebar OpenSidebar={OpenSidebar} openSidebarToggle={openSidebarToggle} />
     <Routes>
            {routes.filter(route => route.component)
              .map(({ path, component: Component }, idx ,name ) => (
                <Route
                  key={idx}
                  path={path}
                  name={name}
                  element={<Component  />}
                />
              ))}
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard"/>}
            />
              {/* Route for Page Not Found */}
            <Route 
            path="*" 
            element={<PageNotFound />} />
          </Routes>
     
    </div>
    
  )
}
