import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { engineerService, authService } from '../../services';
import type { Engineer } from '../../services';
import { toast } from 'sonner';
import { 
  Search, 
  Users, 
  Mail, 
  Building, 
  Award, 
  Target, 
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

interface EngineerWithCapacity extends Engineer {
  availableCapacity?: number;
}

export default function EngineerListPage() {
  const [engineers, setEngineers] = useState<EngineerWithCapacity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.role !== 'manager') {
      toast.error('Access denied. Only managers can view engineers.');
      return;
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'manager') {
      const fetchEngineers = async () => {
        try {
          setLoading(true);
          const response = await engineerService.getEngineers();
          setEngineers(response.engineers);
        } catch (error: any) {
          toast.error('Failed to fetch engineers');
        } finally {
          setLoading(false);
        }
      };

      fetchEngineers();
    }
  }, [currentUser]);

  const filtered = engineers.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRefresh = async () => {
    if (currentUser?.role === 'manager') {
      try {
        setLoading(true);
        const response = await engineerService.getEngineers();
        setEngineers(response.engineers);
        toast.success('Engineers list refreshed');
      } catch (error: any) {
        console.error('Failed to refresh engineers:', error);
        toast.error('Failed to refresh engineers');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engineers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Engineers</h1>
              <p className="text-gray-600 text-lg">Manage and view all engineers in your team</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name or skill..."
              className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Total Engineers</p>
                  <p className="text-3xl font-bold">{engineers.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-400/30 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Available</p>
                  <p className="text-3xl font-bold">
                    {engineers.filter(e => e.availability && e.availability > 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Senior Engineers</p>
                  <p className="text-3xl font-bold">
                    {engineers.filter(e => e.seniority === 'senior').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-400/30 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Departments</p>
                  <p className="text-3xl font-bold">
                    {new Set(engineers.map(e => e.department).filter(Boolean)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Engineers Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Engineers Found</h3>
            <p className="text-gray-600 mb-6">
              {search ? 'Try adjusting your search criteria.' : 'No engineers have been added yet.'}
            </p>
            {!search && (
              <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add First Engineer
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((engineer) => (
              <Link to={`/engineers/${engineer.id}`} key={engineer.id}>
                <Card className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    {/* Header with Avatar and Role */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {engineer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {engineer.name}
                          </h3>
                          <Badge className="bg-indigo-700 text-white border-0 text-xs">
                            {engineer.role}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    
                    {/* Engineer Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-indigo-600" />
                        <span className="truncate">{engineer.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span>{engineer.seniority || 'Not specified'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4 text-indigo-600" />
                        <span>{engineer.department || 'Not specified'}</span>
                      </div>
                      
                      {engineer.availability !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Target className="w-4 h-4 text-indigo-600" />
                          <span>{engineer.availability}% available</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Skills */}
                    {engineer.skills && engineer.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {engineer.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
                              {skill}
                            </Badge>
                          ))}
                          {engineer.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700">
                              +{engineer.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
