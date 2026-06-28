import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e2e',
              color: '#cdd6f4',
              border: '1px solid #313244',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' } },
            error: { iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' } }
          }}
        />
        <Dashboard />
      </div>
    </TaskProvider>
  );
}

export default App;
