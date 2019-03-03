import React from 'react'
import './Home.scss'
import img from './../../assets/HomeImg.jpg'
import { Link } from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import react from './../../assets/react.png'
import node from './../../assets/node.png'
import sql from './../../assets/sql.png'
import gmap from './../../assets/gmap.png'
import redux from './../../assets/redux.png'
import stripe from './../../assets/stripe.png'
import aws from './../../assets/aws.png'
import socket from './../../assets/socket.png'
import apex from './../../assets/apex.png'
import mailer from './../../assets/mailer.png'
import twilio from './../../assets/twilio.png'
import sass from './../../assets/sass.png'
import ocean from './../../assets/ocean.png'




function Home() {
    return (
        <div>
            <div className='Home'>
                <h1>Love to your Machine</h1>
                <img src={img} alt='Man Repairing Car' />
                <div id='repair'>
                    <h2>Repair</h2>
                    <p>Repair when you want. Find opportunities around you.</p>
                    <Link to='/register/mechanic'><button>Sign up to Repair <i class="fas fa-arrow-right"></i></button></Link>
                </div>
                <div id='revive'>
                    <h2>Service</h2>
                    <p>Tap your phone. Choose the device. Get the fastest service.</p>
                    <Link to='/register/user'><button>Sign up for Service <i class="fas fa-arrow-right"></i></button></Link>
                </div>
            </div>
            <h1 id='techTag'>Technologies</h1>
            <div className='Carousel2'>
            <CarouselProvider
                    naturalSlideWidth={20}
                    naturalSlideHeight={20}
                    totalSlides={13}
                    interval={3000}
                    isPlaying={true}
                    lockOnWindowScroll={true}
                    visibleSlides={1}
                    step={1}
                    >
                
                    <Slider>
                        <Slide index={0}><img src={react}/></Slide>
                        <Slide index={1}><img src={node}/></Slide>
                        <Slide index={2}><img src={sql}/></Slide>
                        <Slide index={3}><img src={gmap}/></Slide>
                        <Slide index={4}><img src={redux}/></Slide>
                        <Slide index={5}><img src={stripe}/></Slide>
                        <Slide index={6}><img src={aws}/></Slide>
                        <Slide index={7}><img src={socket}/></Slide>
                        <Slide index={8}><img src={apex} /></Slide>
                        <Slide index={9}><img src={mailer}/></Slide>
                        <Slide index={10}><img src={twilio}/></Slide>
                        <Slide index={11}><img src={sass}/></Slide>
                        <Slide index={12}><img src={ocean}/></Slide>
                    </Slider>
                    </CarouselProvider>
            </div>
            <div className='Carousel1'>
            <CarouselProvider
                    naturalSlideWidth={20}
                    naturalSlideHeight={20}
                    totalSlides={13}
                    interval={2000}
                    isPlaying={true}
                    lockOnWindowScroll={true}
                    visibleSlides={4}
                    step={2}
                    >
                
                    <Slider>
                        <Slide index={0}><img src={react}/></Slide>
                        <Slide index={1}><img src={node}/></Slide>
                        <Slide index={2}><img src={sql}/></Slide>
                        <Slide index={3}><img src={gmap}/></Slide>
                        <Slide index={4}><img src={redux}/></Slide>
                        <Slide index={5}><img src={stripe}/></Slide>
                        <Slide index={6}><img src={aws}/></Slide>
                        <Slide index={7}><img src={socket}/></Slide>
                        <Slide index={8}><img src={apex} /></Slide>
                        <Slide index={9}><img src={mailer}/></Slide>
                        <Slide index={10}><img src={twilio}/></Slide>
                        <Slide index={11}><img src={sass}/></Slide>
                        <Slide index={12}><img src={ocean}/></Slide>
                    </Slider>
                    </CarouselProvider>
            </div>
            <footer>
                <div className='topFooter'>
                    <h1>We're here to help</h1>
                    <div className='helpSection'>
                        <p>Support is just a few taps away. You can get your questions answered by using our help section.</p>
                        <button>Get Help <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                <div className='bottomFooter'>
                    <div className='siteDetails'>
                        <h2>Mistreee</h2>
                        <p>Coming Soon...</p>
                    </div>
                    <div className='contact'>
                        <h1>Prakarsh Gupta</h1>
                        <div id='buttons'>
                            <a href='https://www.facebook.com/prakarsh.gupta' target="_blank"><i class="fab fa-facebook"></i></a>
                            <a href='https://www.linkedin.com/in/prakarsh-gupta-b7757a134/' target="_blank"><i class="fab fa-linkedin"></i></a>
                            <a href='https://github.com/gprakarsh' target="_blank"><i class="fab fa-github" ></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        )
}

export default Home