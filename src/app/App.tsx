import { FC } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Screens
import { Landing, ServiceSelection } from "../presentation/pages";

const App: FC = () => {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"/>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/preferences" element={<ServiceSelection />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

