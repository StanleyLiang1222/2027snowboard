import { Nav } from "./components/Nav";
import { Snowfall } from "./components/Snowfall";
import { ToneTransition } from "./components/ToneTransition";
import { Hero } from "./sections/Hero";
import { RouteStrip } from "./sections/RouteStrip";
import { Itinerary } from "./sections/Itinerary";
import { Gallery } from "./sections/Gallery";
import { Spots } from "./sections/Spots";
import { Transit } from "./sections/Transit";
import { PracticalInfo } from "./sections/PracticalInfo";
import { Footer } from "./sections/Footer";

function App() {
  return (
    <div className="min-h-screen bg-onyx-canvas">
      <Snowfall />
      <Nav />
      <Hero />
      <RouteStrip />
      <Itinerary />
      <ToneTransition from="dark" to="light" />
      <Gallery />
      <Spots />
      <ToneTransition from="light" to="dark" />
      <Transit />
      <PracticalInfo />
      <Footer />
    </div>
  );
}

export default App;
