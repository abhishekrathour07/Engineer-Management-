import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Link, useLocation } from 'react-router-dom';
import { projectService, authService } from '../../services';
import type { Project } from '../../services';
import { toast } from 'sonner';
import { Plus, Calendar, Users, Target, RefreshCw } from 'lucide-react';

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
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
          <p className="text-gray-600">Manage and view all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchProjects} 
            disabled={loading}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {currentUser?.role === 'manager' && (
            <Link to="/projects/create">
              <Button className="flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </Link>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">Create your first project to get started.</p>
          {currentUser?.role === 'manager' && (
            <Link to="/projects/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <Card className="border border-gray-200 hover:shadow-lg hover:border-red-300 transition cursor-pointer">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  {project.description && (
                    <p className="text-sm text-gray-600">{project.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center gap-1">
                        <span>-</span>
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Team: {project.teamSize}</span>
                    </div>
                  </div>
                  
                  {project.requiredSkills && project.requiredSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.requiredSkills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.requiredSkills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
