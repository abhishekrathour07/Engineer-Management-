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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
          <Card className="bg-gradient-to-r from-white to-gray-50 shadow-xl border-0 mb-8 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">
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
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-2 border-0 shadow-md">
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
          <Card className="bg-gradient-to-br from-white to-blue-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Allocation</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAllocation}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-orange-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSkills}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
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
                  className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
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
                        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md">
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
            <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
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
                 <Card key={index} className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                   <CardContent className="p-4">
                     <div className="flex items-center space-x-3">
                       <div className="flex-shrink-0">
                         {getSkillIcon(skill)}
                       </div>
                       <div className="flex-1">
                         <h3 className="font-semibold text-gray-900">{skill}</h3>
                       </div>
                       <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md">
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