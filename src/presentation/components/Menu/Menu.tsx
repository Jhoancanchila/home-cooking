import { FC } from "react";
// Components
import ProjectBox from "../Elements/MenuBox";
import FullButton from "../Elements/FullButton";
// Assets
import ProjectImg1 from "../../../assets/img/projects/1.png";
import ProjectImg2 from "../../../assets/img/projects/2.png";
import ProjectImg3 from "../../../assets/img/projects/3.png";
import ProjectImg4 from "../../../assets/img/projects/4.png";
import ProjectImg5 from "../../../assets/img/projects/5.png";
import ProjectImg6 from "../../../assets/img/projects/6.png";
import AddImage2 from "../../../assets/img/add/add2.png";
import { Link } from "react-router-dom";

const Projects: FC = () => {
  return (
    <section id="menu" className="w-full">
      <div className="bg-white py-16">
        <div className="w-full max-w-[1220px] my-0 mx-auto py-0 px-[30px]">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-[#0B093B] mb-4">Our Awesome Projects</h1>
            <p className="text-sm text-[#0B093B]">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
              <br />
              labore et dolore magna aliquyam erat, sed diam voluptua.
            </p>
          </div>
          
          {/* Primera fila de proyectos */}
          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg1}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg2}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg3}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
          </div>
          
          {/* Segunda fila de proyectos */}
          <div className="flex flex-wrap -mx-4 mt-4">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg4}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg5}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
              <ProjectBox
                img={ProjectImg6}
                title="Awesome Project"
                text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."
                action={() => alert("clicked")}
              />
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-16">
            <div className="w-[200px]">
              <FullButton title="Load More" action={() => alert("clicked")} />
            </div>
          </div>
        </div>
      </div>

        {/* Contenedor gris con texto */}
        <div className="bg-[#f5f5f5]">
          <div className="w-full max-w-[1220px] mx-auto px-[30px] my-0 py-0">
            <div className="flex justify-between items-center md:py-[100px] md:my-[100px] md:relative flex-col pb-8 mt-20 md:flex-row">

              {/* content left */}
              <div className="md:w-1/2 relative text-center w-[80%] order-2">
                <div className="lg:top-[-250px] w-full md:absolute md:left-0 md:top-[-300px] relative order-1 top-[-60px] left-0">
                  <div className="flex justify-center items-center p-0 w-full md:py-0 md:px-[15%]">
                    <img className="rounded-2xl w-full h-auto" src={AddImage2} alt="add" />
                  </div>
                </div>
              </div>

              {/* content right */}
              <div className="md:w-1/2 w-[80%] order-2">
                <h4 className="text-sm font-semibold">A few words about company</h4>
                <h2 className="md:text-4xl font-extrabold leading-[3rem] my-4 mx-0 text-2xl">A Study of Creativity</h2>
                <p className="text-[12px] md:max-w-[475px] mx-0 my-auto">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
                  diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
                </p>
                <div className="flex items-center my-[30px] mx-0">
                  <div className="w-[190px]">
                    <Link to="/preferences"    className="block">
                      <FullButton 
                        title="Comenzar"
                      />  
                    </Link>
                  </div>
                  {/* <div className="w-[190px] ml-4">
                    <Link to="/contact" className="block">
                    <FullButton title="Contact Us" action={() => alert("clicked")} border />
                    </Link>
                  </div> */}
                </div>
              </div>

            </div>
          </div>
        </div>
      
    </section>
  );
};

export default Projects;
