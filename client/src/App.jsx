import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Home from './Home';
import Tickers from './Tickers';
import { TickersProvider } from './context/TickersContext';

function App() {
  return (
    <div className="app">
      <h1>Tickers</h1>
      <TickersProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:stage" element={<Tickers />} />
        </Routes>
      </TickersProvider>
    </div>
  );
}

export default App;
