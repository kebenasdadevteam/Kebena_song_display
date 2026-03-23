import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User as UserType } from '../types';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { toast, Toaster } from 'sonner';
import churchLogo from '../assets/3887ae57771394e51301a4417cbc2775554606f6.png';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin' as const
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    name: 'Regular User',
    role: 'user' as const
  },
  {
    id: '3',
    username: 'pastor',
    password: 'pastor123',
    name: 'Pastor Daniel',
    role: 'admin' as const
  },
  {
    id: '4',
    username: 'songleader',
    password: 'song123',
    name: 'Worship Leader',
    role: 'song_leader' as const
  },
  {
    id: '5',
    username: 'leader',
    password: 'leader123',
    name: 'Music Director',
    role: 'song_leader' as const
  }
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Find user in mock database
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Successful login
      toast.success('Login successful!', {
        description: `Welcome back, ${user.name}`
      });
      onLogin({
        id: user.id,
        name: user.name,
        role: user.role
      });
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #865014 0%, #E0AE3F 50%, #865014 100%)' }}>
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto mb-4">
                <img src={churchLogo} alt="Kebena Church Logo" className="h-24 w-24 mx-auto object-contain" />
              </div>
              <CardTitle className="text-2xl">Kebena Seventh-Day Adventist Church</CardTitle>
              <CardDescription>
                Song Display System Login
                <br />
                የቀበና ቤተክርስትያን የመዝሙር ማሳያ ስርዓት
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Login / ግባ
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-sm hover:underline w-full text-center"
                  style={{ color: '#865014' }}
                >
                  {showCredentials ? 'Hide' : 'Show'} Demo Credentials
                </button>

                {showCredentials && (
                  <div className="mt-3 space-y-2 text-xs bg-gray-50 p-3 rounded">
                    <div className="space-y-1">
                      <p className="font-semibold" style={{ color: '#865014' }}>Admin Accounts:</p>
                      <p>Username: <code className="bg-white px-1">admin</code> / Password: <code className="bg-white px-1">admin123</code></p>
                      <p>Username: <code className="bg-white px-1">pastor</code> / Password: <code className="bg-white px-1">pastor123</code></p>
                    </div>
                    <div className="space-y-1 pt-2 border-t">
                      <p className="font-semibold" style={{ color: '#B7791F' }}>Song Leader Accounts:</p>
                      <p>Username: <code className="bg-white px-1">songleader</code> / Password: <code className="bg-white px-1">song123</code></p>
                      <p>Username: <code className="bg-white px-1">leader</code> / Password: <code className="bg-white px-1">leader123</code></p>
                    </div>
                    <div className="space-y-1 pt-2 border-t">
                      <p className="font-semibold" style={{ color: '#E0AE3F' }}>Regular User:</p>
                      <p>Username: <code className="bg-white px-1">user</code> / Password: <code className="bg-white px-1">user123</code></p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          
        </div>
      </div>
    </>
  );
}