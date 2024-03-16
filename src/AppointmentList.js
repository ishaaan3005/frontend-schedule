import React, { useState, useEffect, useContext } from 'react';
import { AppointmentContext } from './AppointmentContext';
import Navbar from './Navbar';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;


const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 22px);
  min-height: 100px;
  overflow-y: auto;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Item = styled.li`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const Details = styled.div``;

const Detail = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
`;

const Button = styled.button`
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const CompletedText = styled.span`
  color: green;
`;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const { addAppointment } = useContext(AppointmentContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPendingAppointments, setFilteredPendingAppointments] = useState([]);
  const [filteredUpcomingAppointments, setFilteredUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/appointments');
        if (response.ok) {
          const data = await response.json();
          const sortedAppointments = data.sort((a, b) => new Date(a.time) - new Date(b.time));
          setAppointments(sortedAppointments);
          filterAppointments(sortedAppointments);
        } else {
          throw new Error('Failed to fetch appointments');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [addAppointment]);

  const filterAppointments = (appointments) => {
    const currentTime = new Date();
    const pending = appointments.filter(appointment => new Date(appointment.time) < currentTime);
    const upcoming = appointments.filter(appointment => new Date(appointment.time) >= currentTime);
    setFilteredPendingAppointments(pending);
    setFilteredUpcomingAppointments(upcoming);
  };

  const handleDeleteAppointment = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
        setAppointments(updatedAppointments);
        filterAppointments(updatedAppointments);
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredPending = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(term) && new Date(appointment.time) < new Date()
    );
    const filteredUpcoming = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(term) && new Date(appointment.time) >= new Date()
    );
    setFilteredPendingAppointments(filteredPending);
    setFilteredUpcomingAppointments(filteredUpcoming);
  };

  const handleCheckboxChange = (id) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, completed: !appointment.completed } : appointment
    );
    setAppointments(updatedAppointments);
    filterAppointments(updatedAppointments);
  };

  return (
    <>
      <Container>
        <Title>Scheduled Appointments</Title>
        <SearchInput
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && (
          <>
            <Section>
              <h3>Pending Appointments</h3>
              <List>
                {filteredPendingAppointments.map((appointment) => (
                  <Item key={appointment.id}>
                    <Details>
                      <Detail>Name: {appointment.name}</Detail>
                      <Detail>Time: {new Date(appointment.time).toLocaleString()}</Detail>
                      <Detail>Reason: {appointment.reason}</Detail>
                    </Details>
                    <Button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</Button>
                    <input
                      type="checkbox"
                      checked={appointment.completed}
                      onChange={() => handleCheckboxChange(appointment.id)}
                    />
                    {appointment.completed && <CompletedText>Completed</CompletedText>}
                  </Item>
                ))}
              </List>
            </Section>
            <Section>
              <h3>Upcoming Appointments</h3>
              <List>
                {filteredUpcomingAppointments.map((appointment) => (
                  <Item key={appointment.id}>
                    <Details>
                      <Detail>Name: {appointment.name}</Detail>
                      <Detail>Time: {new Date(appointment.time).toLocaleString()}</Detail>
                      <TextArea readOnly value={appointment.reason} />
                    </Details>
                    <Button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</Button>
                    <input
                      type="checkbox"
                      checked={appointment.completed}
                      onChange={() => handleCheckboxChange(appointment.id)}
                    />
                    {appointment.completed && <CompletedText>Completed</CompletedText>}
                  </Item>
                ))}
              </List>
            </Section>
          </>
        )}
      </Container>
    </>
  );
};

export default AppointmentList;
