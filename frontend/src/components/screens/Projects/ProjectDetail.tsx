import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { projectService, assignmentService } from '../../services';
import type { Project, Assignment } from '../../services';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Target, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  Zap,
  Award,
  Building,
  Globe
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const projectResponse = await projectService.getProjectById(id);
        setProject(projectResponse.project);
        
        const assignmentsResponse = await assignmentService.getAssignments();
        const projectAssignments = assignmentsResponse.assignments.filter(
          assignment => assignment.projectId === id
        );
        setAssignments(projectAssignments);
        
      } catch (error: any) {
        toast.error('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Link to="/projects">
            <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totalAllocation = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  const activeAssignments = assignments.length;
  const avgAllocation = assignments.length > 0 ? Math.round(totalAllocation / assignments.length) : 0;
  const progressPercentage = project.status === 'completed' ? 100 : project.status === 'active' ? 65 : 25;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/projects">
            <Button variant="ghost" className="mb-4 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 text-lg">Project Overview & Team Management</p>
            </div>
            <Badge className={`${getStatusColor(project.status)} text-white border-0 flex items-center gap-2 px-4 py-2`}>
              {getStatusIcon(project.status)}
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Project Stats Cards */}
          <div className="xl:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Team Members</p>
                      <p className="text-3xl font-bold">{activeAssignments}</p>
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
                      <p className="text-emerald-100 text-sm font-medium">Total Allocation</p>
                      <p className="text-3xl font-bold">{totalAllocation}%</p>
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
                      <p className="text-purple-100 text-sm font-medium">Progress</p>
                      <p className="text-3xl font-bold">{progressPercentage}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Project Information Sidebar */}
          <div className="xl:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-lg sticky top-8">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Project Details
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Project Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{project.name}</p>
                  </div>
                  
                  {project.description && (
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-800">Description</span>
                      </div>
                      <p className="text-gray-900 text-sm">{project.description}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Timeline</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-900 text-sm">
                        <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
                      </p>
                      {project.endDate && (
                        <p className="text-gray-900 text-sm">
                          <span className="font-medium">End:</span> {new Date(project.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Team Size</span>
                    </div>
                    <p className="text-gray-900 font-medium">{project.teamSize} members</p>
                  </div>
                  
                  {project.requiredSkills && project.requiredSkills.length > 0 && (
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Target className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-800">Required Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white border-indigo-300 text-indigo-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members & Overview */}
          <div className="xl:col-span-3">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader className="pb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Team Members
                </h2>
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-6 bg-indigo-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {assignment.engineer?.name?.charAt(0).toUpperCase() || 'E'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {assignment.engineer?.name || 'Unknown Engineer'}
                              </h3>
                              <p className="text-indigo-700 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {assignment.role}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-indigo-700 text-white border-0 px-3 py-1">
                              {assignment.allocationPercentage}% allocated
                            </Badge>
                            <div className="mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(assignment.startDate).toLocaleDateString()}
                              </div>
                              {assignment.endDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(assignment.endDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members Assigned</h3>
                    <p className="text-gray-600 mb-6">This project doesn't have any team members assigned yet.</p>
                    <Link to="/assignments">
                      <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
                        <Users className="w-4 h-4 mr-2" />
                        Assign Team Members
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 