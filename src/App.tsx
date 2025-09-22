import Footer from "./components/layout/Footer";
import HeaderLayout from "./components/layout/Header";
import SideNav from "./components/layout/SideNav";

function App() {
  return (
    <div className="app">
      <div className="layout">
        <HeaderLayout />
        <SideNav />
        <div className="page-container">
          
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
