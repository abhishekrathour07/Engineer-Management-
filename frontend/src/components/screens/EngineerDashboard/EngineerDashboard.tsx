import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Calendar, Clock, Target, TrendingUp, Award, MapPin, Mail, Code, Database, Globe, Smartphone, Cpu, Zap, Shield, Palette, BarChart3 } from 'lucide-react';
import { assignmentService, engineerService } from '../../services';
import type { Assignment, Engineer } from '../../services';
import { authService } from '../../services';
import { toast } from 'sonner';

interface DashboardAssignment extends Assignment {
  progress?: number;
}

const EngineerDashboard = () => {
  const [assignments, setAssignments] = useState<DashboardAssignment[]>([]);
  const [engineerData, setEngineerData] = useState<Engineer | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        if (user && user.role === 'engineer' && user.id) {
          // Fetch engineer data
          const engineersResponse = await engineerService.getEngineers();
          const engineer = engineersResponse.engineers.find(e => e.id === user.id);
          setEngineerData(engineer || null);
          
          // Fetch assignments for the current engineer
          const assignmentsResponse = await assignmentService.getAssignments();
          
          // Filter assignments for current engineer and add progress
          const engineerAssignments = assignmentsResponse.assignments
            .filter(assignment => assignment.engineerId === user.id)
            .map(assignment => ({
              ...assignment,
              progress: Math.floor(Math.random() * 100) // This would come from project progress API
            }));
          
          setAssignments(engineerAssignments);
        }
        
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAllocation = assignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  const activeProjects = assignments.length;
  const avgProgress = assignments.length > 0 
    ? Math.round(assignments.reduce((sum, a) => sum + (a.progress || 0), 0) / assignments.length)
    : 0;
  const totalSkills = engineerData?.skills?.length || 0;
  const availableCapacity = engineerData?.availability || 100;

  const getSkillIcon = (skill: string) => {
    const skillLower = skill.toLowerCase();
    
    if (skillLower.includes('react') || skillLower.includes('javascript') || skillLower.includes('typescript') || skillLower.includes('js')) {
      return <Code className="w-5 h-5 text-blue-600" />;
    }
    if (skillLower.includes('node') || skillLower.includes('express') || skillLower.includes('backend')) {
      return <Database className="w-5 h-5 text-green-600" />;
    }
    if (skillLower.includes('html') || skillLower.includes('css') || skillLower.includes('frontend')) {
      return <Globe className="w-5 h-5 text-orange-600" />;
    }
    if (skillLower.includes('mobile') || skillLower.includes('react native') || skillLower.includes('flutter')) {
      return <Smartphone className="w-5 h-5 text-purple-600" />;
    }
    if (skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('c++')) {
      return <Cpu className="w-5 h-5 text-red-600" />;
    }
    if (skillLower.includes('aws') || skillLower.includes('cloud') || skillLower.includes('devops')) {
      return <Zap className="w-5 h-5 text-yellow-600" />;
    }
    if (skillLower.includes('security') || skillLower.includes('cyber')) {
      return <Shield className="w-5 h-5 text-indigo-600" />;
    }
    if (skillLower.includes('ui') || skillLower.includes('ux') || skillLower.includes('design')) {
      return <Palette className="w-5 h-5 text-pink-600" />;
    }
    if (skillLower.includes('data') || skillLower.includes('analytics') || skillLower.includes('ml')) {
      return <BarChart3 className="w-5 h-5 text-teal-600" />;
    }
    
    // Default icon for other skills
    return <Code className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {engineerData?.name || currentUser?.name || 'Engineer'}!
          </h1>
          <p className="text-gray-600">Here's your current status and projects</p>
        </div>

        {/* Engineer Profile Card */}
        {engineerData && (
          <Card className="bg-white shadow-sm border-0 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-red-600">
                      {engineerData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{engineerData.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {engineerData.email}
                      </div>
                      {engineerData.department && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {engineerData.department}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">
                    {engineerData.seniority || 'Engineer'}
                  </Badge>
                  <p className="text-sm text-gray-600">Available Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">{availableCapacity}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Allocation</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAllocation}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSkills}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Assignments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Assignments</h2>
          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => (
                <Card 
                  key={assignment.id} 
                  className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {assignment.project?.name || 'Project Name'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {assignment.role}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800">
                          {assignment.allocationPercentage}% allocated
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Allocation</p>
                        <p className="text-lg font-semibold text-gray-900">{assignment.allocationPercentage}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{assignment.progress || 0}%</span>
                      </div>
                      <Progress value={assignment.progress || 0} className="h-2" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{new Date(assignment.startDate).toLocaleDateString()}</span>
                      </div>
                      {assignment.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">{new Date(assignment.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500">You don't have any active project assignments at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Skills Overview */}
                 {engineerData?.skills && engineerData.skills.length > 0 && (
           <div className="mb-8">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {engineerData.skills.map((skill, index) => (
                 <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                   <CardContent className="p-4">
                     <div className="flex items-center space-x-3">
                       <div className="flex-shrink-0">
                         {getSkillIcon(skill)}
                       </div>
                       <div className="flex-1">
                         <h3 className="font-semibold text-gray-900">{skill}</h3>
                       </div>
                       <Badge className="bg-green-100 text-green-800">
                         Active
                       </Badge>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default EngineerDashboard; 