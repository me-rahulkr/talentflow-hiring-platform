import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 flex-shrink-0 bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">TalentFlow</h1>
        <nav className="mt-8">
          <a href="/jobs" className="block py-2 px-4 rounded hover:bg-gray-700">Jobs</a>
          <a href="/candidates" className="block py-2 px-4 rounded hover:bg-gray-700 mt-2">Candidates</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> 
      </main>
    </div>
  );
}
export default MainLayout;