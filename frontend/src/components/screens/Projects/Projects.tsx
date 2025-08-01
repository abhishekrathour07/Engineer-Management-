import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { projectService, authService } from '../../services';
import type { Project } from '../../services';
import { toast } from 'sonner';
import { Plus, Calendar, Users, Target, RefreshCw, Building, Globe, Clock, CheckCircle, Zap } from 'lucide-react';

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      console.log('Projects response:', response); // Debug log
      setProjects(response.projects || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (location.pathname === '/projects') {
      fetchProjects();
    }
  }, [location.pathname]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-emerald-500 to-green-600';
      case 'completed': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'planning': return 'bg-gradient-to-r from-amber-500 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
         
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">All Projects</h2>
              <p className="text-gray-600">View and manage project details</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={fetchProjects} 
                disabled={loading}
                className="flex items-center gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {currentUser?.role === 'manager' && (
                <Link to="/projects/create">
                  <Button className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white border-0 shadow-lg">
                    <Plus className="w-4 h-4" />
                    Create Project
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No projects found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by creating your first project to organize your team and track progress.</p>
            {currentUser?.role === 'manager' && (
              <Link to="/projects/create">
                <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0 shadow-lg px-8 py-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <Card className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    {/* Project Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {project.name}
                          </h3>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} text-white border-0 flex items-center gap-1`}>
                        {getStatusIcon(project.status)}
                        {project.status}
                      </Badge>
                    </div>
                    
                    {/* Project Description */}
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    )}
                    
                    {/* Project Timeline */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      {project.endDate && (
                        <>
                          <span className="text-gray-300">-</span>
                          <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    
                    {/* Team Size */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium">{project.teamSize} team members</span>
                    </div>
                    
                    {/* Required Skills */}
                    {project.requiredSkills && project.requiredSkills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-gray-700">Required Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.requiredSkills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
                              {skill}
                            </Badge>
                          ))}
                          {project.requiredSkills.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                              +{project.requiredSkills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* View Details Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all duration-300"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        View Details
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
