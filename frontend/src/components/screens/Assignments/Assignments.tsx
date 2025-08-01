import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Percent, 
  Search,
  Target,
  RefreshCw
} from 'lucide-react';
import { assignmentService, engineerService, projectService, authService } from '../../services';
import type { Assignment, Engineer, Project } from '../../services';
import { useModal } from '../../context/modal-context';
import EditForm from './component/EditForm';

interface AssignmentForm {
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: string;
  endDate?: string | null;
  role: string;
}

const assignmentSchema = yup.object().shape({
  engineerId: yup.string().required('Engineer is required'),
  projectId: yup.string().required('Project is required'),
  allocationPercentage: yup.number().min(1).max(100).required('Allocation percentage is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().optional().nullable(),
  role: yup.string().required('Role is required'),
});

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { openSheet } = useModal();

  // Check if user is manager
  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user && user.role !== 'manager') {
      toast.error('Access denied. Only managers can view assignments.');
      navigate('/dashboard');
    }
  }, [navigate]);

  const form = useForm<any>({
    resolver: yupResolver(assignmentSchema),
    defaultValues: {
      engineerId: '',
      projectId: '',
      allocationPercentage: 100,
      startDate: '',
      endDate: '',
      role: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);

        // Fetch engineers, projects, and assignments
        const [engineersResponse, projectsResponse, assignmentsResponse] = await Promise.all([
          engineerService.getEngineers(),
          projectService.getProjects(),
          assignmentService.getAssignments()
        ]);

        setEngineers(engineersResponse.engineers);
        setProjects(projectsResponse.projects);
        setAssignments(assignmentsResponse.assignments);
      } catch (error: any) {
        toast.error('Failed to load data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: AssignmentForm) => {
    setLoading(true);
    try {
      const response = await assignmentService.createAssignment({
        engineerId: data.engineerId,
        projectId: data.projectId,
        allocationPercentage: data.allocationPercentage,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        role: data.role
      });

      // Add the new assignment to the list
      setAssignments([...assignments, response.assignment]);
      toast.success('Assignment created successfully!');
      form.reset();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await assignmentService.deleteAssignment(id);
      setAssignments(assignments.filter(a => a.id !== id));
      toast.success('Assignment deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete assignment.');
    }
  };

  const handleRefresh = async () => {
    try {
      setInitialLoading(true);
      const [engineersResponse, projectsResponse, assignmentsResponse] = await Promise.all([
        engineerService.getEngineers(),
        projectService.getProjects(),
        assignmentService.getAssignments()
      ]);

      setEngineers(engineersResponse.engineers);
      setProjects(projectsResponse.projects);
      setAssignments(assignmentsResponse.assignments);
      toast.success('Assignments refreshed successfully');
    } catch (error: any) {
      toast.error('Failed to refresh data');
    } finally {
      setInitialLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.engineer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.project?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.project?.name).length;
  const avgAllocation = assignments.length > 0
    ? Math.round(assignments.reduce((sum, a) => sum + a.allocationPercentage, 0) / assignments.length)
    : 0;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Assignments</h1>
              <p className="text-gray-600 text-lg">Manage engineer assignments to projects</p>
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
              <Button 
                onClick={() => setShowForm(!showForm)} 
                className="bg-indigo-700 hover:bg-indigo-800 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? 'Cancel' : 'New Assignment'}
              </Button>
            </div>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search assignments..."
              className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Total Assignments</p>
                  <p className="text-3xl font-bold">{totalAssignments}</p>
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
                  <p className="text-emerald-100 text-sm font-medium">Active Assignments</p>
                  <p className="text-3xl font-bold">{activeAssignments}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
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
                  <Percent className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Form */}
        {showForm && (
          <Card className="mb-8 bg-white border border-gray-200 shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-bold text-gray-900">Create New Assignment</h3>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="engineerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Engineer *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 w-full focus:border-indigo-500 focus:ring-indigo-500">
                                <SelectValue placeholder="Select engineer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {engineers.map((engineer) => (
                                <SelectItem key={engineer.id} value={engineer.id}>
                                  {engineer.name} ({engineer.seniority || 'Not specified'})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Project *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 w-full focus:border-indigo-500 focus:ring-indigo-500">
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="allocationPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Allocation % *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              placeholder="100"
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Start Date *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              {...field} 
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Role *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Lead Developer, Frontend Developer" 
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white border-0"
                    >
                      {loading ? 'Creating...' : 'Create Assignment'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              className="bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/assignments/${assignment.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {assignment.engineer?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                        {assignment.engineer?.name || 'Unknown Engineer'}
                      </h3>
                      <p className="text-sm text-gray-600">{assignment.project?.name || 'Unknown Project'}</p>
                    </div>
                  </div>
                  <Badge className="bg-indigo-700 text-white border-0">
                    {assignment.role}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Percent className="w-4 h-4 text-indigo-600" />
                    <span>Allocation: <span className="font-medium text-indigo-700">{assignment.allocationPercentage}%</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Start: <span className="font-medium">{new Date(assignment.startDate).toLocaleDateString()}</span></span>
                  </div>
                  {assignment.endDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>End: <span className="font-medium">{new Date(assignment.endDate).toLocaleDateString()}</span></span>
                    </div>
                  )}
                </div>

                {assignment.engineer?.skills && assignment.engineer.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Engineer Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignment.engineer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
                          {skill}
                        </Badge>
                      ))}
                      {assignment.engineer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700">
                          +{assignment.engineer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      openSheet(
                        <EditForm
                          assignment={assignment}
                          onUpdate={(updatedAssignment) => {
                            setAssignments(assignments.map(a => 
                              a.id === updatedAssignment.id ? updatedAssignment : a
                            ));
                          }}
                        />
                      );
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAssignment(assignment.id);
                    }}
                    className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first assignment to get started.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments; 