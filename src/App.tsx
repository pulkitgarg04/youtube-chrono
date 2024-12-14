import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
};

export default App;