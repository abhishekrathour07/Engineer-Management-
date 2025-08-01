import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { authService, engineerService, projectService } from '../../services';
import type { Engineer, Project } from '../../services';
import { toast } from 'sonner';
import { 
  Users, 
  Building, 
  BarChart3, 
  Target, 
  Plus, 
  ArrowRight,
  Calendar,
  Clock,
  FolderOpen,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch engineers and projects
        const [engineersResponse, projectsResponse] = await Promise.all([
          engineerService.getEngineers(),
          projectService.getProjects()
        ]);

        setEngineers(engineersResponse.engineers);
        setProjects(projectsResponse.projects);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'completed': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'planning': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'mid': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'junior': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const filteredEngineers = engineers;

  const totalEngineers = engineers.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalAllocation = engineers.reduce((sum, eng) => sum + (100 - eng.availability), 0);
  const avgAllocation = totalEngineers > 0 ? Math.round(totalAllocation / totalEngineers) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to EngineerHub - Manage your team and projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Total Engineers</p>
                  <p className="text-3xl font-bold">{totalEngineers}</p>
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
                  <p className="text-emerald-100 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Avg Allocation</p>
                  <p className="text-3xl font-bold">{avgAllocation}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-400/30 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engineers Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Engineers</h2>
              <p className="text-gray-600">Manage and monitor your engineering team</p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              
              <Link to="/engineers">
                <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
                  <Users className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngineers.map((engineer, index: number) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {engineer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {engineer.name}
                        </h3>
                        <p className="text-sm text-gray-600">{engineer.department}</p>
                      </div>
                    </div>
                    <Badge className={getSeniorityColor(engineer?.seniority as any)}>
                      {engineer.seniority}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Allocation</span>
                      <span className="text-sm font-bold text-indigo-700">{100 - engineer.availability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${100 - engineer.availability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
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

                  <Button 
                    variant="outline" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                    onClick={() => navigate(`/engineers/${engineer.id}`)}
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Projects</h2>
              <p className="text-gray-600">Track and manage your active projects</p>
            </div>
            {currentUser?.role === 'manager' && (
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <Link to="/projects">
                  <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
                <Link to="/projects/create">
                  <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        {project.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{project.teamSize} team members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>Ends {new Date(project?.endDate as any).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate(`/projects/${project.id}`)} 
                    variant="outline" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
