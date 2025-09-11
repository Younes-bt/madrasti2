import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, File, AlertCircle, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import { apiMethods } from '../../services/api';

const ImageUpload = ({ 
  onUploadSuccess, 
  onUploadError,
  relationData = {},
  maxFiles = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  multiple = true,
  className = "",
  disabled = false
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);

  const validateFile = (file) => {
    const errors = [];

    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      errors.push(t('media.errors.invalidFileType', { 
        types: acceptedFileTypes.map(type => type.split('/')[1]).join(', ')
      }));
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      errors.push(t('media.errors.fileTooLarge', { maxSize: maxSizeMB }));
    }

    return errors;
  };

  const handleFiles = async (files) => {
    if (disabled || uploading) return;

    const fileArray = Array.from(files);
    
    // Validate number of files
    if (fileArray.length > maxFiles) {
      toast.error(t('media.errors.tooManyFiles', { maxFiles }));
      return;
    }

    // Validate each file
    const validFiles = [];
    const errors = [];

    fileArray.forEach((file, index) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    if (errors.length > 0) {
      toast.error(t('media.errors.validationFailed') + '\n' + errors.join('\n'));
      if (onUploadError) {
        onUploadError(errors);
      }
      return;
    }

    if (validFiles.length === 0) return;

    // Start upload
    setUploading(true);
    setUploadProgress(validFiles.map(file => ({ 
      name: file.name, 
      progress: 0, 
      status: 'uploading',
      id: Math.random().toString(36).substr(2, 9)
    })));

    const uploadPromises = validFiles.map(async (file, index) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', 'IMAGE');
        formData.append('title', file.name.split('.')[0]); // Use filename without extension as title

        // Add relation data if provided
        if (relationData) {
          for (const key in relationData) {
            if (relationData[key] !== null && relationData[key] !== undefined) {
              formData.append(key, relationData[key]);
            }
          }
        }

        // Update progress
        setUploadProgress(prev => prev.map((item, i) => 
          i === index ? { ...item, progress: 50 } : item
        ));

        const response = await apiMethods.post('media/files/upload/', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => prev.map((item, i) => 
              i === index ? { ...item, progress: percentCompleted } : item
            ));
          }
        });

        // Update progress to completed
        setUploadProgress(prev => prev.map((item, i) => 
          i === index ? { ...item, progress: 100, status: 'completed' } : item
        ));

        return response;
      } catch (error) {
        console.error('Upload failed for file:', file.name, error);
        
        // Update progress to error
        setUploadProgress(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'error', error: error.message } : item
        ));
        
        throw error;
      }
    });

    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successes = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      const failures = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      if (successes.length > 0) {
        toast.success(t('media.uploadSuccess', { count: successes.length }));
        if (onUploadSuccess) {
          onUploadSuccess(successes);
        }
      }

      if (failures.length > 0) {
        toast.error(t('media.uploadPartialFailed', { 
          success: successes.length,
          failed: failures.length 
        }));
        if (onUploadError) {
          onUploadError(failures);
        }
      }

    } catch (error) {
      console.error('Upload process failed:', error);
      toast.error(t('media.uploadFailed'));
      if (onUploadError) {
        onUploadError([error]);
      }
    } finally {
      setUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress([]);
      }, 3000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileSelector = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const ProgressItem = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {item.status === 'completed' ? (
          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
        ) : item.status === 'error' ? (
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        ) : (
          <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
        )}
        <span className="text-sm truncate">{item.name}</span>
      </div>
      
      {item.status === 'uploading' && (
        <div className="flex items-center space-x-2">
          <div className="w-20 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">
            {item.progress}%
          </span>
        </div>
      )}
      
      {item.status === 'error' && (
        <span className="text-xs text-red-500 truncate max-w-32">
          {item.error}
        </span>
      )}
    </motion.div>
  );

  return (
    <div className={className}>
      <Card className={`transition-all duration-200 ${
        dragActive ? 'border-primary bg-primary/5' : 'border-dashed border-muted-foreground/25'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}>
        <CardContent className="p-6">
          <div
            className={`relative ${disabled || uploading ? 'pointer-events-none' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileSelector}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />
            
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                className={`p-4 rounded-full mb-4 ${
                  dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
                animate={{ 
                  scale: dragActive ? 1.1 : 1,
                  rotate: uploading ? 360 : 0
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: uploading ? Infinity : 0, ease: 'linear' }
                }}
              >
                {uploading ? (
                  <Upload className="h-8 w-8" />
                ) : (
                  <Image className="h-8 w-8" />
                )}
              </motion.div>
              
              <h3 className="text-lg font-medium mb-2">
                {uploading 
                  ? t('media.uploading')
                  : dragActive 
                    ? t('media.dropFilesHere')
                    : t('media.dragDropOrClick')
                }
              </h3>
              
              <p className="text-sm text-muted-foreground text-center">
                {t('media.supportedFormats')}: {acceptedFileTypes.map(type => type.split('/')[1]).join(', ')}
                <br />
                {t('media.maxFileSize')}: {Math.round(maxFileSize / (1024 * 1024))}MB
                {multiple && ` • ${t('media.maxFiles')}: ${maxFiles}`}
              </p>
              
              {!uploading && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={(e) => { e.stopPropagation(); openFileSelector(); }}
                  disabled={disabled}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('media.selectFiles')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            <h4 className="text-sm font-medium">{t('media.uploadProgress')}</h4>
            {uploadProgress.map((item) => (
              <ProgressItem key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;