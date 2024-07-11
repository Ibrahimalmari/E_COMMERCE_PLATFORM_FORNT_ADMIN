import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BsFillBellFill, BsPerson, BsJustify, BsChevronDown } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import "./css.css";

function Header({ OpenSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const name = localStorage.getItem('name');
  const [noNotifications, setNoNotifications] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectAll, setRejectAll] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileOptions(false);
  };

  const toggleProfileOptions = () => {
    setShowProfileOptions(!showProfileOptions);
    setShowNotifications(false);
  };

  useEffect(() => {
    fetchNotifications(); // استرداد الإشعارات عند التحميل الأولي
  }, []);

  const fetchNotifications = () => {
    axios.get("http://127.0.0.1:8000/api/Notification/").then(res => {
      if (res.data.status === 200) {
        const filteredNotifications = res.data.data.filter(notification => notification.read_at === null);
        setNotifications(filteredNotifications);
        setNoNotifications(filteredNotifications.length === 0);

        if (filteredNotifications.length > 0) {
          setShowNotificationAlert(true);
          setTimeout(() => {
            setShowNotificationAlert(false);
          }, 5000); // إخفاء التحذير بعد 5 ثواني
        }
      }
    });
  };

  const handleAccept = (notificationId, notifiableId) => {
    axios.post(`http://127.0.0.1:8000/api/notification/accept/${notificationId}/${notifiableId}`)
      .then(response => {
        if (response.data.status === 200) {
          alert(response.data.message);
          setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error accepting notification:', error);
        alert('Error accepting notification');
      });
  };

  const handleReject = (notificationId) => {
    setCurrentNotification(notificationId);
    setShowRejectReason(true);
  };

  const handleRejectAll = () => {
    setRejectAll(true);
    setShowRejectReason(true);
  };

  const submitRejectReason = () => {
    if (rejectAll) {
      axios.post('http://127.0.0.1:8000/api/notification/reject-all', { reason: rejectReason })
        .then(response => {
          if (response.data.status === 200) {
            setNotifications([]);
            alert('All notifications rejected');
            setShowRejectReason(false);
            setRejectReason("");
          } else {
            alert('Failed to reject all notifications');
          }
        })
        .catch(error => {
          console.error('Error rejecting all notifications:', error);
          alert('Error rejecting all notifications');
        });
    } else {
      axios.post('http://127.0.0.1:8000/api/notification/reject', { notification_id: currentNotification, reject_reason: rejectReason })
        .then(response => {
          if (response.data.status === 200) {
            setNotifications(notifications.filter(notification => notification.id !== currentNotification));
            alert(response.data.message);
            setShowRejectReason(false);
            setRejectReason("");
          } else {
            alert(response.data.message);
          }
        })
        .catch(error => {
          console.error('Error rejecting notification:', error);
          alert('Error rejecting notification');
        });
    }
  };

  const getNotificationText = (notification) => {
    const { type, data ,created_at } = notification;
    const notificationDate = new Date(created_at);

    switch (data.type) {
      case 'category':
        if (data.data.old_data && data.data.new_data) {
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب التعديل فئة بواسطة {data.data.old_data['category_created_by']} صاحب المتجر {data.data.old_data['category_store_name']}</p>
              <p>البيانات القديمة:</p>
              <p>ذو المحتوى التالي:</p>
              <p>الاسم: {data.data.old_data['category_name']}</p>
              <p>السلج: {data.data.old_data['category_slug']}</p>
              <p>الوصف: {data.data.old_data['category_description']}</p>
              <hr/>
              <p>البيانات الجديدة:</p>
              <p>الاسم: {data.data.new_data['category_name']}</p>
              <p>السلج: {data.data.new_data['category_slug']}</p>
              <p>الوصف: {data.data.new_data['category_description']}</p>
            </>
          );
        } else{
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب إنشاء فئة جديدة بواسطة {data.data['category_created_by']} صاحب المتجر {data.data['category_store_name']}</p>
              <p>ذو المحتوى التالي:</p>
              <p>الاسم: {data.data['category_name']}</p>
              <p>السلج: {data.data['category_slug']}</p>
              <p>الوصف: {data.data['category_description']}</p>
            </>
          );
        }
      case 'product':
        if (data.data.old_data && data.data.new_data) {
          let oldImages = [];
          let newImages = [];
          if (typeof data.data.old_data['product_images'] === 'string') {
            oldImages = data.data.old_data['product_images'].split(',');
          } else if (Array.isArray(data.data.old_data['product_images'])) {
            oldImages = data.data.old_data['product_images'];
          }
          if (typeof data.data.new_data['product_images'] === 'string') {
            newImages = data.data.new_data['product_images'].split(',');
          } else if (Array.isArray(data.data.new_data['product_images'])) {
            newImages = data.data.new_data['product_images'];
          }

          // طباعة القيم للتحقق
          console.log("Old Images:", oldImages);
          console.log("New Images:", newImages);

          // عرض البيانات القديمة والجديدة
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب تعديل منتج بواسطة {data.data.new_data['product_seller_name']} صاحب المتجر {data.data.new_data['product_store_name']}</p>
              <p>البيانات القديمة:</p>
              <p>الاسم: {data.data.old_data['product_name']}</p>
              <p>الوصف: {data.data.old_data['product_description']}</p>
              <p>السعر: {data.data.old_data['product_price']}</p>
              <p>الكمية:{data.data.old_data['product_quantity']}</p>
              <div className="product-images">
                {oldImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://127.0.0.1:8000/products/${image.trim()}`}
                    className="product-image"
                    alt="old product"
                  />
                ))}
              </div>
              <p>البيانات الجديدة:</p>
              <p>الاسم: {data.data.new_data['product_name']}</p>
              <p>الوصف: {data.data.new_data['product_description']}</p>
              <p>السعر: {data.data.new_data['product_price']}</p>
              <p>الكمية:{data.data.new_data['product_quantity']}</p>
              <div className="product-images">
                {newImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://127.0.0.1:8000/products/${image.trim()}`}
                    className="product-image"
                    alt="new product"
                  />
                ))}
              </div>
            </>
          );
        }else {
          let images = [];
          if (typeof data.data['product_images'] === 'string') {
            images = data.data['product_images'].split(',');
          } else if (Array.isArray(data.data['product_images'])) {
            images = data.data['product_images'];
          }
          // عرض البيانات الجديدة فقط
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب إنشاء منتج جديد بواسطة {data.data['product_seller_name']} صاحب المتجر {data.data['product_store_name']}</p>
              <p>ذو المحتوى التالي:</p>
              <p>الاسم: {data.data['product_name']}</p>
              <p>الوصف: {data.data['product_description']}</p>
              <p>السعر: {data.data['product_price']}</p>
              <p>الكمية:{data.data['product_quantity']}</p>
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
        }
      case 'branch':
        if (data.data.old_data && data.data.new_data) {
          // عرض البيانات القديمة والجديدة
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب تعديل فرع بواسطة {data.data.new_data['branch_seller_name']} صاحب المتجر {data.data.new_data['branch_store_name']}</p>
              <p>البيانات القديمة:</p>
              <p>الاسم: {data.data.old_data['branch_name']}</p>
              <p>التابعة لفئة: {data.data.old_data['branch_category_name']}</p>
              <p>البيانات الجديدة:</p>
              <p>الاسم: {data.data.new_data['branch_name']}</p>
              <p>التابعة لفئة: {data.data.new_data['branch_category_name']}</p>
            </>
          );
        } else {
          // عرض البيانات الجديدة فقط
          return (
            <>
              <p>تاريخ الإشعار: {notificationDate.toLocaleDateString('ar-EG')}</p>
              <p>تم طلب إنشاء فرع جديد التابع الى فئة {data.data['branch_category_name']} بواسطة {data.data['branch_seller_name']} صاحب المتجر {data.data['branch_store_name']}</p>
              <p>ذو المحتوى التالي:</p>
              <p>الاسم: {data.data['branch_name']}</p>
            </>
          );
        }
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
            onChange
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
              {notifications.length > 0 && (
                <div className="notification-header">
                  <Link className="mark-all-read" onClick={handleRejectAll}>Mark all as read</Link>
                </div>
              )}
              <div className="notification-items-container">
                {noNotifications ? (
                  <div className="no-notifications">لا توجد إشعارات جديدة</div>
                ) : (
                  notifications.slice(0, showAll ? notifications.length : 2).map((notification, index) => (
                    <div key={index} className="notification-item">
                      {getNotificationText(notification)}
                      <div className="notification-buttons">
                        <button className="accept-button" onClick={() => handleAccept(notification.id, notification.notifiable_id)}>موافق</button>
                        <button className="reject-button" onClick={() => handleReject(notification.id)}>رفض</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 2 && !showAll && (
                <div className="notification-footer" onClick={() => setShowAll(true)}>
                  <Link className="show-more">عرض الكل</Link>
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

      {showRejectReason && (
        <div className="reject-reason-modal-overlay">
          <div className="reject-reason-modal">
            <div className="modal-content">
              <h2>إدخال سبب الرفض</h2>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="أدخل سبب الرفض هنا..."
              />
              <div className="modal-buttons">
                <button className="submit-button" onClick={submitRejectReason}>إرسال</button>
                <button className="cancel-button" onClick={() => setShowRejectReason(false)}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNotificationAlert && (
        <div className={`notification-alert ${showNotificationAlert ? 'show' : ''}`}>
          يوجد إشعارات جديدة
        </div>
      )}
    </header>
  );
}

export default Header;
