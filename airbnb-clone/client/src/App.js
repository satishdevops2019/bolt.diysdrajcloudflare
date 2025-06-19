import React from 'react';
import HomePage from './pages/HomePage';
import './App.css'; // Assuming basic CRA styles or your own global styles

function App() {
  return (
    <div className="App">
      {/* Basic header, could be a separate component later */}
      <header className="App-header" style={{ padding: '20px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
        <h2>Airbnb Clone</h2>
      </header>

      <main style={{ padding: '20px' }}>
        <HomePage />
      </main>

      <footer style={{ padding: '10px', backgroundColor: '#333', color: 'white', textAlign: 'center', marginTop: '30px' }}>
        <p>&copy; 2024 Airbnb Clone Project</p>
      </footer>
    </div>
  );
}

export default App;
