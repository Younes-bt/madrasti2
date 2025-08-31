/**
 * API Integration Demo Component
 * Demonstrates all API services and hooks working together
 */

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Import our services and hooks
import { authService, usersService, schoolsService } from '../../services/index.js';
import { useApi, useFetch, useMutation, useSearch } from '../../hooks/useApi.js';
import { queryClient, setupReactQuery } from '../../lib/reactQuery.js';
import { setupOfflineSupport } from '../../utils/storage.js';

// Component to test authentication
const AuthenticationTest = () => {
  const [credentials, setCredentials] = useState({
    email: 'teacher@madrasti.ma',
    password: 'demo123'
  });

  const loginMutation = useMutation(authService.login, {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });

  const logoutMutation = useMutation(authService.logout, {
    onSuccess: () => {
      console.log('Logout successful');
    }
  });

  const profileQuery = useFetch(usersService.getProfile, {
    dependencies: [loginMutation.data] // Refetch when login succeeds
  });

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🔐 Authentication Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => loginMutation.execute(credentials)}
            disabled={loginMutation.loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginMutation.loading ? 'Logging in...' : 'Login'}
          </button>
          
          <button
            onClick={() => logoutMutation.execute()}
            disabled={logoutMutation.loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {logoutMutation.loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        
        {loginMutation.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            Login Error: {loginMutation.error.message || 'Unknown error'}
          </div>
        )}
        
        {loginMutation.data && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700">✅ Login Successful!</p>
            <p className="text-sm text-gray-600 mt-1">
              User: {loginMutation.data.user?.full_name} ({loginMutation.data.user?.role})
            </p>
          </div>
        )}
        
        {profileQuery.loading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
            Loading profile...
          </div>
        )}
        
        {profileQuery.data && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium">Profile Data:</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(profileQuery.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Component to test users API
const UsersAPITest = () => {
  const usersQuery = useFetch(() => usersService.getUsers({ page_size: 5 }), {
    dependencies: []
  });

  const { 
    data: searchResults, 
    search, 
    searchQuery, 
    isSearching 
  } = useSearch(usersService.searchUsers);

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">👥 Users API Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search Users:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => search(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full p-2 border rounded"
          />
          {isSearching && (
            <p className="text-sm text-blue-600 mt-1">Searching...</p>
          )}
        </div>
        
        {usersQuery.loading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
            Loading users...
          </div>
        )}
        
        {usersQuery.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
            Users Error: {usersQuery.error.message || 'Unknown error'}
          </div>
        )}
        
        {searchResults && searchResults.results && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium">Search Results ({searchResults.count}):</p>
            <div className="mt-2 space-y-2">
              {searchResults.results.slice(0, 3).map(user => (
                <div key={user.id} className="p-2 bg-white border rounded text-sm">
                  {user.full_name} ({user.email}) - {user.role}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {usersQuery.data && usersQuery.data.results && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium">All Users ({usersQuery.data.count}):</p>
            <div className="mt-2 space-y-2">
              {usersQuery.data.results.map(user => (
                <div key={user.id} className="p-2 bg-white border rounded text-sm">
                  {user.full_name} ({user.email}) - {user.role}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => usersQuery.refetch()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Users
        </button>
      </div>
    </div>
  );
};

// Component to test schools API
const SchoolsAPITest = () => {
  const schoolConfigQuery = useFetch(schoolsService.getSchoolConfig);
  const gradesQuery = useFetch(() => schoolsService.getGrades({ page_size: 10 }));
  const subjectsQuery = useFetch(() => schoolsService.getSubjects({ page_size: 10 }));

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🏫 Schools API Test</h3>
      
      <div className="space-y-4">
        {schoolConfigQuery.loading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
            Loading school configuration...
          </div>
        )}
        
        {schoolConfigQuery.data && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium">School Configuration:</p>
            <div className="text-sm mt-2">
              <p><strong>Name:</strong> {schoolConfigQuery.data.name}</p>
              <p><strong>Email:</strong> {schoolConfigQuery.data.email}</p>
              <p><strong>Address:</strong> {schoolConfigQuery.data.address}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium mb-2">Grades:</p>
            {gradesQuery.loading ? (
              <p className="text-sm text-blue-600">Loading grades...</p>
            ) : gradesQuery.data?.results ? (
              <div className="space-y-1">
                {gradesQuery.data.results.map(grade => (
                  <div key={grade.id} className="text-sm p-2 bg-white border rounded">
                    {grade.name} (Level: {grade.educational_level_name})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No grades found</p>
            )}
          </div>
          
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <p className="font-medium mb-2">Subjects:</p>
            {subjectsQuery.loading ? (
              <p className="text-sm text-blue-600">Loading subjects...</p>
            ) : subjectsQuery.data?.results ? (
              <div className="space-y-1">
                {subjectsQuery.data.results.map(subject => (
                  <div key={subject.id} className="text-sm p-2 bg-white border rounded">
                    {subject.name} ({subject.code})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No subjects found</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => gradesQuery.refetch()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Grades
          </button>
          <button
            onClick={() => subjectsQuery.refetch()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Refresh Subjects
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to test error handling
const ErrorHandlingTest = () => {
  const [testEndpoint, setTestEndpoint] = useState('invalid-endpoint');
  
  const errorTestQuery = useApi(
    () => {
      // Simulate different types of errors
      if (testEndpoint === '401-error') {
        const error = new Error('Unauthorized');
        error.response = { status: 401 };
        throw error;
      }
      if (testEndpoint === '404-error') {
        const error = new Error('Not Found');
        error.response = { status: 404 };
        throw error;
      }
      if (testEndpoint === 'network-error') {
        const error = new Error('Network Error');
        error.isNetworkError = true;
        throw error;
      }
      throw new Error('Invalid endpoint');
    }
  );

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">⚠️ Error Handling Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Test Error Type:</label>
          <select
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="invalid-endpoint">Invalid Endpoint</option>
            <option value="401-error">401 Unauthorized</option>
            <option value="404-error">404 Not Found</option>
            <option value="network-error">Network Error</option>
          </select>
        </div>
        
        <button
          onClick={() => errorTestQuery.execute()}
          disabled={errorTestQuery.loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {errorTestQuery.loading ? 'Testing...' : 'Trigger Error'}
        </button>
        
        {errorTestQuery.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="font-medium text-red-700">Error Caught:</p>
            <div className="text-sm mt-2">
              <p><strong>Type:</strong> {errorTestQuery.error.type}</p>
              <p><strong>Severity:</strong> {errorTestQuery.error.severity}</p>
              <p><strong>Message:</strong> {errorTestQuery.error.message}</p>
              <p><strong>Code:</strong> {errorTestQuery.error.code}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component to show offline capabilities
const OfflineTest = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingOps, setPendingOps] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">📱 Offline Support Test</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            Status: {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="font-medium mb-2">Offline Features:</p>
          <ul className="text-sm space-y-1">
            <li>• Critical data cached for offline access</li>
            <li>• Pending operations queued for sync when online</li>
            <li>• User preferences persist offline</li>
            <li>• Automatic retry on connection restore</li>
          </ul>
        </div>
        
        {!isOnline && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
            ⚠️ You are currently offline. Some features may be limited.
          </div>
        )}
        
        <button
          onClick={() => {
            // Simulate going offline for testing
            window.dispatchEvent(new Event('offline'));
            setTimeout(() => window.dispatchEvent(new Event('online')), 3000);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Simulate Offline/Online
        </button>
      </div>
    </div>
  );
};

// Main Demo Component
const APIIntegrationDemo = () => {
  const [activeTab, setActiveTab] = useState('auth');

  // Setup React Query and offline support
  useEffect(() => {
    setupReactQuery();
    const cleanup = setupOfflineSupport();
    return cleanup;
  }, []);

  const tabs = [
    { id: 'auth', label: '🔐 Authentication', component: AuthenticationTest },
    { id: 'users', label: '👥 Users API', component: UsersAPITest },
    { id: 'schools', label: '🏫 Schools API', component: SchoolsAPITest },
    { id: 'errors', label: '⚠️ Error Handling', component: ErrorHandlingTest },
    { id: 'offline', label: '📱 Offline Support', component: OfflineTest },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AuthenticationTest;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Madrasti 2.0 - API Integration Demo
            </h1>
            <p className="text-gray-600">
              Comprehensive testing of all API services, hooks, and integrations
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Component */}
          <ActiveComponent />
          
          {/* API Status */}
          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📊 API Status & Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Base URL:</p>
                <p className="text-gray-600">http://localhost:8000/api/</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Environment:</p>
                <p className="text-gray-600">Development</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">React Query:</p>
                <p className="text-gray-600">Enabled with DevTools</p>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">📝 Test Instructions</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Start your Django backend server on http://localhost:8000</li>
              <li>Ensure your database is properly migrated and seeded</li>
              <li>Use the Authentication tab to test login with demo credentials</li>
              <li>Explore other tabs to test different API endpoints</li>
              <li>Check browser console for detailed API logs</li>
              <li>Use React Query DevTools (bottom-right) to inspect cache</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-right" />
      
      {/* React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default APIIntegrationDemo;