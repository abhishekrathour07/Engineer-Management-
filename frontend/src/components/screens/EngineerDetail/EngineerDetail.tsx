import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { engineerService } from '../../services';
import type { Engineer, EngineerCapacity } from '../../services';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Building, Award, Clock, Target } from 'lucide-react';

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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading engineer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!engineer || !capacity) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Engineer not found</p>
          <Link to="/engineers">
            <Button variant="outline" className="mt-4">
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link to="/engineers">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Engineers
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{engineer.name}</h1>
            <p className="text-gray-600">Engineer Profile & Capacity Overview</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {engineer.role}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engineer Information */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Engineer Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{engineer.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{engineer.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium capitalize">{engineer.role}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {engineer.skills && engineer.skills.length > 0 ? (
                      engineer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No skills specified</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capacity Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Capacity Overview</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Capacity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{capacity.totalCapacity}%</p>
                  <p className="text-sm text-blue-700">Total Capacity</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{capacity.availableCapacity}%</p>
                  <p className="text-sm text-green-700">Available</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{capacity.usedCapacity}%</p>
                  <p className="text-sm text-orange-700">Utilized</p>
                </div>
              </div>

              {/* Utilization Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Capacity Utilization</span>
                  <span className="text-sm text-gray-600">{utilizationPercentage}%</span>
                </div>
                <Progress value={utilizationPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Current Assignments */}
              {capacity.assignments && capacity.assignments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h3>
                  <div className="space-y-3">
                    {capacity.assignments.map((assignment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{assignment.projectName}</p>
                          <p className="text-sm text-gray-600">Assignment #{assignment.id}</p>
                        </div>
                        <Badge variant="outline">
                          {assignment.hoursAllocated}h
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!capacity.assignments || capacity.assignments.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No current assignments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngineerDetail;
