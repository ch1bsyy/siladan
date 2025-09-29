import DarkModeToggler from "./components/ui/DarkModeToggler";

function App() {
  return (
    <div className="flex flex-col gap-5 min-h-screen items-center justify-center px-4 py-8 bg-white dark:bg-gray-900 dark:text-white">
      <div className=" font-bold text-2xl">Welcome, Developer Siladan !</div>

      <div className="mt-5">
        <DarkModeToggler />
      </div>
    </div>
  );
}

export default App;
