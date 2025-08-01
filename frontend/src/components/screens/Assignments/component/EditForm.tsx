import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { assignmentService, engineerService, projectService } from '../../../services';
import type { Assignment, Engineer, Project } from '../../../services';
import { useModal } from '../../../context/modal-context';


interface EditFormProps {
    assignment: Assignment;
    onUpdate: (updatedAssignment: Assignment) => void;
}

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
    endDate: yup.string().optional(),
    role: yup.string().required('Role is required'),
});

const EditForm: React.FC<EditFormProps> = ({ assignment, onUpdate }) => {

    const { closeSheet } = useModal()
    const [engineers, setEngineers] = useState<Engineer[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<any>({
        resolver: yupResolver(assignmentSchema),
        defaultValues: {
            engineerId: assignment.engineerId || '',
            projectId: assignment.projectId || '',
            allocationPercentage: assignment.allocationPercentage || 100,
            startDate: assignment.startDate ? new Date(assignment.startDate).toISOString().split('T')[0] : '',
            endDate: assignment.endDate ? new Date(assignment.endDate).toISOString().split('T')[0] : '',
            role: assignment.role || '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [engineersResponse, projectsResponse] = await Promise.all([
                    engineerService.getEngineers(),
                    projectService.getProjects()
                ]);

                setEngineers(engineersResponse.engineers);
                setProjects(projectsResponse.projects);
            } catch (error: any) {
                toast.error('Failed to load data');
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: AssignmentForm) => {
        setLoading(true);
        try {
            const response = await assignmentService.updateAssignment(assignment.id, {
                engineerId: data.engineerId,
                projectId: data.projectId,
                allocationPercentage: data.allocationPercentage,
                startDate: data.startDate,
                endDate: data.endDate || undefined,
                role: data.role
            });

            onUpdate(response.assignment);
            toast.success('Assignment updated successfully!');
            closeSheet()
        } catch (error: any) {
            console.error('Failed to update assignment', error);
            toast.error(error.response?.data?.message || 'Failed to update assignment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className='h-full flex flex-col gap-6'>
            <h1 className='text-center text-xl font-bold mt-6 text-indigo-800'>Edit Assignment Detail</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="engineerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Engineer *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
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
                                            <SelectTrigger className='w-full'>

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

                    <div className="flex gap-4 pt-4 mt-12">
                        <Button type="submit" disabled={loading} className="flex-1 bg-indigo-800 cursor-pointer">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Update Assignment
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeSheet()}
                            className="flex-1 cursor-pointer"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default EditForm;
