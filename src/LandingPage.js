import React from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import Navbar from './Navbar';

const LandingPage = () => {
  return (
    <div>
 
      <div className="container">
        <AppointmentForm />
        {/* <AppointmentList/> */}
      
      </div>
    </div>
  );
};

export default LandingPage;
