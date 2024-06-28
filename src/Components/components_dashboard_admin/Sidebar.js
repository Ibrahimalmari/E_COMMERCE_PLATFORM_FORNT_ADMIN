import {React ,useEffect ,useState } from 'react'
import axios from "axios";
import swal from "sweetalert";
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill ,BsChevronRight ,BsFillBarChartFill  }
 from 'react-icons/bs'
 import {Link} from 'react-router-dom'
 import {useNavigate} from "react-router-dom";

 
function Sidebar({openSidebarToggle, OpenSidebar}) {

  const [loading, setLoading] = useState(false); // حالة التحميل

   
    const [showSellerSublinks, setShowSellerSublinks] = useState(false); 

    const toggleSellerSublinks = () => {
      setShowSellerSublinks(!showSellerSublinks);
    };

    const [showStoreSublinks, setShowStoreSublinks] = useState(false); 

    const toggleStoreSublinks = () => {
      setShowStoreSublinks(!showStoreSublinks);
    };

    const [showSectionSublinks, setShowSectionSublinks] = useState(false);
  const toggleSectionSublinks = () => {
    setShowSectionSublinks(!showSectionSublinks);
  };

  const [showDeliverySublinks, setShowDeliverySublinks] = useState(false);
  const toggleDeliverySublinks = () => {
    setShowDeliverySublinks(!showDeliverySublinks);
  };

  const [showDiscountSublinks, setShowDiscountSublinks] = useState(false);
  const toggleDiscountSublinks = () => {
    setShowDiscountSublinks(!showDiscountSublinks);
  };
    const navigate = useNavigate()  
    useEffect(() => {
      if(!localStorage.getItem("token")){
        navigate('/Admin/Login');
      }
     },)


    const logoutSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        const id =localStorage.getItem("id");
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/adminlogout/${id}`);
               if(response.data.status === 200){ 
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                localStorage.removeItem("role_auth");
                localStorage.removeItem("id");
                localStorage.removeItem("lastActivity");
                console.log(response.data);
                swal("success",response.data.message,"success")
                navigate('/Admin/Login');
                }
              } catch (error) {
                swal("error",error.message,"error")
                console.error(error.message);
                
              }
              finally {
                setLoading(false); 
              }
            };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsFillBarChartFill  className='icon_header'/> YAM
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link href="" to="/admin/Dashboard">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </Link>
            </li>     
      <li className='sidebar-list-item'>
        <div className="sidebar-sublink-header" onClick={toggleSellerSublinks}>
          <span className='main-product' >
            <BsPeopleFill className='icon'/> Seller
          </span>
          <span className="arrow-icon">
            <BsChevronRight />
          </span>
        </div>
        {showSellerSublinks && (
          <ul className='sidebar-sublist gray-background'> 
            <li className='sidebar-sublist-item'>
              <Link to="/admin/Seller/" className='sublink'>
                All Seller
              </Link>
            </li>
            <li className='sidebar-sublist-item'>
              <Link to="/admin/Seller/Add/" className='sublink'>
                Add Seller
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li className='sidebar-list-item'>
        <div className="sidebar-sublink-header" onClick={toggleStoreSublinks}>
          <span className='main-product' >
            <BsPeopleFill className='icon'/> Store
          </span>
          <span className="arrow-icon">
            <BsChevronRight />
          </span>
        </div>
        {showStoreSublinks && (
          <ul className='sidebar-sublist gray-background'> 
            <li className='sidebar-sublist-item'>
              <Link to="/admin/Store/" className='sublink'>
                All Store
              </Link>
            </li>
            <li className='sidebar-sublist-item'>
              <Link to="/admin/Store/Add/" className='sublink'>
                Add Store
              </Link>
            </li>
          </ul>
        )}
      </li>
      <li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleSectionSublinks}>
    <span className="main-section">
      <BsFillGearFill className="icon" /> Section
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showSectionSublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/admin/Section/" className="sublink">
          All Sections
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/admin/Section/Add" className="sublink">
          Add Section
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/admin/Section/SectionToStore" className="sublink">
          All Section For All Store
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/admin/Section/AddSectionToStore" className="sublink">
          Add Section to store
        </Link>
      </li>
    </ul>
  )}
</li>

<li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleDeliverySublinks}>
    <span className="main-section">
    <BsListCheck className='icon'/> Delivery Worker
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showDeliverySublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/admin/DeliveryWorker/" className="sublink">
          All Delivery Worker
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/admin/DeliveryWorker/Add" className="sublink">
          Add Delivery Worker
        </Link>
      </li>
    </ul>
  )}
</li>
<li className="sidebar-list-item">
  <div className="sidebar-sublink-header" onClick={toggleDiscountSublinks}>
    <span className="main-section">
    <BsListCheck className='icon'/> Discount
    </span>
    <span className="arrow-icon">
      <BsChevronRight />
    </span>
  </div>
  {showDiscountSublinks && (
    <ul className="sidebar-sublist gray-background">
      <li className="sidebar-sublist-item">
        <Link to="/admin/Discount/" className="sublink">
          All Discount
        </Link>
      </li>
      <li className="sidebar-sublist-item">
        <Link to="/admin/Discount/Add" className="sublink">
          Add Discount
        </Link>
      </li>
    </ul>
  )}
</li>


          <li className='sidebar-list-item'>
               <Link href="" to="admin/Inventory">
                    <BsListCheck className='icon'/> Inventory
                </Link>
           </li>
            <li className='sidebar-list-item'>
                <Link href="" to="admin/Report">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </Link>
            </li>
            <li className='sidebar-list-item'>
                   <Link href=""  onClick={logoutSubmit}>
                    <BsFillGearFill className='icon'/> Logout
                </Link>
           
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar
