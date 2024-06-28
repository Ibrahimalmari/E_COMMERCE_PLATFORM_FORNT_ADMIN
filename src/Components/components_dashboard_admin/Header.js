import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  BsFillBellFill,
  BsPerson,
  BsJustify,
  BsChevronDown
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import "./css.css"

function Header({ OpenSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const name = localStorage.getItem('name');

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileOptions(false);
  };

  const toggleProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions);
    setShowNotifications(false);
  };

  const handleSearchChange = (e) => {
    // يمكنك إضافة المنطق هنا للبحث أو استخدام قيمة e.target.value
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/Notification/").then(res => {
      if (res.data.status === 200) {
        setNotifications(res.data.data);
      }
    });
  }, []);

  const handleAccept = (notificationId) => {
    axios.post('http://127.0.0.1:8000/api/notification/accept', { notification_id: notificationId })
      .then(response => {
        if (response.data.status === 200) {
          setNotifications(notifications.filter(notification => notification.id !== notificationId));
          alert(response.data.message); // اظهار رسالة النجاح
        } else {
          alert(response.data.message); // اظهار رسالة الخطأ
        }
      });
  };

  const handleReject = (notificationId) => {
    axios.post('http://127.0.0.1:8000/api/notification/reject', { notification_id: notificationId })
      .then(response => {
        if (response.data.status === 200) {
          setNotifications(notifications.filter(notification => notification.id !== notificationId));
          alert(response.data.message); // اظهار رسالة النجاح
        } else {
          alert(response.data.message); // اظهار رسالة الخطأ
        }
      });
  };

  const getNotificationText = (notification) => {
    const { type, data } = notification;
    console.log(data.type);

    switch (data.type) {
      case 'category':
        return (
          <>
            <p>تم إنشاء فئة جديدة بواسطة {data.data['category_created_by']}</p>
            <p>ذو المحتوى التالي:</p>
            <p>الاسم: {data.data['category_name']}</p>
            <p>السلج: {data.data['category_slug']}</p>
            <p>الوصف: {data.data['category_description']}</p>
          </>
        );
      case 'product':
        let images = [];
        if (typeof data.data['product_images'] === 'string') {
          images = data.data['product_images'].split(',');
        } else if (Array.isArray(data.data['product_images'])) {
          images = data.data['product_images'];
        }

        return (
          <>
            <p>تم إنشاء منتج جديد بواسطة {data.data['product_created_by']}</p>
            <p>ذو المحتوى التالي:</p>
            <p>الاسم: {data.data['product_name']}</p>
            <p>الوصف: {data.data['product_description']}</p>
            <p>السعر: {data.data['product_price']}</p>
            <div className="product-images">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`http://127.0.0.1:8000/products/${image.trim()}`}
                  className="product-image"
                  alt="product"
                />
              ))}
            </div>
          </>
        );
      case 'branches':
        return (
          <>
            <p>تم إنشاء فرع جديد من فئة بواسطة {data.data['branch_creator_by']}</p>
            <p>ذو المحتوى التالي:</p>
            <p>الاسم: {data.data['branch_name']}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="menu-icon">
          <BsJustify onClick={OpenSidebar} />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="header-right">
        <div className="notification-wrapper" onClick={toggleNotifications}>
          <div className="notification-icon">
            <BsFillBellFill />
            <span className="notification-count">{notifications.length}</span>
          </div>
          {showNotifications && (
            <div className="notification-dropdown" style={{ direction: 'rtl' }}>
              <div className="notification-header">
                <Link className="mark-all-read">Mark all as read</Link>
              </div>
              <div className="notification-items-container">
                {notifications.slice(0, showAll ? notifications.length : 2).map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p className="notification-time">{notification.created_at}</p>
                    <div className="notification-details">
                      {getNotificationText(notification)}
                    </div>
                    <div className="notification-actions">
                      <button className="accept-button" onClick={() => handleAccept(notification.id)}>Accept</button>
                      <button className="reject-button" onClick={() => handleReject(notification.id)}>Reject</button>
                    </div>
                    {index !== (showAll ? notifications.length - 1 : 1) && <hr className="notification-divider" />}
                  </div>
                ))}
              </div>
              {notifications.length > 2 && !showAll && (
                <div className="view-all-notifications" onClick={() => setShowAll(true)}>
                  View all notifications
                </div>
              )}
            </div>
          )}
        </div>
        <div className="profile-wrapper" onClick={toggleProfileOptions}>
          <BsPerson />
          <span className="profile-name">{name}</span>
          <BsChevronDown className="arrow-icon" />
          {showProfileOptions && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <Link to="/Admin/AdminProfile">AdminProfile <BsPerson /></Link>
                <hr />
                <Link to="/Admin/ChangePassword">ChangePassword <BsJustify /></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
