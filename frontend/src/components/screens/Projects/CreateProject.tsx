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
import { 
  X, 
  Plus, 
  ArrowLeft, 
  Rocket, 
  Calendar, 
  Users, 
  Target, 
  FileText, 
  Globe,
  Zap,
  CheckCircle,
  Clock,
  Building,
  Star,
  Award
} from 'lucide-react';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="mb-4 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Project</h1>
            <p className="text-gray-600 text-lg">Set up a new project and define its requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Project Form */}
          <div className="xl:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader className="pb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  Project Configuration
                </h2>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Basic Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Project Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter project name" 
                                  {...field} 
                                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Project Status</FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Project Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the project goals, scope, and requirements..."
                                className="min-h-[120px] bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Timeline & Team */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Timeline & Team
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-medium">Start Date *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                                  {...field} 
                                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
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
                              <FormLabel className="text-gray-700 font-medium">Team Size</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="Number of team members"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Required Skills & Technologies
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="requiredSkills"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Skills & Technologies</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex gap-3">
                                  <Input
                                    placeholder="Add a skill (e.g., React, Python, AWS)"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addSkill}
                                    disabled={!newSkill.trim()}
                                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>

                                {watchedSkills.length > 0 && (
                                  <div className="flex flex-wrap gap-2 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                    {watchedSkills.map((skill, index) => (
                                      <Badge key={index} variant="outline" className="flex items-center gap-2 bg-white border-indigo-300 text-indigo-700">
                                        <Star className="w-3 h-3" />
                                        {skill}
                                        <button
                                          type="button"
                                          onClick={() => removeSkill(skill)}
                                          className="ml-1 hover:text-red-600 transition-colors"
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 sm:flex-none bg-indigo-700 hover:bg-indigo-800 text-white border-0"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Project...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            Create Project
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/projects')}
                        className="flex-1 sm:flex-none border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Project Preview */}
          <div className="xl:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-lg sticky top-8">
              <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Project Preview
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Project Name</span>
                    </div>
                    <p className="text-gray-900 font-medium">{form.watch('name') || 'Not specified'}</p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Status</span>
                    </div>
                    <Badge className="bg-indigo-700 text-white border-0 flex items-center gap-1 w-fit">
                      {getStatusIcon(form.watch('status'))}
                      {form.watch('status') || 'planning'}
                    </Badge>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Team Size</span>
                    </div>
                    <p className="text-gray-900 font-medium">{form.watch('teamSize') || 1} members</p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Timeline</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-900 text-sm">
                        <span className="font-medium">Start:</span> {form.watch('startDate') || 'Not specified'}
                      </p>
                      <p className="text-gray-900 text-sm">
                        <span className="font-medium">End:</span> {form.watch('endDate') || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedSkills.length > 0 ? (
                        watchedSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white border-indigo-300 text-indigo-700">
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
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-800">Description</span>
                    </div>
                    <p className="text-gray-900 text-sm">{form.watch('description')}</p>
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

export default CreateProject; 