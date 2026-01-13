import logo from './logo.svg';
import './App.css';

import Navbar from './components/Navbar';

import carouselImg1 from "./images/inception.jpeg";
import carouselImg2 from "./images/avangers.jpeg";
import carouselImg3 from "./images/inception2.jpeg";



function App() {
  return (
    <div>

      <Navbar/>

      <div className="container-fluid">
        <div className='row'>
          <div className='col'>
            
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-ride="carousel">
              <div className="carousel-inner" style={{height:'577px'}}>
                <div className="carousel-item active">
                  <img src= {carouselImg1} className="d-block w-100 img-fluid" alt="..."/>
                </div>
                <div className="carousel-item">
                  <img src={carouselImg2} className="d-block w-100 img-fluid" alt="..."/>
                </div>
                <div className="carousel-item">
                  <img src={carouselImg3} className="d-block w-100 img-fluid" alt="..."/>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-target="#carouselExampleFade" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-target="#carouselExampleFade" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
