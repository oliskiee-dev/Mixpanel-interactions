import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000'); // Correct the URL if needed
        const data = await res.json(); // Call the .json() method and await its result
        console.log(data); // Logs the actual JSON data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    </>
  );
}

export default App;
