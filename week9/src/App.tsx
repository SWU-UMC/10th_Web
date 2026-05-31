import './App.css';
import Navbar from './components/Navbar';
import CartList from './components/CartList';
import PriceBox from './components/PriceBox';
import Modal from './components/Modal';

function App() {
  return (
    <>
      <Modal />
      <Navbar />
      <CartList />
      <PriceBox />
    </>
  )
};

export default App;