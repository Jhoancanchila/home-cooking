import { FC } from "react";
// Components
import ClientSlider from "../Elements/ClientSlider";
import ServiceBox from "../Elements/ServiceBox";
import FullButton from "../Elements/FullButton";
// Assets
import AddImage1 from "../../../assets/img/add/1.png";
import AddImage2 from "../../../assets/img/add/2.png";
import AddImage3 from "../../../assets/img/add/3.png";
import AddImage4 from "../../../assets/img/add/4.png";
import { Link as LinkNavigate } from "react-router-dom";

const Services: FC = () => {
  return (
    <section id="services" className="w-full">
      <div className="bg-[#f2f2f2] py-[50px]">
        <div className="w-full max-w-[1220px] px-4 mx-auto">
          <ClientSlider />
        </div>
      </div>
      <div className="bg-white py-[60px]">
        <div className="w-full max-w-[1220px] px-4 mx-auto">
          <div className="md:text-left text-center">
            <h1 className="text-4xl font-extrabold">Our Awesome Services</h1>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </div>
          <div className="flex md:flex-row flex-col">
            <div className="md:w-1/5 w-full md:mr-[5%] md:py-[80px] py-[40px] md:text-left text-center">
              <ServiceBox
                icon="roller"
                title="Graphic Design"
                subtitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
              />
            </div>
            <div className="md:w-1/5 w-full md:mr-[5%] md:py-[80px] py-[40px] md:text-left text-center">
              <ServiceBox
                icon="monitor"
                title="Web Design"
                subtitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore."
              />
            </div>
            <div className="md:w-1/5 w-full md:mr-[5%] md:py-[80px] py-[40px] md:text-left text-center">
              <ServiceBox
                icon="browser"
                title="Development"
                subtitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
              />
            </div>
            <div className="md:w-1/5 w-full md:py-[80px] py-[40px] md:text-left text-center">
              <ServiceBox 
                icon="printer" 
                title="Print" 
                subtitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor." 
              />
            </div>
          </div>
        </div>
        <div className="bg-[#f2f2f2]">
          <div className="w-full max-w-[1220px] px-4 mx-auto">
            <div className="flex md:flex-row flex-col justify-between items-center my-[80px] md:py-[100px] md:relative md:pb-[40px] md:mb-0 md:mt-[80px]">
              <div className="md:w-1/2 w-[80%] md:order-1 order-2 md:text-left text-center">
                <h4 className="text-sm font-semibold">A few words about company</h4>
                <h2 className="text-4xl font-extrabold md:leading-normal leading-[3rem] my-[15px]">A Study of Creativity</h2>
                <p className="text-xs md:max-w-[475px] mx-auto md:mx-0">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                  diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                </p>
                <div className="flex md:justify-start justify-between items-center my-[30px]">
                  <div className="w-[190px]">
                    <LinkNavigate to="/preferences">
                      <FullButton title="Comenzar"/>
                    </LinkNavigate>
                  </div>
                  {/* <div className="w-[190px] ml-[15px]">
                    <FullButton title="Contact Us" action={() => alert("clicked")} border />
                  </div> */}
                </div>
              </div>
              <div className="md:w-1/2 w-[80%] md:absolute md:top-[-70px] md:right-0 relative order-1 md:top-auto top-[-40px]">
                <div className="w-full">
                  <div className="flex items-center justify-center">
                    <div className="w-[48%] mx-[6%] mb-[10px]">
                      <img 
                        src={AddImage1} 
                        alt="office" 
                        className="w-full h-auto rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.3)]" 
                      />
                    </div>
                    <div className="w-[30%] mx-[5%] mb-[10px]">
                      <img 
                        src={AddImage2} 
                        alt="office" 
                        className="w-full h-auto rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.3)]" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-[20%] ml-[40%]">
                      <img 
                        src={AddImage3} 
                        alt="office" 
                        className="w-full h-auto rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.3)]" 
                      />
                    </div>
                    <div className="w-[30%] mx-[5%]">
                      <img 
                        src={AddImage4} 
                        alt="office" 
                        className="w-full h-auto rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.3)]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;