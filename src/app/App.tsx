import { FC } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Screens
import { Landing, ServiceSelection, SuccessPage, MyServices, NotFoundPage, MyAccountPage } from "../presentation/pages";
// Context
import { AuthProvider } from "../context/AuthContext";

const App: FC = () => {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet"/>
      </Helmet>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/preferences" element={<ServiceSelection />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/my-services" element={<MyServices />} />
            <Route path="/my-account" element={<MyAccountPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;

