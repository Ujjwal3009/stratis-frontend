'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PdfDocument } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  MessageSquare,
  Download,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LibraryPage() {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const data = await api.pdfs.list();
        setPdfs(data);
      } catch (err) {
        toast.error('Failed to load library');
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  return (
    <div className="gradient-bg min-h-screen p-8 pt-24">
      <div className="container mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Your Study Library</h1>
          <p className="mt-2 text-gray-400">
            Interact with your uploaded study materials
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glassmorphism flex h-full flex-col border-white/10">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary border-primary/20"
                    >
                      {pdf.documentType}
                    </Badge>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <CardTitle className="line-clamp-1 text-white">
                    {pdf.originalFilename}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Uploaded on {new Date(pdf.uploadDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex gap-2 pt-4">
                  <Button
                    className="bg-primary/20 hover:bg-primary/40 border-primary/30 flex-1 border text-white"
                    onClick={() => router.push(`/library/${pdf.id}/chat`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Chat
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {pdfs.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-600" />
              <h3 className="text-xl font-semibold text-white">
                No documents yet
              </h3>
              <p className="mt-2 text-gray-500">
                Upload PDFs from the dashboard to start chatting with them.
              </p>
              <Button
                className="glassmorphism mt-6"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
