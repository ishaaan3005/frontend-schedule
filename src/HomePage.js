import React, { useEffect } from 'react';
import { useUser, SignIn, SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Import styled-components
import LandingPage from './LandingPage'; // Import the LandingPage component

// Styled components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/landing'); // Redirect to landing page if user is logged in
    }
  }, [user, navigate]);

  return (
    <HomeContainer>
      {!user ? (
        <>
          <Heading>Welcome to the Home Page</Heading>
          <FormContainer>
            <SignIn />
            
          </FormContainer>
        </>
      ) : null}
    </HomeContainer>
  );
};

export default HomePage;
