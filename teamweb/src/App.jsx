import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [items,setItems] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000');
        const data = await res.json();
        //console.log(data);//Show in Console [Debugging Purposes]
        setItems(data.items)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    {items.map(i =>(
      <p>{i.name},{i.description}</p>
    ))}
    </>
  );
}

export default App;
