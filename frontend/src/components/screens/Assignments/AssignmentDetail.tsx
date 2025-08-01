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
    Trash2,
    Target,
    Building,
    Award,
    TrendingUp,
    Users,
    BarChart3
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
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading assignment details...</p>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
                    <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
                    <Button 
                        onClick={() => navigate('/assignments')}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white border-0"
                    >
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
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => isEngineer ? navigate('/my-assignments') : navigate('/assignments')}
                        className="mb-4 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Assignments
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Assignment Details
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {assignment.project?.name || 'Project'} - {assignment.role}
                            </p>
                        </div>

                        {(isManager || isAssignedEngineer) && (
                            <div className="flex gap-3">
                                {isManager && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleEdit}
                                            className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleDelete}
                                            className="border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Stats Cards */}
                    <div className="xl:col-span-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-indigo-100 text-sm font-medium">Allocation</p>
                                            <p className="text-3xl font-bold">{assignment.allocationPercentage}%</p>
                                        </div>
                                        <div className="w-12 h-12 bg-indigo-400/30 rounded-full flex items-center justify-center">
                                            <Percent className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-emerald-100 text-sm font-medium">Engineer Skills</p>
                                            <p className="text-3xl font-bold">{assignment.engineer?.skills?.length || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                                            <Award className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium">Days Active</p>
                                            <p className="text-3xl font-bold">
                                                {Math.ceil((new Date().getTime() - new Date(assignment.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-400/30 rounded-full flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm font-medium">Status</p>
                                            <p className="text-3xl font-bold">Active</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Assignment Info */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Project & Role Card */}
                        <Card className="bg-white border border-gray-200 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Project & Role</h2>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {assignment.project?.name || 'Project Name'}
                                    </h3>
                                    <Badge className="bg-indigo-700 text-white border-0">
                                        {assignment.role}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm text-gray-600">Allocation:</span>
                                        <span className="font-medium text-indigo-700">{assignment.allocationPercentage}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <Badge className="bg-emerald-700 text-white border-0">
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Engineer Info */}
                        <Card className="bg-white border border-gray-200 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Assigned Engineer</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {assignment.engineer ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                {assignment.engineer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {assignment.engineer.name}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {assignment.engineer.skills && assignment.engineer.skills.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {assignment.engineer.skills.map((skill, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No engineer assigned</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="bg-white border border-gray-200 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-indigo-800">Start Date:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {new Date(assignment.startDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {assignment.endDate && (
                                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-indigo-600" />
                                                <span className="text-sm font-medium text-indigo-800">End Date:</span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {new Date(assignment.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-indigo-800">Created:</span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {new Date(assignment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        {(isManager || isAssignedEngineer) && (
                            <Card className="bg-white border border-gray-200 shadow-lg">
                                <CardHeader className="pb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Actions</h3>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isManager && (
                                        <>
                                            <Button
                                                onClick={handleEdit}
                                                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white border-0"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Assignment
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleDelete}
                                                className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Assignment
                                            </Button>
                                        </>
                                    )}

                                    {isAssignedEngineer && (
                                        <div className='text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200'>
                                            <h2 className='text-lg font-semibold text-emerald-800 mb-2'>Engineers Are the Foundation of Company Growth</h2>
                                            <p className='text-emerald-700'>All the Best For Your Project!</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Info */}
                        <Card className="bg-white border border-gray-200 shadow-lg">
                            <CardHeader className="pb-4">
                                <h3 className="text-lg font-bold text-gray-900">Quick Info</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Building className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-medium text-indigo-800">Project</span>
                                    </div>
                                    <p className="text-gray-900">{assignment.project?.name || 'Unknown Project'}</p>
                                </div>

                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-medium text-emerald-800">Engineer</span>
                                    </div>
                                    <p className="text-gray-900">{assignment.engineer?.name || 'Unknown Engineer'}</p>
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Award className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-800">Role</span>
                                    </div>
                                    <p className="text-gray-900">{assignment.role}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetail; 