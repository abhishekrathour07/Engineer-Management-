import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import { projectService, authService } from '../../services';

interface ProjectForm {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  teamSize: number;
  requiredSkills: string[];
  status: string;
}

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  // Check if user is manager
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.role !== 'manager') {
      toast.error('Access denied. Only managers can create projects.');
      navigate('/dashboard');
    }
  }, [navigate]);

  const form = useForm<ProjectForm>({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      teamSize: 1,
      requiredSkills: [],
      status: 'planning',
    },
  });

  const watchedSkills = form.watch('requiredSkills') || [];

  const addSkill = () => {
    if (newSkill.trim() && !watchedSkills.includes(newSkill.trim())) {
      const updatedSkills = [...watchedSkills, newSkill.trim()];
      form.setValue('requiredSkills', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = watchedSkills.filter(skill => skill !== skillToRemove);
    form.setValue('requiredSkills', updatedSkills);
  };

  const onSubmit = async (data: ProjectForm) => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'manager') {
        toast.error('Access denied. Only managers can create projects.');
        return;
      }

      // Validate required fields based on backend model
      if (!data.name || !data.startDate) {
        toast.error('Project name and start date are required.');
        return;
      }

      // Validate user ID
      if (!user.id) {
        toast.error('User ID not found. Please log in again.');
        return;
      }

      // Prepare project data - only send required and optional fields
      const projectData = {
        name: data.name,
        description: data.description || undefined, // Optional field
        startDate: data.startDate,
        endDate: data.endDate || undefined, // Optional field
        teamSize: data.teamSize || 1, // Default to 1 if not provided
        requiredSkills: data.requiredSkills || [], // Default to empty array
        managerId: user.id ,// Use the actual user ID
        status: data.status,
      };

      console.log('User data:', user); // Debug log
      console.log('Sending project data:', projectData); // Debug log

      // Create the project
      await projectService.createProject(projectData);

      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (error: any) {
      console.error('Failed to create project', error);
      toast.error(error.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">Set up a new project and define its requirements. Fields marked with * are required.</p>
        </div>

        <Card className="bg-white shadow-sm border-0">
          <CardHeader className="pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project goals, scope, and requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates and Team Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Number of team members"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="planning">Planning</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Required Skills */}
                <FormField
                  control={form.control}
                  name="requiredSkills"
                  render={() => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill (e.g., React, Python, AWS)"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addSkill}
                              disabled={!newSkill.trim()}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {watchedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {watchedSkills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                    className="ml-1 hover:text-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? 'Creating Project...' : 'Create Project'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="mt-8">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Project Preview</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Project Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {form.watch('name') || 'Not specified'}</p>

                    <p><span className="font-medium">Team Size:</span> {form.watch('teamSize') || 'Not specified'} members</p>
                    <p><span className="font-medium">Start Date:</span> {form.watch('startDate') || 'Not specified'}</p>
                    <p><span className="font-medium">End Date:</span> {form.watch('endDate') || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {watchedSkills.length > 0 ? (
                      watchedSkills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No skills added yet</p>
                    )}
                  </div>
                </div>
              </div>
              {form.watch('description') && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{form.watch('description')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProject; 