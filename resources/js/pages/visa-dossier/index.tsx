import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Upload, FileText, Trash2, Download, Image, DollarSign, Plane, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface VisaDocument {
    id: number;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    file_size_formatted: string;
    document_type: 'identity' | 'financial' | 'travel';
    is_image: boolean;
    created_at: string;
}

interface DocumentGroups {
    identity: VisaDocument[];
    financial: VisaDocument[];
    travel: VisaDocument[];
}

interface Props {
    documents: DocumentGroups;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VISA Dossier',
        href: '/visa-dossier',
    },
];

const documentTypeConfig = {
    identity: {
        label: 'Identity Documents',
        icon: User,
        description: 'Passport, ID cards, birth certificates',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    financial: {
        label: 'Financial Documents',
        icon: DollarSign,
        description: 'Bank statements, salary slips, tax returns',
        color: 'bg-green-50 border-green-200 text-green-800',
    },
    travel: {
        label: 'Travel Documents',
        icon: Plane,
        description: 'Flight tickets, hotel bookings, itinerary',
        color: 'bg-purple-50 border-purple-200 text-purple-800',
    },
};

export default function VisaDossierIndex({ documents }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
            if (!allowedTypes.includes(file.type)) {
                setUploadMessage({
                    type: 'error',
                    text: 'Only PDF, PNG, and JPG files are allowed.',
                });
                return;
            }

            // Validate file size (4MB)
            if (file.size > 4 * 1024 * 1024) {
                setUploadMessage({
                    type: 'error',
                    text: 'File size must be less than 4MB.',
                });
                return;
            }

            setSelectedFile(file);
            setUploadMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !documentType) {
            setUploadMessage({
                type: 'error',
                text: 'Please select a file and document type.',
            });
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('document_type', documentType);

            const response = await fetch('/api/visa-documents', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setUploadMessage({
                    type: 'success',
                    text: 'File uploaded successfully!',
                });
                setSelectedFile(null);
                setDocumentType('');
                // Reset file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                
                // Refresh the page to show new document
                router.reload();
            } else {
                setUploadMessage({
                    type: 'error',
                    text: result.message || 'Upload failed.',
                });
            }
        } catch (error) {
            setUploadMessage({
                type: 'error',
                text: 'An error occurred during upload.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (documentId: number) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            const response = await fetch(`/api/visa-documents/${documentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                router.reload();
            } else {
                alert('Failed to delete document.');
            }
        } catch (error) {
            alert('An error occurred while deleting the document.');
        }
    };

    const handleDownload = (documentId: number) => {
        window.open(`/api/visa-documents/${documentId}/download`, '_blank');
    };

    const getFileIcon = (document: VisaDocument) => {
        if (document.is_image) {
            return <Image className="h-5 w-5" />;
        }
        return <FileText className="h-5 w-5" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="VISA Dossier" />
            
            <div className="px-4 py-6 space-y-8">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload Document
                        </CardTitle>
                        <CardDescription>
                            Upload your VISA documents. Supported formats: PDF, PNG, JPG (max 4MB)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {uploadMessage && (
                            <Alert className={uploadMessage.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                                <AlertDescription className={uploadMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                                    {uploadMessage.text}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="file-upload">Select File</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileSelect}
                                    disabled={isUploading}
                                />
                                {selectedFile && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="document-type">Document Type</Label>
                                <Select value={documentType} onValueChange={setDocumentType} disabled={isUploading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="identity">Identity Documents</SelectItem>
                                        <SelectItem value="financial">Financial Documents</SelectItem>
                                        <SelectItem value="travel">Travel Documents</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={handleUpload} 
                            disabled={!selectedFile || !documentType || isUploading}
                            className="w-full md:w-auto"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Documents List */}
                <div className="space-y-6">
                    {Object.entries(documentTypeConfig).map(([type, config]) => {
                        const typeDocuments = documents[type as keyof DocumentGroups] || [];
                        const IconComponent = config.icon;
                        
                        return (
                            <Card key={type}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <IconComponent className="h-5 w-5" />
                                        {config.label}
                                        <Badge variant="secondary" className="ml-auto">
                                            {typeDocuments.length}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>{config.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {typeDocuments.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">
                                            No documents uploaded yet
                                        </p>
                                    ) : (
                                        <div className="grid gap-3">
                                            {typeDocuments.map((document) => (
                                                <div
                                                    key={document.id}
                                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {getFileIcon(document)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">
                                                                {document.original_name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {document.file_size_formatted} • {new Date(document.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDownload(document.id)}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(document.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}