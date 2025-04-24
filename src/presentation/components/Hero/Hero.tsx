import { FC } from "react";
import { Link } from "react-router-dom";
// Assets
import HeaderImage from "../../../assets/img/platos-tipicos.avif";
import QuotesIcon from "../../../assets/svg/Quotes.jsx";
import Dots from "../../../assets/svg/Dots.jsx";
import FullButton from "../Elements/FullButton.js";

const Hero: FC = () => {
  return (
    <>
      <section id="home" className="container mx-auto flex flex-col md:flex-row justify-between items-center pt-[60px] md:pt-[80px] w-full min-h-[auto] md:min-h-[840px] px-4 md:px-6 max-w-[1220px]">
      <div className="w-full md:w-1/2 h-full flex items-center justify-center order-2 md:order-1 my-[30px] md:my-0 text-center md:text-left">
        <div>
          <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[45px] leading-tight">Cocina a domicilio</h1>
          <div className="max-w-full md:max-w-[470px] py-[15px] pb-[30px] md:pb-[50px] leading-6">
            <p className="text-xs sm:text-sm md:text-[18px] font-light">
            Disfruta de una experiencia gastronómica regional en la comodidad de tu casa.
            </p>
          </div>
          <div className="max-w-[160px] sm:max-w-[190px] mx-auto md:mx-0">
          <Link to="/preferences" className="block">
          <FullButton title="Comenzar"/>
              </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 h-full relative order-1 md:order-2 mt-[20px] md:mt-0">
        <div className="w-[80%] md:w-[70%] h-[85%] md:h-[90%] absolute top-[5%] right-[5%] md:right-0 z-0 bg-[#f2f2f2] rounded-lg"></div>
        
        <div className="flex justify-center md:justify-end relative z-[9] w-full">
          <img 
            className="rounded-lg z-[9] w-[90%] sm:w-[80%] md:w-auto h-auto relative" 
            src={HeaderImage} 
            alt="office" 
          />
          <div className="absolute left-[10px] sm:left-[20px] md:left-0 bottom-[-40px] md:bottom-[50px] max-w-[280px] sm:max-w-[330px] p-[15px] sm:p-[20px] md:p-[30px] flex items-center bg-[#0B093B] rounded-lg z-[99]">
            <div className="absolute left-[-15px] top-[-10px] scale-75 sm:scale-90 md:scale-100 origin-top-left">
              <QuotesIcon />
            </div>
            <div>
              <p className="text-xs sm:text-sm md:text-[15px] text-white">
                <em>The pleasure of pleasing the palate is the most exquisite.</em>
              </p>
              <p className="text-[10px] sm:text-xs md:text-[13px] text-[#F2B300] text-right mt-[8px] md:mt-[10px]">Ralph Waldo Emerson</p>
            </div>
          </div>
          <div className="hidden md:block absolute right-[-100px] bottom-[100px] z-[2]">
            <Dots />
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default Hero;


