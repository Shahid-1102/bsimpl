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
        .post("https://your-backend-api-url/bfhl", jsonData)
        .then((response) => {
          setApiResponse(response.data);
          setOptions(filterOptions);
        })
        .catch((err) => {
          console.error(err);
          setError("API request failed");
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
      <h1>ABCD123 - JSON Processor</h1>
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
