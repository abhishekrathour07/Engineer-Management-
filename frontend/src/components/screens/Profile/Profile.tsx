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

export default function EngineerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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
    return role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getSeniorityColor = (seniority: string) => {
    switch (seniority) {
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'mid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">My Profile</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {profile ? getInitials(profile.name) : 'U'}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile?.name || 'User Name'}</h3>
                <p className="text-gray-600">{profile?.email || 'user@example.com'}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Role:</span>
              <Badge className={getRoleColor(profile?.role || 'engineer')}>
                {profile?.role || 'engineer'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Seniority:</span>
              <Badge className={getSeniorityColor(profile?.seniority || 'junior')}>
                {profile?.seniority || 'junior'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Department:</span>
              <span className="text-sm">{profile?.department || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Max Capacity:</span>
              <span className="text-sm">{profile?.maxCapacity || 100}%</span>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-600">Skills:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No skills specified</span>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500">
                <p>Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p>Last updated: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="role" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input {...field} disabled /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="skills" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills (comma-separated)</FormLabel>
                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="seniority" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seniority</FormLabel>
                    <FormControl><Input {...field} placeholder="junior | mid | senior" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="maxCapacity" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Capacity (%)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="department" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
