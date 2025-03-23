import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  let navigate = useNavigate();

  // Fetch medicines on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/medicine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_type: "get_all_med" }),
        });

        const result = await response.json();
        setMedicines(result.medicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  // Update suggestions when input changes
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input && Array.isArray(medicines)) {
      const filteredMedicines = medicines.filter((medicine) =>
        medicine.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filteredMedicines);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (medicine) => {
    navigate(`/nearbyshops?medicine_name=${encodeURIComponent(medicine)}`);
  };

  return (
    <div className="container" style={{ marginTop: "50px", height: "50vh" }}>
      <div className="search-container" style={styles.container}>
        <input
          type="text"
          id="search-input"
          placeholder="Search for medicines..."
          value={searchInput}
          onChange={handleInputChange}
          style={styles.input}
        />

        {suggestions.length > 0 && (
          <div
            id="suggestions"
            style={{ ...styles.suggestions, color: "black" }}
          >
            {suggestions.map((medicine, index) => (
              <div
                key={index}
                style={styles.suggestionItem}
                onClick={() => handleSuggestionClick(medicine)}
              >
                {medicine}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "25px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    outline: "none",
  },
  suggestions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: "0 0 10px 10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "5px",
    maxHeight: "300px",
    overflowY: "auto",
    zIndex: 1000,
  },
  suggestionItem: {
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
    hover: {
      backgroundColor: "#f5f5f5",
    },
  },
};

export default UserSearch;
