import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { projectService, assignmentService } from '../../services';
import type { Project, Assignment } from '../../services';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Users, Target, FileText, Clock, CheckCircle } from 'lucide-react';

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
        
        // Get project details
        const projectResponse = await projectService.getProjectById(id);
        setProject(projectResponse.project);
        
        // Get assignments for this project
        const assignmentsResponse = await assignmentService.getAssignments();
        const projectAssignments = assignmentsResponse.assignments.filter(
          assignment => assignment.projectId === id
        );
        setAssignments(projectAssignments);
        
      } catch (error: any) {
        console.error('Failed to fetch project details', error);
        toast.error('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 ">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
          <Link to="/projects">
            <Button variant="outline" className="mt-4">
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAllocation = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  const activeAssignments = assignments.length;
  const avgAllocation = assignments.length > 0 ? Math.round(totalAllocation / assignments.length) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600">Project Details & Team Overview</p>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Information */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Project Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{project.name}</p>
                </div>
              </div>
              
              {project.description && (
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="font-medium">{project.description}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {project.endDate && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="font-medium">{project.teamSize} members</p>
                </div>
              </div>
              
              {project.requiredSkills && project.requiredSkills.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Required Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Project Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Project Overview</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{activeAssignments}</p>
                  <p className="text-sm text-blue-700">Team Members</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{totalAllocation}%</p>
                  <p className="text-sm text-green-700">Total Allocation</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{avgAllocation}%</p>
                  <p className="text-sm text-orange-700">Avg Allocation</p>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                {assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{assignment.engineer?.name || 'Unknown Engineer'}</p>
                          <p className="text-sm text-gray-600">{assignment.role}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">
                            {assignment.allocationPercentage}%
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(assignment.startDate).toLocaleDateString()}
                            {assignment.endDate && ` - ${new Date(assignment.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No team members assigned yet</p>
                    <Link to="/manager/assignments">
                      <Button variant="outline" className="mt-4">
                        Assign Team Members
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 