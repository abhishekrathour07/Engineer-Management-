import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { engineerService } from '../../services';
import type { Engineer, EngineerCapacity } from '../../services';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Building, 
  Award, 
  Clock, 
  Target, 
  Users,
  BarChart3,
  TrendingUp,
  Calendar,
  Globe
} from 'lucide-react';

const EngineerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [capacity, setCapacity] = useState<EngineerCapacity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineerDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const capacityResponse = await engineerService.getEngineerCapacity(id);
        setCapacity(capacityResponse.capacity);
        
        setEngineer({
          id: capacityResponse.capacity.engineerId,
          name: 'Engineer Name', 
          email: 'engineer@example.com',
          role: 'engineer',
          skills: [],
          availability: capacityResponse.capacity.availableCapacity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
      } catch (error: any) {
        console.error('Failed to fetch engineer details', error);
        toast.error('Failed to fetch engineer details');
      } finally {
        setLoading(false);
      }
    };

    fetchEngineerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading engineer details...</p>
        </div>
      </div>
    );
  }

  if (!engineer || !capacity) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Engineer not found</h3>
          <p className="text-gray-600 mb-4">The engineer you're looking for doesn't exist.</p>
          <Link to="/engineers">
            <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Engineers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const utilizationPercentage = capacity.totalCapacity > 0 
    ? Math.round((capacity.usedCapacity / capacity.totalCapacity) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
        <div className="mb-8">
        <Link to="/engineers">
            <Button variant="ghost" className="mb-4 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Engineers
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{engineer.name}</h1>
              <p className="text-gray-600 text-lg">Engineer Profile & Capacity Overview</p>
          </div>
            <Badge className="bg-indigo-700 text-white border-0 px-4 py-2">
            {engineer.role}
          </Badge>
        </div>
      </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Engineer Stats Cards */}
          <div className="xl:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Total Capacity</p>
                      <p className="text-3xl font-bold">{capacity.totalCapacity}%</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-400/30 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                <div>
                      <p className="text-emerald-100 text-sm font-medium">Available</p>
                      <p className="text-3xl font-bold">{capacity.availableCapacity}%</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                </div>
              </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                <div>
                      <p className="text-blue-100 text-sm font-medium">Utilized</p>
                      <p className="text-3xl font-bold">{capacity.usedCapacity}%</p>
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
                      <p className="text-purple-100 text-sm font-medium">Utilization</p>
                      <p className="text-3xl font-bold">{utilizationPercentage}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
                </div>
              </div>
              
          {/* Engineer Information Sidebar */}
          <div className="xl:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-lg sticky top-8">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Engineer Profile
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Full Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{engineer.name}</p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Email Address</span>
                    </div>
                    <p className="text-gray-900 font-medium">{engineer.email}</p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Role</span>
                    </div>
                    <p className="text-gray-900 font-medium capitalize">{engineer.role}</p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Skills & Expertise</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {engineer.skills && engineer.skills.length > 0 ? (
                      engineer.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white border-indigo-300 text-indigo-700">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                        <p className="text-gray-500 text-sm">No skills specified</p>
                    )}
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Capacity Overview & Assignments */}
          <div className="xl:col-span-3">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader className="pb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Capacity & Assignments
                </h2>
            </CardHeader>
              <CardContent className="space-y-8">
              {/* Utilization Progress */}
                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-indigo-900">Capacity Utilization</h3>
                    <span className="text-lg font-bold text-indigo-700">{utilizationPercentage}%</span>
                </div>
                  <Progress value={utilizationPercentage} className="h-4 bg-indigo-200" />
                  <div className="flex justify-between text-sm text-indigo-600 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Current Assignments */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Current Assignments
                  </h3>
                  
                  {capacity.assignments && capacity.assignments.length > 0 ? (
                    <div className="space-y-4">
                    {capacity.assignments.map((assignment, index) => (
                        <div key={index} className="p-6 bg-indigo-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {assignment.projectName?.charAt(0).toUpperCase() || 'P'}
                              </div>
                        <div>
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {assignment.projectName || 'Project Name'}
                                </h4>
                                <p className="text-indigo-700 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Assignment #{assignment.id}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-indigo-700 text-white border-0 px-3 py-1">
                                {assignment.hoursAllocated}h allocated
                              </Badge>
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Current Assignments</h3>
                      <p className="text-gray-600 mb-6">This engineer doesn't have any active project assignments at the moment.</p>
                      <Link to="/assignments">
                        <Button className="bg-indigo-700 hover:bg-indigo-800 text-white border-0">
                          <Globe className="w-4 h-4 mr-2" />
                          View All Assignments
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
    </div>
  );
};

export default EngineerDetail;
