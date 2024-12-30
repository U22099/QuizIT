import { JSX } from 'react';
import { Home } from "./components/home/Home";

function App(): JSX.Element {
  return (
    <main className="bg-none flex justify-center items-center w-full h-full">
      <Home />
    </main>
  );
}

export default App;