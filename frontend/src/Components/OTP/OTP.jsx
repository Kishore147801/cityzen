import React, { useRef, useState } from 'react';
import './OTP.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { MdClose } from 'react-icons/md';

export const OTP = () => {
  const inputs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMessage('');

      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    } else {
      setErrorMessage('Only digits (0–9) are allowed');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1].focus();
      }
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleSubmit = async() => {
    const enteredOtp = otp.join('');

    if (otp.includes('')) {
      setErrorMessage('Please fill in all 6 digits');
      return;
    }

    setErrorMessage('');
    console.log('Entered OTP:', enteredOtp);
    let responseData;
    // Send OTP to backend
    try{
      await fetch('http://localhost:4000/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:'include',
        body: JSON.stringify({ otp: enteredOtp }),
      }).then((response)=>response.json()).then((data)=>responseData=data);
      if(responseData.success){
                    toast.success("Login successful", {
                      position: 'top-right',
                      autoClose: 3000,
                      theme: 'colored',
                    });
                    setTimeout(() => {
                      window.location.replace('/login');
                    }, 300); // delay for toast display
      }
      else{
        toast.error(responseData.message || "Login failed", {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'colored',
                  });
      }
    }
    catch(err){
      console.error("Login error:", err);
      toast.error("Something went wrong", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } 
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Enter OTP</h2>

        <div className="otp-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              maxLength={1}
              type="text"
              inputMode="numeric"
              className="otp-input"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputs.current[index] = el)}
            />
          ))}
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="submit-btn" onClick={handleSubmit}>
          Submit OTP
        </button>
      </div>
      <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Slide}
              closeButton={({ closeToast }) => (
                <MdClose
                  onClick={closeToast}
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    cursor: 'pointer',
                  }}
                />
              )}
            />
    </div>
  );
};
