import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [healthQuestion, setHealthQuestion] = useState("");
  const [healthResponse, setHealthResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <>
      <div className="container" style={{ marginTop: "50px", height: "100vh" }}>
        <div className="search-container" style={styles.container}>
          <h2 style={{ textAlign: "center" }}>Search for medicines</h2>
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
      <div className="health-advisor-container" style={styles.healthContainer}>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>Ask Health Questions</h2>
        <div style={styles.healthPrompt}>
          <textarea
            placeholder="Ask about common diseases, symptoms, or general health advice..."
            value={healthQuestion || ""}
            onChange={(e) => setHealthQuestion(e.target.value)}
            style={styles.textarea}
          />
          <button
            onClick={async () => {
              try {
                if (!healthQuestion) return;
                setIsLoading(true);
                const response = await fetch("http://127.0.0.1:8000/api/askai", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt: healthQuestion }),
                });
                const data = await response.json();
                if (data.status === "True") {
                  setHealthResponse(data.response);
                } else {
                  setHealthResponse("Sorry, there was an error processing your request.");
                }
              } catch (error) {
                console.error("Error getting health advice:", error);
                setHealthResponse("Error connecting to the health advisor service.");
              } finally {
                setIsLoading(false);
              }
            }}
            className="btn btn-success"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Advice"}
          </button>
        </div>
        {healthResponse && (
          <div style={styles.responseContainer}>
            <p style={styles.responseText}>{healthResponse}</p>
          </div>
        )}
      </div>
      </div>
    </>
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
  healthContainer: {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  healthPrompt: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  responseContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "15px",
    marginTop: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color: "black"
  },
  responseText: {
    lineHeight: "1.6",
    fontSize: "16px",
  },
};

export default UserSearch;
