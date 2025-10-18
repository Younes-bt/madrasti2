import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Images, Upload, RefreshCw, Grid3X3, Grid2X2, List } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EquipmentMediaManager = ({
  equipmentId,
  equipmentName = '',
  contentTypeId,
  className = '',
  initialImages = []
}) => {
  const { t } = useTranslation();
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid-3');
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    gallery: 0
  });

  const fetchImages = async () => {
    if (!equipmentId) return;
    setLoading(true);
    try {
      const response = await apiMethods.get(`schools/equipment/${equipmentId}/media/`);
      const imageData = response.results || (Array.isArray(response) ? response : []);
      setImages(imageData);
      const featured = imageData.filter((img) => img.is_featured).length;
      const gallery = imageData.filter((img) => !img.is_featured).length;
      setStats({
        total: imageData.length,
        featured,
        gallery
      });
    } catch (error) {
      console.error('Failed to fetch equipment images:', error);
      toast.error(t('equipment.media.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async (uploadedFiles) => {
    await fetchImages();
    setUploadDialogOpen(false);
    toast.success(
      t('equipment.media.uploadSuccess', {
        count: uploadedFiles.length,
        name: equipmentName
      })
    );
  };

  const handleImageDelete = async (imageRelation) => {
    try {
      await apiMethods.delete(`media/relations/${imageRelation.id}/`);
      await fetchImages();
      toast.success(t('equipment.media.deleteSuccess'));
    } catch (error) {
      console.error('Failed to delete equipment image relation:', error);
      toast.error(t('equipment.media.deleteFailed'));
    }
  };

  const handleSetFeatured = async (imageRelation, isFeatured) => {
    try {
      await apiMethods.patch(`media/relations/${imageRelation.id}/`, {
        is_featured: isFeatured
      });
      await fetchImages();
    } catch (error) {
      console.error('Failed to update featured status for equipment image:', error);
      toast.error(t('equipment.media.featuredFailed'));
    }
  };

  const handleImageEdit = () => {
    toast.info(t('media.editFeatureComingSoon'));
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentId]);

  const getViewModeColumns = () => {
    switch (viewMode) {
      case 'grid-2':
        return 2;
      case 'grid-3':
        return 3;
      case 'list':
        return 1;
      default:
        return 3;
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Images className="h-5 w-5" />
              <CardTitle>{t('equipment.media.title')}</CardTitle>
              {stats.total > 0 && (
                <Badge variant="secondary">
                  {stats.total}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
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

              <Button
                variant="outline"
                size="sm"
                onClick={fetchImages}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={!contentTypeId}>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('equipment.media.addImages')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {t('equipment.media.uploadTitle', { name: equipmentName })}
                    </DialogTitle>
                  </DialogHeader>
                  <ImageUpload
                    relationData={{
                      content_type_id: contentTypeId,
                      object_id: equipmentId,
                      relation_type: 'EQUIPMENT_GALLERY'
                    }}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={() => toast.error(t('equipment.media.uploadFailed'))}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <Images className="h-12 w-12 opacity-50" />
              <p>{t('equipment.media.empty')}</p>
            </div>
          ) : (
            <ImageGallery
              images={images}
              columns={getViewModeColumns()}
              onImageDelete={handleImageDelete}
              onImageEdit={handleImageEdit}
              onSetFeatured={handleSetFeatured}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentMediaManager;
