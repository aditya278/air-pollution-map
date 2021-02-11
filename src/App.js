import './App.css';
import stateJson from './states.json';
import IndianMap from './components/IndianMap';

//Import Context into App
import AQIActions from './context/AQI/AQIActions';

function App() {
  return (
    <AQIActions>
      <div className="App">
        <h1>Air Pollution Map</h1>
        <IndianMap width={800} height={750} stateJson={stateJson} />
      </div>
    </AQIActions>
  );
}

export default App;
