import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Shield, Users, BookOpen, MessageSquare, AlertCircle, Compass } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { useAuth } from '../hooks/useAuth';

interface AnalyticsData {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  popularStates: Array<{ _id: string; count: number }>;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, usersRes] = await Promise.all([
          axiosInstance.get('/users/admin/analytics'),
          axiosInstance.get('/users'),
        ]);

        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.data);
        }
        if (usersRes.data.success) {
          setUsersList(usersRes.data.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-brand-500" />
          Admin Control Center
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-xl text-brand-500 shrink-0">
                <Users className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Members</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-1">{analytics.totalUsers}</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-xl text-brand-500 shrink-0">
                <BookOpen className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Travel Tales</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-1">{analytics.totalPosts}</h4>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-slate-800 rounded-xl text-brand-500 shrink-0">
                <MessageSquare className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Comments Posted</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-1">{analytics.totalComments}</h4>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              👤 Explorer Accounts ({usersList.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 text-xs font-bold uppercase">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="text-gray-700 dark:text-slate-350">
                      <td className="py-3 flex items-center gap-2.5">
                        <img src={usr.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold">{usr.name}</span>
                      </td>
                      <td className="py-3">{usr.email}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          usr.role === 'admin'
                            ? 'bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/20'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                ⚙️ Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/destinations"
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm font-semibold text-gray-750 dark:text-slate-200 border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <Compass className="w-5 h-5 text-brand-500" />
                  <span>Curate Destinations</span>
                </Link>
                <Link
                  to="/create-blog"
                  className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-sm font-semibold text-gray-750 dark:text-slate-200 border border-gray-100 dark:border-slate-800 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-brand-500" />
                  <span>Publish Admin Log</span>
                </Link>
              </div>
            </div>

            {analytics && analytics.popularStates && (
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                  🗺️ Top Travel States
                </h3>
                <div className="space-y-2.5">
                  {analytics.popularStates.map((stateCount, i) => (
                    <div key={stateCount._id} className="flex justify-between items-center text-xs font-semibold text-gray-600 dark:text-slate-350">
                      <span>{i + 1}. {stateCount._id || 'Unknown'}</span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-bold">{stateCount.count} posts</span>
                    </div>
                  ))}
                  {analytics.popularStates.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No posts categorized yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
