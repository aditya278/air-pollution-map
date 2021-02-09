import './App.css';
import stateJson from './states.json';
import IndianMap from './components/IndianMap';

function App() {
  return (
    <div className="App">
      <h1>Hello There</h1>
      <IndianMap width={650} height={650} stateJson={stateJson} />
    </div>
  );
}

export default App;
