import React from 'react';
import Header from './components/common/Header';
import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';
import KatanaExperience from './sections/KatanaExperience/KatanaExperience';
import About from './sections/About/About';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <KatanaExperience />
        <About />
      </main>
    </>
  );
}

export default App;
