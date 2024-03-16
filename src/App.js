import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ClerkProvider, SignInButton } from '@clerk/clerk-react';
import Navbar from './Navbar';

import LandingPage from './LandingPage';
import { AppointmentProvider } from './AppointmentContext';
import HomePage from './HomePage';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';

const App = () => {
  const clerkPublishableKey = 'pk_test_c3Vubnktb3NwcmV5LTIyLmNsZXJrLmFjY291bnRzLmRldiQ';

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AppointmentProvider>
        <Router>
          <Navbar />
          <Routes>
          <Route path="/landing" element={<LandingPage />} />

            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<AppointmentForm />} />
            <Route path="/schedule" element={<AppointmentList />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AppointmentProvider>
    </ClerkProvider>
  );
};

export default App;
