import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CheckCircle2, RotateCcw, Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminDashboard() {
  const [requests, setRequests] = useState<AuditRequest[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
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
        throw new Error("Update failed. This is likely due to Row Level Security (RLS) policies in Supabase blocking the update. Please check your Supabase dashboard and add an UPDATE policy for the 'audit_requests' table.");
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
        throw new Error("Delete failed. This is likely due to Row Level Security (RLS) policies in Supabase blocking the deletion. Please check your Supabase dashboard and add a DELETE policy for the 'blog_posts' table.");
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

  const pendingRequests = requests.filter(r => r.status !== 'completed');
  const completedRequests = requests.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">SiteNova Admin</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your website leads and content</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { throw new Error("This is a Sentry test error from the Admin Dashboard!"); }} variant="destructive">
              Test Sentry Error
            </Button>
            <Button onClick={fetchData} variant="secondary">
              Refresh Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="leads">Audit Requests</TabsTrigger>
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Requests ({pendingRequests.length})</h2>
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : pendingRequests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No pending requests! You're all caught up.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
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
                            <TableCell className="font-medium">{request.name}</TableCell>
                            <TableCell>{request.email}</TableCell>
                            <TableCell>{request.mobile || 'N/A'}</TableCell>
                            <TableCell>
                              <a href={request.website_url.startsWith('http') ? request.website_url : `https://${request.website_url}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {request.website_url}
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => updateRequestStatus(request.id, 'completed')} className="gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Mark Done
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
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">Completed (Auto-deletes in 30 days)</h2>
                <div className="bg-card/50 border border-border/40 rounded-xl overflow-hidden shadow-sm opacity-80">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
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
                            <TableCell className="font-medium text-muted-foreground">{request.name}</TableCell>
                            <TableCell className="text-muted-foreground">{request.email}</TableCell>
                            <TableCell className="text-muted-foreground">{request.mobile || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => updateRequestStatus(request.id, 'pending')} className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Undo
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
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
              <Button asChild className="gap-2">
                <Link to="/admin/blog/new">
                  <Plus className="w-4 h-4" />
                  New Post
                </Link>
              </Button>
            </div>
            
            <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No blog posts found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
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
                              <Button size="icon" variant="outline" asChild>
                                <Link to={`/admin/blog/${post.id}`}>
                                  <Pencil className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button size="icon" variant="destructive" onClick={() => deletePost(post.id)}>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
