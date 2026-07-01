import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, subDays } from "date-fns";
import { 
  CheckCircle2, 
  RotateCcw, 
  Pencil, 
  Trash2, 
  Plus, 
  Download, 
  Search, 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Clock,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

type AuditRequest = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  website_url: string;
  status: 'pending' | 'completed';
  created_at: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
};

const PhoneCell = ({ mobile, className }: { mobile: string, className?: string }) => {
  const { toast } = useToast();
  const [isLongPress, setIsLongPress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!mobile) return <span className={className || "text-muted-foreground"}>N/A</span>;

  const startPress = () => {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      navigator.clipboard.writeText(mobile);
      toast({ title: "Copied!", description: "Phone number copied to clipboard." });
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress) {
      e.preventDefault();
      setIsLongPress(false);
    }
  };

  return (
    <a
      href={`tel:${mobile}`}
      className={`text-primary hover:underline select-none ${className || ''}`}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onClick={handleClick}
    >
      {mobile}
    </a>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'blogs'>('overview');
  const [requests, setRequests] = useState<AuditRequest[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsResponse, postsResponse] = await Promise.all([
        supabase.from("audit_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("id, title, slug, created_at").order("created_at", { ascending: false })
      ]);

      if (requestsResponse.error) throw requestsResponse.error;
      if (postsResponse.error) throw postsResponse.error;

      setRequests(requestsResponse.data || []);
      setPosts(postsResponse.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, newStatus: 'pending' | 'completed') => {
    try {
      const { data, error } = await supabase
        .from("audit_requests")
        .update({ status: newStatus })
        .eq("id", id)
        .select();
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Update failed. Check Supabase RLS policies for 'audit_requests'.");
      }
      
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast({ title: "Success", description: `Request marked as ${newStatus}.` });
    } catch (error: unknown) {
      console.error("Error updating request:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update request.";
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    
    try {
      const { data, error } = await supabase.from("blog_posts").delete().eq("id", id).select();
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Delete failed. Check Supabase RLS policies for 'blog_posts'.");
      }
      
      setPosts(posts.filter(p => p.id !== id));
      toast({ title: "Success", description: "Blog post deleted." });
    } catch (error: unknown) {
      console.error("Error deleting post:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete post.";
      toast({ title: "Delete Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleExport = () => {
    if (requests.length === 0) {
      toast({ title: "No Data", description: "There are no requests to export." });
      return;
    }

    const headers = ["Date", "Name", "Email", "Mobile", "Website", "Status"];
    const csvRows = [headers.join(",")];

    requests.forEach((req) => {
      const row = [
        format(new Date(req.created_at), "yyyy-MM-dd HH:mm:ss"),
        `"${req.name.replace(/"/g, '""')}"`,
        `"${req.email.replace(/"/g, '""')}"`,
        `"${(req.mobile || "").replace(/"/g, '""')}"`,
        `"${req.website_url.replace(/"/g, '""')}"`,
        req.status
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `site-nova-leads-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: "Success", description: "Export started successfully." });
  };

  // --- Derived Data ---
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        date: format(d, 'MMM dd'),
        leads: 0
      };
    });
    
    requests.forEach(req => {
      const reqDate = format(new Date(req.created_at), 'MMM dd');
      const day = days.find(d => d.date === reqDate);
      if (day) {
        day.leads += 1;
      }
    });
    return days;
  }, [requests]);

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.mobile && r.mobile.includes(searchQuery)) ||
    r.website_url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pendingRequests = filteredRequests.filter(r => r.status !== 'completed');
  const completedRequests = filteredRequests.filter(r => r.status === 'completed');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Audit Requests', icon: Users, badge: requests.filter(r => r.status !== 'completed').length },
    { id: 'blogs', label: 'Blog Posts', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/40 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">S</div>
          <span className="font-bold tracking-tight">Admin</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          Menu
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-r border-border/40 bg-card/40 flex-shrink-0 flex flex-col transition-all ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">S</div>
            <span className="font-bold text-lg tracking-tight">SiteNova Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-2">
          <Button variant="destructive" className="w-full justify-start gap-2" size="sm" onClick={() => { throw new Error("This is a Sentry test error from the Admin Dashboard!"); }}>
            <AlertTriangle className="w-4 h-4" />
            Test Sentry
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-65px)] md:h-screen overflow-hidden">
        
        {/* Top Header Actions */}
        <header className="h-16 flex flex-shrink-0 items-center justify-between px-6 lg:px-8 border-b border-border/40 bg-background/95 backdrop-blur z-10">
          <h2 className="text-xl font-bold tracking-tight capitalize">
            {activeTab === 'leads' ? 'Audit Requests' : activeTab}
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={fetchData} variant="ghost" size="icon" title="Refresh Data">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {(activeTab === 'overview' || activeTab === 'leads') && (
              <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            )}
            {activeTab === 'blogs' && (
              <Button asChild size="sm" className="gap-2">
                <Link to="/admin/blog/new">
                  <Plus className="w-4 h-4" />
                  New Post
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="bg-card/40 border-border/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{requests.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time requests</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/40 border-border/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Action</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{requests.filter(r => r.status !== 'completed').length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Require follow up</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/40 border-border/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{requests.filter(r => r.status === 'completed').length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Successfully closed</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/40 border-border/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Published Blogs</CardTitle>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{posts.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active content pieces</p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="bg-card/30 border-border/40">
                <CardHeader>
                  <CardTitle>Lead Generation Activity</CardTitle>
                  <CardDescription>Number of audit requests received over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-80 w-full pl-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                      <RechartsTooltip 
                        cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}} 
                        contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))'}} 
                        itemStyle={{color: 'hsl(var(--primary))'}}
                      />
                      <Bar dataKey="leads" name="Leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or website..." 
                  className="pl-9 bg-card/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Pending Actions
                  <Badge variant="secondary">{pendingRequests.length}</Badge>
                </h3>
                <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
                  {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                  ) : pendingRequests.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-secondary/10">No pending requests! You're all caught up.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-secondary/20">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Website</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="whitespace-nowrap text-muted-foreground">
                                {format(new Date(request.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-500 border-amber-500/20">Pending</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{request.name}</TableCell>
                              <TableCell>{request.email}</TableCell>
                              <TableCell>
                                <PhoneCell mobile={request.mobile} />
                              </TableCell>
                              <TableCell>
                                <a href={request.website_url.startsWith('http') ? request.website_url : `https://${request.website_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {request.website_url}
                                </a>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" onClick={() => updateRequestStatus(request.id, 'completed')} className="gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Resolve
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>

              {completedRequests.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                    Resolved Leads
                    <Badge variant="outline">{completedRequests.length}</Badge>
                  </h3>
                  <div className="bg-card/20 border border-border/30 rounded-xl overflow-hidden shadow-sm opacity-90">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-secondary/10">
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="whitespace-nowrap text-muted-foreground">
                                {format(new Date(request.created_at), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-500 border-emerald-500/20">Resolved</Badge>
                              </TableCell>
                              <TableCell className="font-medium text-muted-foreground">{request.name}</TableCell>
                              <TableCell className="text-muted-foreground">{request.email}</TableCell>
                              <TableCell>
                                <PhoneCell mobile={request.mobile} className="text-muted-foreground hover:text-primary" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="ghost" onClick={() => updateRequestStatus(request.id, 'pending')} className="gap-2 h-8 text-muted-foreground">
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Reopen
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BLOGS TAB */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : posts.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center gap-3 bg-secondary/5">
                    <FileText className="w-10 h-10 text-muted-foreground/30" />
                    <div className="text-muted-foreground">No blog posts found. Start writing!</div>
                    <Button asChild className="mt-2 gap-2" variant="outline">
                      <Link to="/admin/blog/new">
                        <Plus className="w-4 h-4" />
                        Create First Post
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-secondary/20">
                        <TableRow>
                          <TableHead>Published</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>URL Slug</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {format(new Date(post.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell className="text-muted-foreground">/{post.slug}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" asChild className="h-8 w-8">
                                  <Link to={`/admin/blog/${post.id}`}>
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deletePost(post.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
