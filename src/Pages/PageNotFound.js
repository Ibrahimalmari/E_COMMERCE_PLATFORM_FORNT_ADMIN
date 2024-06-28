import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PageNotFound = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // زمن التحميل المزيف بمقدار 2 ثانية

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} spin style={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subHeading}>Not Found</h2>
      <p style={styles.message}>The resource requested could not be found on this server.</p>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '57%',
    transform:'translate(-50%, -50%)',
    zIndex: '9999',

  },
  heading: {
    fontSize: '72px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  message: {
    fontSize: '18px',
  },
  loading: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform:'translate(-50%, -50%)',
    zIndex: '9999',
    textAlign:'center'
  },
  spinner: {
    fontSize: '40px',
    marginRight: '10px',
  },
};

export default PageNotFound;
