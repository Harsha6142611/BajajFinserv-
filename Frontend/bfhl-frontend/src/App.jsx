import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 
function App() {
  const [inputJSON, setInputJSON] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputJSON(e.target.value);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Validate input as JSON
      const jsonData = JSON.parse(inputJSON);
      const response = await axios.post('http://localhost:3000/bfhl', { data: jsonData.data });
      setResponseData(response.data);
      setLoading(false);
    } catch (err) {
      if (err.name === 'SyntaxError') {
        setError('Invalid JSON format. Please enter a valid JSON.');
      } else {
        setError('Server error or cannot reach the server.');
      }
      setResponseData(null);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedFilters(values);
  };

  const renderFilteredResponse = () => {
    if (!responseData || selectedFilters.length === 0) return null;

    return (
      <div>
        <h3>Filtered Response</h3>
        {selectedFilters.map(filter => (
          <div key={filter}>
            <pre>{JSON.stringify(responseData[filter], null, 2)}</pre> {/* Display only the value */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input Interface</h1>
      <textarea
        rows="5"
        cols="50"
        value={inputJSON}
        onChange={handleInputChange}
        placeholder='Enter JSON here (e.g., {"data": ["1", "a", "b"]})'
      />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {responseData && (
        <>
          <h2>Filter Options</h2>
          <select multiple size="3" onChange={handleFilterChange}>
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">Highest lowercase alphabet</option>
          </select>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}

export default App;
