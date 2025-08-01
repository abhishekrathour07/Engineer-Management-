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
import { Plus, Edit, Trash2, Users, Calendar, Percent } from 'lucide-react';
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
  const navigate = useNavigate();

  const { openSheet } = useModal()

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


  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.project?.name).length;
  const avgAllocation = assignments.length > 0
    ? Math.round(assignments.reduce((sum, a) => sum + a.allocationPercentage, 0) / assignments.length)
    : 0;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Assignments</h1>
          <p className="text-gray-600">Manage engineer assignments to projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAssignments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Allocation</p>
                  <p className="text-2xl font-bold text-gray-900">{avgAllocation}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Percent className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Assignment Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'New Assignment'}
          </Button>
        </div>

        {/* Assignment Form */}
        {showForm && (
          <Card className="mb-8 bg-white shadow-sm border-0">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Create New Assignment</h3>
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
                          <FormLabel>Engineer *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel>Project *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
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
                          <FormLabel>Allocation % *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              placeholder="100"
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
                          <FormLabel>Start Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ''} />
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
                        <FormLabel>Role *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Lead Developer, Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4 border-t">
                    <Button type="submit" disabled={loading} className="flex-1 cursor-pointer">
                      {loading ? 'Creating...' : 'Create Assignment'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 cursor-pointer"
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
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{assignment.engineer?.name || 'Unknown Engineer'}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignment.project?.name || 'Unknown Project'}</p>
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {assignment.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{assignment.role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Allocation:</span>
                    <span className="font-medium">{assignment.allocationPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Start:</span>
                    <span className="font-medium">{new Date(assignment.startDate).toLocaleDateString()}</span>
                  </div>
                  {assignment.endDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">End:</span>
                      <span className="font-medium">{new Date(assignment.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {assignment.engineer?.skills && assignment.engineer.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Engineer Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignment.engineer.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {assignment.engineer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
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
                    className="flex-1 cursor-pointer"
                    onClick={() => openSheet(
                      <EditForm
                        assignment={assignment}
                        onUpdate={(updatedAssignment) => {
                          setAssignments(assignments.map(a => 
                            a.id === updatedAssignment.id ? updatedAssignment : a
                          ));
                        }}
                      />
                    )}
                  >
                    <Edit className="w-4 h-4 mr-1 " />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAssignment(assignment.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500 mb-4">Create your first assignment to get started.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments; 