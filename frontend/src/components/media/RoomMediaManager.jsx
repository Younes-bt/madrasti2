import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Images, 
  Upload, 
  RefreshCw, 
  Settings, 
  Grid3X3, 
  Grid2X2,
  List
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { apiMethods } from '../../services/api';

const RoomMediaManager = ({ 
  roomId,
  roomName = '',
  contentTypeId,
  className = "",
  initialImages = []
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid-3'); // grid-3, grid-2, list
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    gallery: 0
  });

  // Fetch room images
  const fetchImages = async () => {
    if (!roomId || !contentTypeId) return;
    
    setLoading(true);
    try {
      const response = await apiMethods.get(`schools/rooms/${roomId}/media/`);
      // Handle both paginated response {results: [...]} and direct array [...]
      const imageData = response.results || (Array.isArray(response) ? response : []);
      setImages(imageData);
      
      // Calculate stats
      const featured = imageData.filter(img => img.is_featured).length;
      const gallery = imageData.filter(img => !img.is_featured).length;
      setStats({
        total: imageData.length,
        featured,
        gallery
      });
    } catch (error) {
      console.error('Failed to fetch room images:', error);
      toast.error(t('media.failedToLoadImages'));
    } finally {
      setLoading(false);
    }
  };

  // Upload success handler
  const handleUploadSuccess = async (uploadedFiles) => {
    // Simply refresh the images list as the backend now handles relation creation
    await fetchImages();
    setUploadDialogOpen(false);
    toast.success(t('media.imagesAddedToRoom', { 
      count: uploadedFiles.length,
      room: roomName 
    }));
  };

  // Delete image handler
  const handleImageDelete = async (imageRelation) => {
    try {
      // Delete the media relation
      await apiMethods.delete(`media/relations/${imageRelation.id}/`);
      
      // Optionally delete the media file if it's not used elsewhere
      // For now, we'll keep the file but remove the relation
      
      // Refresh images
      await fetchImages();
      
      toast.success(t('media.imageRemovedFromRoom'));
    } catch (error) {
      console.error('Failed to delete image relation:', error);
      toast.error(t('media.failedToDeleteImage'));
    }
  };

  // Set featured image handler
  const handleSetFeatured = async (imageRelation, isFeatured) => {
    try {
      await apiMethods.patch(`media/relations/${imageRelation.id}/`, {
        is_featured: isFeatured
      });
      
      // Refresh images
      await fetchImages();
    } catch (error) {
      console.error('Failed to update featured status:', error);
      toast.error(t('media.failedToUpdateFeatured'));
    }
  };

  // Edit image handler (placeholder for now)
  const handleImageEdit = (imageRelation) => {
    toast.info(t('media.editFeatureComingSoon'));
    // TODO: Implement image editing dialog
  };

  // Load images on component mount
  useEffect(() => {
    fetchImages();
  }, [roomId]);

  const getViewModeColumns = () => {
    switch (viewMode) {
      case 'grid-2': return 2;
      case 'grid-3': return 3;
      case 'list': return 1;
      default: return 3;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Images className="h-5 w-5" />
              <CardTitle>{t('media.roomImages')}</CardTitle>
              {stats.total > 0 && (
                <Badge variant="secondary">
                  {stats.total}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid-3' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setViewMode('grid-3')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid-2' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setViewMode('grid-2')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchImages}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Upload Button */}
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {t('media.addImages')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {t('media.addImagesToRoom', { room: roomName })}
                    </DialogTitle>
                  </DialogHeader>
                  <ImageUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(errors) => {
                      console.error('Upload errors:', errors);
                    }}
                    relationData={{
                      content_type_id: 9, // Hardcoded Room ContentType ID
                      object_id: parseInt(roomId),
                      relation_type: 'ROOM_GALLERY'
                    }}
                    maxFiles={10}
                    multiple={true}
                    className="mt-4"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          {stats.total > 0 && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{t('media.totalImages')}: {stats.total}</span>
              {stats.featured > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{t('media.featuredImages')}: {stats.featured}</span>
                </>
              )}
              {stats.gallery > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{t('media.galleryImages')}: {stats.gallery}</span>
                </>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>{t('media.loadingImages')}</span>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" className="flex items-center space-x-2">
                  <span>{t('media.allImages')}</span>
                  {stats.total > 0 && <Badge variant="secondary" className="ml-1">{stats.total}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="featured" className="flex items-center space-x-2">
                  <span>{t('media.featured')}</span>
                  {stats.featured > 0 && <Badge variant="secondary" className="ml-1">{stats.featured}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center space-x-2">
                  <span>{t('media.gallery')}</span>
                  {stats.gallery > 0 && <Badge variant="secondary" className="ml-1">{stats.gallery}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ImageGallery
                  images={images}
                  onImageDelete={handleImageDelete}
                  onImageEdit={handleImageEdit}
                  onSetFeatured={handleSetFeatured}
                  columns={getViewModeColumns()}
                  canEdit={true}
                  showImageDetails={viewMode !== 'list'}
                />
              </TabsContent>

              <TabsContent value="featured">
                <ImageGallery
                  images={images.filter(img => img.is_featured)}
                  onImageDelete={handleImageDelete}
                  onImageEdit={handleImageEdit}
                  onSetFeatured={handleSetFeatured}
                  columns={getViewModeColumns()}
                  canEdit={true}
                  showImageDetails={viewMode !== 'list'}
                />
              </TabsContent>

              <TabsContent value="gallery">
                <ImageGallery
                  images={images.filter(img => !img.is_featured)}
                  onImageDelete={handleImageDelete}
                  onImageEdit={handleImageEdit}
                  onSetFeatured={handleSetFeatured}
                  columns={getViewModeColumns()}
                  canEdit={true}
                  showImageDetails={viewMode !== 'list'}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomMediaManager;
