import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Link } from 'react-router-dom';
import { engineerService, authService } from '../../services';
import type { Engineer } from '../../services';
import { toast } from 'sonner';

interface EngineerWithCapacity extends Engineer {
  availableCapacity?: number;
}

export default function EngineerListPage() {
  const [engineers, setEngineers] = useState<EngineerWithCapacity[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    if (user && user.role !== 'manager') {
      toast.error('Access denied. Only managers can view engineers.');
      return;
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'manager') {
      const fetchEngineers = async () => {
        try {
          setLoading(true);
          const response = await engineerService.getEngineers();
          setEngineers(response.engineers);
        } catch (error: any) {
          console.error('Failed to fetch engineers:', error);
          toast.error('Failed to fetch engineers');
        } finally {
          setLoading(false);
        }
      };

      fetchEngineers();
    }
  }, [currentUser]);

  const filtered = engineers.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading engineers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">Engineers</h2>
        <p className="text-gray-600">Manage and view all engineers in your team</p>
      </div>
      
      <Input
        placeholder="Search by name or skill..."
        className="mb-6 max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No engineers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((engineer) => (
            <Link to={`/engineers/${engineer.id}`} key={engineer.id}>
              <Card className="cursor-pointer border border-gray-200 transition hover:shadow-lg hover:border-red-300">
                <CardContent className="space-y-3 p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{engineer.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {engineer.role}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Seniority:</span> {engineer.seniority || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Department:</span> {engineer.department || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {engineer.email}
                    </p>
                  </div>
                  
                  {engineer.skills && engineer.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {engineer.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{engineer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
