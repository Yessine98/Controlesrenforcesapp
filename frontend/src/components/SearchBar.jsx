import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex" style={{ alignItems: 'center' }}>
      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="md" // Smaller size for the input
        style={{ marginRight: '5px' }} // Add some space between the input and button
      />
      <Button type="submit" style={{ background: 'linear-gradient(to right,#263F26,#9EAA9E)', border: 'none', padding: '9px 10px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </Button>
    </Form>
  );
};

export default SearchBar;
