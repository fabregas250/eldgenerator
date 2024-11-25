import { Link } from 'react-router-dom';

function PublicLayout({ children }) {
  const navigation = ['ALL', 'FERWAFA', 'FERWABA', 'FRVB', 'FERWACY'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow fixed top-0 w-full z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/landing">
              <img src="/logo/logo.svg" alt="MINISPORTS" className="h-12 w-auto" />
            </Link>
            
            <nav className="hidden md:flex space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="px-6 py-2.5 rounded-lg text-base text-gray-600 hover:bg-gray-100"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <Link
              to="/login"
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Add footer content */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout; 