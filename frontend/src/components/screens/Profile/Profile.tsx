// /app/engineer/profile/page.tsx
'use client'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../ui/form';
import { useEffect, useState } from 'react';
import { Textarea } from '../../ui/textarea';
import { profileSchema, type ProfileForm } from './validation/profileSchema';
import { toast } from 'sonner';
import { profileService } from '../../services';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Mail, 
  Briefcase, 
  Award, 
  Building, 
  Calendar, 
  Edit3, 
  Save, 
  Star,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

export default function EngineerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      role: 'engineer',
      skills: '',
      seniority: 'junior',
      maxCapacity: 100,
      department: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setInitialLoading(true);
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        form.reset({
          name: profileData.name,
          role: profileData.role as 'engineer' | 'manager',
          skills: profileData.skills?.join(', ') || '',
          seniority: (profileData.seniority || 'junior') as 'junior' | 'mid' | 'senior',
          maxCapacity: profileData.maxCapacity || 100,
          department: profileData.department || '',
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: ProfileForm) => {
    try {
      setLoading(true);
      const updateData = {
        name: values.name,
        skills: values.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        seniority: values.seniority,
        maxCapacity: values.maxCapacity,
        department: values.department,
      };
      
      const updatedProfile = await profileService.updateProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    return role === 'manager' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600';
  };

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'bg-gradient-to-r from-amber-500 to-orange-600';
      case 'mid': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-600';
    }
  };

  const getSeniorityIcon = (seniority: string) => {
    switch (seniority) {
      case 'senior': return <Star className="w-4 h-4" />;
      case 'mid': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className=" text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Profile Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {profile ? getInitials(profile.name) : 'U'}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{profile?.name || 'User Name'}</h2>
                  <p className="text-slate-600 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile?.email || 'user@example.com'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Role</span>
                    </div>
                    <Badge className={`${getRoleColor(profile?.role || 'engineer')} text-white border-0`}>
                      {profile?.role || 'engineer'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Seniority</span>
                    </div>
                    <Badge className={`${getSeniorityColor(profile?.seniority || 'junior')} text-white border-0 flex items-center gap-1`}>
                      {getSeniorityIcon(profile?.seniority || 'junior')}
                      {profile?.seniority || 'junior'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Department</span>
                    </div>
                    <span className="text-sm text-slate-600">{profile?.department || 'Not specified'}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Capacity</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{profile?.maxCapacity || 100}%</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white/50 border-slate-300 text-slate-700">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No skills specified</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    <span>Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          
          </div>

          <div className="xl:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Edit3 className="w-6 h-6" />
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </CardTitle>
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="name" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/50 border-slate-300 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="role" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Role</FormLabel>
                            <FormControl>
                              <Input {...field} disabled className="bg-slate-100 border-slate-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="seniority" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Seniority Level</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="junior | mid | senior" className="bg-white/50 border-slate-300 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="maxCapacity" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-medium">Maximum Capacity (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="bg-white/50 border-slate-300 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="department" control={form.control} render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">Department</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white/50 border-slate-300 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="skills" control={form.control} render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-700 font-medium">Skills & Technologies (comma-separated)</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={4} 
                                {...field} 
                                placeholder="e.g., React, Node.js, TypeScript, AWS..."
                                className="bg-white/50 border-slate-300 focus:border-blue-500 resize-none" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-slate-200">
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Full Name</label>
                        <p className="text-slate-800 font-medium mt-1">{profile?.name || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Role</label>
                        <p className="text-slate-800 font-medium mt-1">{profile?.role || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Seniority Level</label>
                        <p className="text-slate-800 font-medium mt-1">{profile?.seniority || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Maximum Capacity</label>
                        <p className="text-slate-800 font-medium mt-1">{profile?.maxCapacity || 100}%</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-slate-600">Department</label>
                        <p className="text-slate-800 font-medium mt-1">{profile?.department || 'Not specified'}</p>
                      </div>
                    </div>

                    
                    <div>
                      <label className="text-sm font-medium text-slate-600">Skills & Technologies</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile?.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-sm bg-slate-50 border-slate-300 text-slate-700">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-slate-500 mt-1">No skills specified</p>
                        )}

                      </div>
                    </div>
                    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Projects Completed</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Current Assignments</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Team Members</span>
                    <span className="font-bold">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          
        </div>
      </div>
    </div>
  );
}
