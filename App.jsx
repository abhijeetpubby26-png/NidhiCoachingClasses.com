import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, FileText, CheckCircle, Users, Settings, 
  LogOut, Plus, Trash2, Shield, Award, Clock, Search, LogIn, UserCheck, AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginRole, setLoginRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBoard, setSelectedBoard] = useState('CBSE Class 10');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [authError, setAuthError] = useState('');

  // Initial Seed Data
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('nidhi_students');
    return saved ? JSON.parse(saved) : [
      { id: 'STU1001', name: 'Rohan Sharma', board: 'CBSE Class 10', active: true, created: '2026-01-15' },
      { id: 'STU1002', name: 'Ananya Verma', board: 'ICSE Class 10', active: true, created: '2026-02-01' }
    ];
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('nidhi_materials');
    return saved ? JSON.parse(saved) : [
      { id: 1, board: 'CBSE Class 10', subject: 'Science', chapter: 'Chemical Reactions and Equations', type: 'PDF', title: 'Chapter Notes & Reactions Summary', url: '#' },
      { id: 2, board: 'CBSE Class 10', subject: 'Science', chapter: 'Chemical Reactions and Equations', type: 'Video', title: 'Types of Chemical Reactions - Recorded Lecture', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, board: 'CBSE Class 10', subject: 'Mathematics', chapter: 'Quadratic Equations', type: 'Worksheet', title: 'Practice Set 1: Standard & Quadratic Form', url: '#' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nidhi_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('nidhi_materials', JSON.stringify(materials));
  }, [materials]);

  // Auth Handling
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (loginRole === 'admin') {
      if (studentId === 'admin' && password === 'admin123') {
        setCurrentUser({ name: 'Nidhi Teacher', role: 'admin' });
      } else {
        setAuthError('Invalid Admin credentials.');
      }
    } else {
      const found = students.find(s => s.id.toLowerCase() === studentId.toLowerCase());
      if (found) {
        if (!found.active) {
          setAuthError('Account deactivated by administrator.');
          return;
        }
        if (password === 'student123' || password === found.id.toLowerCase()) {
          setCurrentUser({ ...found, role: 'student' });
          setSelectedBoard(found.board);
        } else {
          setAuthError('Incorrect Password.');
        }
      } else {
        setAuthError('Student ID not found.');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStudentId('');
    setPassword('');
    setAuthError('');
  };

  // Admin Actions
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBoard, setNewStudentBoard] = useState('CBSE Class 10');

  const addStudent = (e) => {
    e.preventDefault();
    if (!newStudentName) return;
    const newId = `STU${1000 + students.length + 1}`;
    const newStu = {
      id: newId,
      name: newStudentName,
      board: newStudentBoard,
      active: true,
      created: new Date().toISOString().split('T')[0]
    };
    setStudents([...students, newStu]);
    setNewStudentName('');
  };

  const toggleStudentStatus = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-500 text-slate-900 p-2 rounded-lg font-bold text-xl">NC</div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Nidhi Coaching Classes</h1>
              <p className="text-xs text-sky-400">Class 10 CBSE & ICSE Private Portal</p>
            </div>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-md text-sm border border-red-500/30 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentUser ? (
          /* LOGIN SCREEN */
          <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl mt-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Student & Admin Login</h2>
              <p className="text-slate-400 text-sm mt-1">Access private Class 10 learning materials</p>
            </div>

            {/* Role Switcher */}
            <div className="flex bg-slate-900 p-1 rounded-lg mb-6 border border-slate-700">
              <button 
                onClick={() => setLoginRole('student')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${loginRole === 'student' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Student
              </button>
              <button 
                onClick={() => setLoginRole('admin')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${loginRole === 'admin' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Administrator
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  {loginRole === 'admin' ? 'Admin ID' : 'Student ID'}
                </label>
                <input 
                  type="text"
                  required
                  placeholder={loginRole === 'admin' ? 'admin' : 'STU1001'}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 rounded-lg transition mt-4"
              >
                Log In to Portal
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700 text-center text-xs text-slate-500">
              <p>Demo Admin: <span className="text-slate-300">admin / admin123</span></p>
              <p className="mt-1">Demo Student: <span className="text-slate-300">STU1001 / student123</span></p>
            </div>
          </div>
        ) : currentUser.role === 'admin' ? (
          /* ADMIN DASHBOARD */
          <div className="space-y-6">
            <div className="flex space-x-4 border-b border-slate-700 pb-3">
              <button 
                onClick={() => setActiveTab('students')}
                className={`flex items-center space-x-2 pb-2 px-1 font-medium transition ${activeTab === 'students' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                <span>Manage Students</span>
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 pb-2 px-1 font-medium transition ${activeTab === 'dashboard' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Upload Materials</span>
              </button>
            </div>

            {activeTab === 'students' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create Student Form */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 h-fit">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-sky-400" />
                    <span>Create Student Account</span>
                  </h3>
                  <form onSubmit={addStudent} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Student Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Rahul Kumar"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Board Stream</label>
                      <select 
                        value={newStudentBoard}
                        onChange={(e) => setNewStudentBoard(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                      >
                        <option value="CBSE Class 10">CBSE Class 10</option>
                        <option value="ICSE Class 10">ICSE Class 10</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2 rounded-lg transition">
                      Add Student
                    </button>
                  </form>
                </div>

                {/* Student Roster Table */}
                <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-4">Enrolled Students</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900 text-xs text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Student ID</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Board</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {students.map(stu => (
                          <tr key={stu.id} className="hover:bg-slate-750">
                            <td className="p-3 font-mono text-sky-400 font-bold">{stu.id}</td>
                            <td className="p-3 text-white">{stu.name}</td>
                            <td className="p-3">{stu.board}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${stu.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                {stu.active ? 'Active' : 'Deactivated'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button 
                                onClick={() => toggleStudentStatus(stu.id)}
                                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-200 transition"
                              >
                                {stu.active ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* MATERIAL MANAGEMENT */
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">Course Content Overview</h3>
                <p className="text-slate-400 text-sm">Managing notes, lectures, and worksheets for CBSE & ICSE Class 10 Science & Mathematics.</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map(mat => (
                    <div key={mat.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{mat.board} • {mat.subject}</span>
                        <h4 className="font-semibold text-white mt-1">{mat.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{mat.chapter}</p>
                      </div>
                      <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300 font-mono">{mat.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STUDENT DASHBOARD */
          <div className="space-y-6">
            {/* Student Header Info */}
            <div className="bg-gradient-to-r from-sky-900/40 to-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white">Welcome back, {currentUser.name}!</h2>
              <p className="text-slate-300 text-sm mt-1">Enrolled Program: <span className="text-sky-400 font-semibold">{currentUser.board}</span></p>
            </div>

            {/* Subject Selector */}
            <div className="flex space-x-3">
              <button 
                onClick={() => setSelectedSubject('Science')}
                className={`px-4 py-2 rounded-lg font-medium transition ${selectedSubject === 'Science' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Science
              </button>
              <button 
                onClick={() => setSelectedSubject('Mathematics')}
                className={`px-4 py-2 rounded-lg font-medium transition ${selectedSubject === 'Mathematics' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Mathematics
              </button>
            </div>

            {/* Material List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials
                .filter(m => m.board === currentUser.board && m.subject === selectedSubject)
                .map(item => (
                  <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-sky-400">{item.chapter}</span>
                        <h3 className="text-lg font-semibold text-white mt-1">{item.title}</h3>
                      </div>
                      <span className="bg-slate-900 text-xs px-2.5 py-1 rounded-full text-slate-400 font-mono border border-slate-700">{item.type}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg text-sm font-medium border border-sky-500/30 transition flex items-center space-x-1"
                      >
                        <span>Access Material</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
