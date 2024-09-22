import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState("");
  const [options, setOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  // Multi-select options
  const filterOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
  ];

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    // Validate JSON
    try {
      const jsonData = JSON.parse(jsonInput);
      if (!jsonData.data || !Array.isArray(jsonData.data)) {
        throw new Error("Invalid JSON structure");
      }

      // Send request to backend
      axios
        .post('https://bsimpl.vercel.app/bfhl', jsonData)
        .then((response) => {
          setApiResponse(response.data);
          setOptions(filterOptions);
        })
        .catch((err) => {
          console.error(err);
          if (err.response) {
            // Server responded with a status other than 200
            setError("API request failed: " + err.response.data.message);
          } else if (err.request) {
            // Request was made but no response received
            setError("No response from server. CORS issue might be causing this.");
          } else {
            // Something else happened in making the request
            setError("Error: " + err.message);
          }
        });
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const handleFilterChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    // Filter response based on selected dropdown options
    const filtered = {};
    if (selectedValues.includes("alphabets")) {
      filtered.alphabets = apiResponse.alphabets;
    }
    if (selectedValues.includes("numbers")) {
      filtered.numbers = apiResponse.numbers;
    }
    if (selectedValues.includes("highest_lowercase_alphabet")) {
      filtered.highest_lowercase_alphabet = apiResponse.highest_lowercase_alphabet;
    }

    setFilteredResponse(filtered);
  };

  return (
    <div>
      <h1>API-Input</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder='Enter JSON here: e.g. { "data": ["A", "C", "z"] }'
        value={jsonInput}
        onChange={handleJsonChange}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {apiResponse && (
        <>
          <h3>Filter Results</h3>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
          />
        </>
      )}
      {filteredResponse && (
        <div>
          <h3>Filtered Response</h3>
          {filteredResponse.alphabets && <p>Alphabets: {filteredResponse.alphabets.join(", ")}</p>}
          {filteredResponse.numbers && <p>Numbers: {filteredResponse.numbers.join(", ")}</p>}
          {filteredResponse.highest_lowercase_alphabet && (
            <p>Highest Lowercase Alphabet: {filteredResponse.highest_lowercase_alphabet.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
