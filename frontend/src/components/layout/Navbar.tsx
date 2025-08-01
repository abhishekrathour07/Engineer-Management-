import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { authService } from '../services';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user on component mount
  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isPublicPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isPublicPage || isLoading) {
    return null;
  }

  return (
    <nav className="bg-gray-900 backdrop-blur-sm border-b border-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <span className="text-xl font-bold text-white">Engineer Panel</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-red-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUser && currentUser.role ? (
              <>
                {/* Manager Navigation */}
                {currentUser.role === 'manager' && (
                  <>
                    <Link
                      to="/projects"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/projects'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      Projects
                    </Link>
                    <Link
                      to="/assignments"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/assignments'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      Assignments
                    </Link>
                    <Link
                      to="/engineers"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/engineers'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      Engineers
                    </Link>
                    {/* <Link 
                      to="/planner" 
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === '/planner' 
                          ? 'text-red-600' 
                          : 'text-white hover:text-red-600'
                      }`}
                    >
                      Planner
                    </Link> */}
                    <Link
                      to="/dashboard"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      Home
                    </Link>
                  </>
                )}

                {/* Engineer Navigation */}
                {currentUser.role === 'engineer' && (
                  <>
                    <Link
                      to="/my-assignments"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/my-assignments'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      My Assignments
                    </Link>
                    <Link
                      to="/profile"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/profile'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* Remove Common Navigation for both roles - now role-specific */}
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-red-600 transition-colors cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white hover:text-red-600 transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
            {currentUser && currentUser.role ? (
              <>
                {/* Manager Mobile Navigation */}
                {currentUser.role === 'manager' && (
                  <>
                    <Link
                      to="/projects"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/projects'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Projects
                    </Link>
                    <Link
                      to="/assignments"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/assignments'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Assignments
                    </Link>
                    <Link
                      to="/engineers"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/engineers'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Engineers
                    </Link>
                    <Link
                      to="/planner"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/planner'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Planner
                    </Link>
                    <Link
                      to="/dashboard"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </>
                )}

                {/* Engineer Mobile Navigation */}
                {currentUser.role === 'engineer' && (
                  <>
                    <Link
                      to="/engineer-dashboard"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/engineer-dashboard'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/my-assignments"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/my-assignments'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Assignments
                    </Link>
                    <Link
                      to="/profile"
                      className={`block px-3 py-2 text-sm font-medium transition-colors ${location.pathname === '/profile'
                          ? 'text-red-600'
                          : 'text-white hover:text-red-600'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </>
                )}

              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-sm font-medium text-white hover:text-red-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-sm font-medium text-white hover:text-red-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav >
  );
};

export default Navbar; 