import React from 'react';
import Header from './components/common/Header';
import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';
import KatanaExperience from './sections/KatanaExperience/KatanaExperience';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <KatanaExperience />
      </main>
    </>
  );
}

export default App;
