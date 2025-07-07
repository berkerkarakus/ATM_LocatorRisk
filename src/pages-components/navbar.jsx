import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      style={{
        width: '220px',
        background: '#1e293b',
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>ATM Risk Map</h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <li>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🗺️ Map
          </Link>
        </li>
        <li>
          <Link to="/advancedSearch" style={{ color: 'tomato', textDecoration: 'none' }}>
            🔍 Advanced Search
          </Link>
        </li>
        
          
      </ul>
    </nav>
  );
}

export default Navbar;
