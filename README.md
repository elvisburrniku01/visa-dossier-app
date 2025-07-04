# VISA Dossier Upload Feature

This Laravel application implements a VISA Dossier management system with file upload capabilities.

## Features

- **File Upload**: Upload PDF, PNG, and JPG files up to 4MB
- **Document Categories**: Organize documents into three categories:
  - Identity Documents (passport, ID cards, birth certificates)
  - Financial Documents (bank statements, salary slips, tax returns)
  - Travel Documents (flight tickets, hotel bookings, itinerary)
- **File Management**: View, download, and delete uploaded documents
- **User Authentication**: Secure access with user authentication
- **Responsive UI**: Clean, modern interface built with React and Tailwind CSS

## Technology Stack

- **Backend**: Laravel 12 with API endpoints
- **Frontend**: React with Inertia.js
- **Database**: SQLite (configurable)
- **File Storage**: Laravel's local filesystem
- **UI Components**: Tailwind CSS with shadcn/ui components

## Setup Instructions

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visa-dossier-app
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

5. **Storage setup**
   ```bash
   php artisan storage:link
   ```

6. **Start the Laravel server**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   npm install
   ```

2. **Build assets for development**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8000`

## API Endpoints

### Authentication Required

All API endpoints require authentication. Use Laravel Sanctum tokens or session authentication.

### Endpoints

- **GET** `/api/visa-documents` - List all documents grouped by type
- **POST** `/api/visa-documents` - Upload a new document
- **DELETE** `/api/visa-documents/{id}` - Delete a document
- **GET** `/api/visa-documents/{id}/download` - Download a document

### Upload Request Format

```bash
POST /api/visa-documents
Content-Type: multipart/form-data

file: [FILE] (PDF, PNG, JPG - max 4MB)
document_type: [STRING] (identity|financial|travel)
```

### Response Format

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "original_name": "passport.pdf",
    "file_name": "uuid-filename.pdf",
    "file_path": "visa-documents/uuid-filename.pdf",
    "mime_type": "application/pdf",
    "file_size": 1024000,
    "document_type": "identity",
    "created_at": "2024-01-15T10:00:00.000000Z"
  }
}
```

## Testing the Features

### 1. User Registration/Login

1. Navigate to `http://localhost:8000`
2. Click "Sign up" to create a new account
3. Fill in your details and register
4. You'll be redirected to the dashboard

### 2. Upload Documents

1. Navigate to "VISA Dossier" from the sidebar or header menu
2. In the upload section:
   - Click "Select File" and choose a PDF, PNG, or JPG file (max 4MB)
   - Select a document type from the dropdown
   - Click "Upload Document"
3. The file will be uploaded and appear in the appropriate category

### 3. View Documents

- Documents are automatically grouped by type (Identity, Financial, Travel)
- Each document shows:
  - File name
  - File size
  - Upload date
  - File type icon

### 4. Download Documents

- Click the download button (arrow down icon) next to any document
- The file will be downloaded with its original name

### 5. Delete Documents

- Click the delete button (trash icon) next to any document
- Confirm the deletion in the popup
- The document will be removed from both the database and storage

## File Validation

- **Allowed types**: PDF (.pdf), PNG (.png), JPG (.jpg, .jpeg)
- **Maximum size**: 4MB
- **Security**: Files are stored with UUID names to prevent conflicts and enhance security

## Database Schema

### visa_documents table

- `id` - Primary key
- `user_id` - Foreign key to users table
- `original_name` - Original filename
- `file_name` - Stored filename (UUID-based)
- `file_path` - Storage path
- `mime_type` - File MIME type
- `file_size` - File size in bytes
- `document_type` - Category (identity|financial|travel)
- `created_at` - Upload timestamp
- `updated_at` - Last modified timestamp

## Security Features

- User authentication required for all operations
- File type validation
- File size limits
- UUID-based file naming
- User isolation (users can only access their own documents)
- CSRF protection
- Secure file storage outside web root

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
# PHP
vendor/bin/pint

# JavaScript/TypeScript
npm run lint
npm run format
```

### Building for Production

```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **File upload fails**
   - Check file size (max 4MB)
   - Verify file type (PDF, PNG, JPG only)
   - Ensure storage directory is writable

2. **Storage link issues**
   - Run `php artisan storage:link`
   - Check that `public/storage` symlink exists

3. **Database issues**
   - Ensure SQLite file exists: `touch database/database.sqlite`
   - Run migrations: `php artisan migrate`

4. **Permission issues**
   - Ensure `storage/` and `bootstrap/cache/` are writable
   - Set proper file permissions: `chmod -R 775 storage bootstrap/cache`

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).