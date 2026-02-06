'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Users,
  AlertTriangle,
  Cpu,
  RefreshCcw,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, reportsData, configsData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getReports(),
        api.admin.getConfigs(),
      ]);
      setStats(statsData);
      setReports(reportsData);
      setConfigs(configsData);
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      await api.admin.resolveReport(id, 'Issue resolved by admin');
      toast.success('Report marked as resolved');
      fetchData();
    } catch (err) {
      toast.error('Failed to resolve report');
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Activity className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  // Transform usageByArea: [ ["AREA", 123], ...] -> [{name: "AREA", value: 123}]
  const chartData =
    stats?.usageByArea?.map((item: any) => ({
      name: item[0],
      value: item[1],
    })) || [];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  return (
    <div className="gradient-bg min-h-screen p-8 pt-24">
      <div className="container mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Control</h1>
            <p className="mt-2 text-gray-400">
              Platform monitoring and management
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            className="glassmorphism"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            title="Total Tokens"
            value={stats?.totalTokens?.toLocaleString() || '0'}
            icon={<Cpu className="h-6 w-6 text-blue-400" />}
            description="Gemini API Consumption"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers?.toString() || '0'}
            icon={<Users className="h-6 w-6 text-green-400" />}
            description="Registered Accounts"
          />
          <StatCard
            title="Pending Reports"
            value={stats?.pendingReports?.toString() || '0'}
            icon={<AlertTriangle className="h-6 w-6 text-yellow-400" />}
            description="Active Issue Flags"
          />
          <StatCard
            title="Health"
            value="Active"
            icon={<CheckCircle2 className="h-6 w-6 text-emerald-400" />}
            description="System Status"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Usage Chart */}
          <Card className="glassmorphism border-white/10 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Token Distribution</CardTitle>
              <CardDescription>Usage by feature area</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value">
                    {chartData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="glassmorphism border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">User Reports</CardTitle>
              <CardDescription>Reported issues with questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-gray-400">Question ID</TableHead>
                    <TableHead className="text-gray-400">Issue</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} className="border-white/5">
                      <TableCell className="font-mono text-white">
                        #{report.question.id}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-gray-300">
                        {report.issueDescription}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'PENDING'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            report.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-green-500/20 text-green-500'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.status === 'PENDING' && (
                          <Button
                            size="sm"
                            onClick={() => handleResolve(report.id)}
                            className="bg-primary/20 hover:bg-primary/40 text-primary border-primary/30 border"
                          >
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {reports.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-gray-500"
                      >
                        No reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Config System */}
        <div className="mt-10">
          <Card className="glassmorphism border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-400" />
                <CardTitle className="text-white">
                  System Configuration
                </CardTitle>
              </div>
              <CardDescription>
                Hot-swap API keys and toggle platform features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-gray-400">Key</TableHead>
                    <TableHead className="text-gray-400">Value</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs.map((config) => (
                    <TableRow key={config.configKey} className="border-white/5">
                      <TableCell className="text-primary font-mono">
                        {config.configKey}
                      </TableCell>
                      <TableCell className="font-mono text-gray-300">
                        {config.configKey.includes('KEY')
                          ? '••••••••••••'
                          : config.configValue}
                      </TableCell>
                      <TableCell className="text-gray-500 italic">
                        {config.description}
                      </TableCell>
                    </TableRow>
                  ))}
                  {configs.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-10 text-center text-gray-500"
                      >
                        No configurations found. Add them to 'system_configs'
                        table.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <Card className="glassmorphism border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}
