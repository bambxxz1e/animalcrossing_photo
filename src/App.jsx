// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./Intro.jsx";
import ChoosePhoto from "./Choose_photo";
import Twophoto from "./twophoto";
import Fourphoto from "./fourphoto";
import Fivephoto from "./fivephoto";
import Takephoto from "./Take_photo";
import StickerResult from "./StickerResult.jsx";
import Gallery from "./Gallery.jsx";
import SendImg from "./SendImg.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/choose-photo" element={<ChoosePhoto />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/twophoto" element={<Twophoto />} />
        <Route path="/fourphoto" element={<Fourphoto />} />
        <Route path="/fivephoto" element={<Fivephoto />} />
        <Route path="/take-photo" element={<Takephoto />} />
        <Route path="/sticker" element={<StickerResult />} />
        <Route path="/send" element={<SendImg />} />
      </Routes>
    </Router>
  );
}

export default App;
