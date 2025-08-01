import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Calendar,
    User,
    Briefcase,
    Percent,
    Clock,
    Edit,
    Trash2
} from 'lucide-react';
import { assignmentService, authService } from '../../services';
import type { Assignment } from '../../services';
import { useModal } from '../../context/modal-context';
import EditForm from './component/EditForm';

const AssignmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const { openSheet } = useModal();

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        const fetchAssignment = async () => {
            if (!id) {
                toast.error('Assignment ID is required');
                navigate('/assignments');
                return;
            }

            try {
                setLoading(true);
                const response = await assignmentService.getAssignmentById(id);
                setAssignment(response.assignment);
            } catch (error: any) {
                console.error('Failed to fetch assignment:', error);
                toast.error('Failed to load assignment details');
                navigate('/assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!assignment || !currentUser || currentUser.role !== 'manager') {
            toast.error('Only managers can delete assignments');
            return;
        }

        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await assignmentService.deleteAssignment(assignment.id);
                toast.success('Assignment deleted successfully');
                navigate('/assignments');
            } catch (error: any) {
                toast.error('Failed to delete assignment');
            }
        }
    };

    const handleEdit = () => {
        if (!assignment) return;

        openSheet(
            <EditForm
                assignment={assignment}
                onUpdate={(updatedAssignment) => {
                    setAssignment(updatedAssignment);
                    toast.success('Assignment updated successfully!');
                }}
            />
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading assignment details...</p>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
                    <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/assignments')}>
                        Back to Assignments
                    </Button>
                </div>
            </div>
        );
    }

    const isManager = currentUser?.role === 'manager';
    const isEngineer = currentUser?.role === 'engineer';
    const isAssignedEngineer = isEngineer && currentUser?.id === assignment.engineerId;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() =>isEngineer? navigate('/my-assignments')   : navigate('/assignments')}
                        className="mb-4 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Assignments
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Assignment Details
                            </h1>
                            <p className="text-gray-600">
                                {assignment.project?.name || 'Project'} - {assignment.role}
                            </p>
                        </div>

                        {(isManager || isAssignedEngineer) && (
                            <div className="flex gap-2">
                                {isManager && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleEdit}
                                            className="flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Assignment Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project & Role Card */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Project & Role</h2>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {assignment.project?.name || 'Project Name'}
                                    </h3>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {assignment.role}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Allocation:</span>
                                        <span className="font-medium">{assignment.allocationPercentage}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <Badge className="bg-green-100 text-green-800">
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engineer Info */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <User className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Assigned Engineer</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {assignment.engineer ? (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {assignment.engineer.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {assignment.engineer.skills?.map((skill, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No engineer assigned</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Start Date:</span>
                                        </div>
                                        <span className="font-medium">
                                            {new Date(assignment.startDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {assignment.endDate && (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">End Date:</span>
                                            </div>
                                            <span className="font-medium">
                                                {new Date(assignment.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Created:</span>
                                        </div>
                                        <span className="font-medium">
                                            {new Date(assignment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="bg-white shadow-sm border-0">
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        {assignment.allocationPercentage}%
                                    </div>
                                    <div className="text-sm text-gray-600">Allocation</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        {assignment.engineer?.skills?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Skills</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        {Math.ceil((new Date().getTime() - new Date(assignment.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                                    </div>
                                    <div className="text-sm text-gray-600">Days Active</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        {(isManager || isAssignedEngineer) && (
                            <Card className="bg-white shadow-sm border-0">
                                <CardHeader>
                                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isManager && (
                                        <>
                                            <Button
                                                onClick={handleEdit}
                                                className="w-full flex items-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Assignment
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleDelete}
                                                className="w-full flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Assignment
                                            </Button>
                                        </>
                                    )}

                                    {isAssignedEngineer && (
                                        <div className='text-center'>
                                            <h2 className='text-lg'>Enginner Are the foundation of company Growth </h2>
                                            <p className='text-green-600'>All the Best For Project </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetail; 