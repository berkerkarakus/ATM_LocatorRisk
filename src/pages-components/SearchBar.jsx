import { useState } from 'react';

function SearchBar({ onSearchSelect, onSearchAll }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    // Anlık öneri listesi için fetch
    fetch(`http://localhost:5000/atm-search?query=${encodeURIComponent(val)}`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data.slice(0, 5)))
      .catch((err) => console.error('Suggestion fetch error:', err));
  };

  const handleSelect = (atm) => {
    setQuery(atm.name);
    setSuggestions([]);
    onSearchSelect(atm); // Haritaya git
  };

  const handleSearchClick = () => {
    setSuggestions([]);
    onSearchAll(query); // Tüm sonuçları getir
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#fff',
      padding: '12px 16px',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      zIndex: 1000
    }}>
      <input
        type="text"
        placeholder="ATM Ara (örn. Yapı Kredi Ataşehir)"
        value={query}
        onChange={handleInputChange}
        style={{
          flex: 1,
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          marginRight: '12px'
        }}
      />
      <button
        onClick={handleSearchClick}
        style={{
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Ara
      </button>

      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 16,
          right: 16,
          margin: 0,
          padding: 0,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderTop: 'none',
          listStyle: 'none',
          maxHeight: '160px',
          overflowY: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {suggestions.map((atm, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(atm)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
            >
              <strong>{atm.name}</strong><br />
              <small>{atm.address}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
