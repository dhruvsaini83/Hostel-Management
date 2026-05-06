import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="info"
          className="rounded-circle shadow-lg p-3"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #00f2fe, #4facfe)',
            border: 'none'
          }}
        >
          <i className="fas fa-chevron-up text-white"></i>
        </Button>
      )}
    </div>
  );
};

export default ScrollToTop;
