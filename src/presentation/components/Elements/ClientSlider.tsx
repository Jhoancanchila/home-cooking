import { FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Assets
import ClientLogo01 from "../../../assets/img/clients/logo01.svg";
import ClientLogo02 from "../../../assets/img/clients/logo02.svg";
import ClientLogo03 from "../../../assets/img/clients/logo03.svg";
import ClientLogo04 from "../../../assets/img/clients/logo04.svg";
import ClientLogo05 from "../../../assets/img/clients/logo05.svg";
import ClientLogo06 from "../../../assets/img/clients/logo06.svg";

interface SliderSettings {
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  arrows: boolean;
  responsive: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
    };
  }>;
}

const ClientSlider: FC = () => {
  const settings: SliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const logos = [
    { src: ClientLogo01, alt: "client logo" },
    { src: ClientLogo02, alt: "client logo" },
    { src: ClientLogo03, alt: "client logo" },
    { src: ClientLogo04, alt: "client logo" },
    { src: ClientLogo05, alt: "client logo" },
    { src: ClientLogo06, alt: "client logo" },
    { src: ClientLogo03, alt: "client logo" },
    { src: ClientLogo04, alt: "client logo" },
    { src: ClientLogo01, alt: "client logo" },
    { src: ClientLogo02, alt: "client logo" },
  ];

  return (
    <div>
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div 
            key={index} 
            className="w-full h-[100px] flex items-center justify-center cursor-pointer focus:outline-none"
          >
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="w-full h-full p-[10%]" 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ClientSlider;