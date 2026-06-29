import React from 'react';
import Header from './components/common/Header';
import Hero from './sections/Hero/Hero';
import Manifesto from './sections/Manifesto/Manifesto';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
      </main>
    </>
  );
}

export default App;
