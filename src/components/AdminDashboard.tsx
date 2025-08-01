import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Home, TrendingUp, Calendar, Download, Eye } from 'lucide-react';

interface AdminProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  joinDate: string;
  status: 'matched' | 'pending' | 'declined';
  compatibilityScores: number[];
  assignedRoom?: string;
  matchedWith?: string;
}

const AdminDashboard = () => {
  const [profiles] = useState<AdminProfile[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 26,
      occupation: 'Software Engineer',
      joinDate: '2024-01-15',
      status: 'matched',
      compatibilityScores: [92, 88, 76],
      assignedRoom: 'A-204',
      matchedWith: 'Emma Wilson'
    },
    {
      id: '2',
      name: 'Emma Wilson',
      age: 24,
      occupation: 'Marketing Manager',
      joinDate: '2024-01-10',
      status: 'matched',
      compatibilityScores: [92, 85, 82],
      assignedRoom: 'A-204',
      matchedWith: 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'Maya Patel',
      age: 28,
      occupation: 'UX Designer',
      joinDate: '2024-01-20',
      status: 'pending',
      compatibilityScores: [89, 78, 74],
    },
    {
      id: '4',
      name: 'Jessica Chen',
      age: 25,
      occupation: 'Data Analyst',
      joinDate: '2024-01-18',
      status: 'pending',
      compatibilityScores: [87, 82, 79],
    }
  ]);

  const [rooms] = useState([
    { number: 'A-204', floor: 2, occupied: true, tenants: ['Sarah Johnson', 'Emma Wilson'], rent: 1200 },
    { number: 'A-205', floor: 2, occupied: false, tenants: [], rent: 1200 },
    { number: 'B-301', floor: 3, occupied: false, tenants: [], rent: 1300 },
    { number: 'B-302', floor: 3, occupied: false, tenants: [], rent: 1300 },
  ]);

  const stats = {
    totalProfiles: profiles.length,
    matchedProfiles: profiles.filter(p => p.status === 'matched').length,
    pendingProfiles: profiles.filter(p => p.status === 'pending').length,
    occupancyRate: Math.round((rooms.filter(r => r.occupied).length / rooms.length) * 100)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage roommate profiles, matches, and room assignments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Profiles</p>
                  <p className="text-2xl font-bold">{stats.totalProfiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Matched</p>
                  <p className="text-2xl font-bold">{stats.matchedProfiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingProfiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles">User Profiles</TabsTrigger>
            <TabsTrigger value="matches">Match Results</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Profiles</h2>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
            </div>

            <div className="grid gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id} className="shadow-gentle">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {profile.age} • {profile.occupation}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined: {new Date(profile.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(profile.status)}>
                            {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                          </Badge>
                          {profile.assignedRoom && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Room: {profile.assignedRoom}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {profile.compatibilityScores.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Top Compatibility Scores:</p>
                        <div className="flex gap-2">
                          {profile.compatibilityScores.slice(0, 3).map((score, idx) => (
                            <Badge key={idx} variant="outline">
                              {score}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Matches</h2>
            <div className="grid gap-4">
              {profiles.filter(p => p.status === 'matched').map((profile) => (
                <Card key={profile.id} className="shadow-gentle">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Matched with: {profile.matchedWith}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Room: {profile.assignedRoom}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {Math.max(...profile.compatibilityScores)}% Match
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4">
            <h2 className="text-xl font-semibold">Room Management</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Card key={room.number} className="shadow-gentle">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Room {room.number}</h3>
                      <Badge className={room.occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {room.occupied ? 'Occupied' : 'Available'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Floor {room.floor} • ${room.rent}/month
                      </p>
                      
                      {room.tenants.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Current Tenants:</p>
                          {room.tenants.map((tenant, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {tenant}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;