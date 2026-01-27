import logo from './logo.svg';
import './App.css';

import Navbar from './components/Navbar';

import carouselImg1 from "./images/carouselimg1.png";
import carouselImg2 from "./images/carouselimg2.png";
import carouselImg3 from "./images/carouselimg3.png";
import carouselImg4 from "./images/carouselimg4.png";


function App() {
  return (
    <div>

      <Navbar/>

      <div className="container-fluid">
        <div className='row'>
          <div className='col'>
            
            <div id="carouselExampleFade" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner" style={{height:'640px'}}>
                <div className="carousel-item active">
                  <img src= {carouselImg1} className="d-block w-100 img-fluid" alt="..."/>
                </div>
                <div className="carousel-item">
                  <img src={carouselImg2} className="d-block w-100 img-fluid" alt="..."/>
                </div>
                <div className="carousel-item">
                  <img src={carouselImg3} className="d-block w-100 img-fluid" alt="..."/>
                </div>
                <div className="carousel-item">
                  <img src={carouselImg4} className="d-block w-100 img-fluid" alt="..."/>
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

        <div className='row mt-2 mb-4'>
          <div className='col-md-6 text-center offset-md-3'>
            <h2 style={{color:'#1E052F'}}>Welcome to TixTrack</h2>
            <p style={{textAlign: 'justify', textAlignLast:'center', marginTop:'20px'}}>Stop chasing the beat and start living it. At TixTrack, we bridge the gap between you and the front row, offering a seamless way to secure seats for the world’s most iconic tours. Whether it’s an underground indie set or a sold-out stadium anthem, we make sure you never miss a note. Your next core memory is just a few clicks away.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
