import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Images,
  Upload,
  RefreshCw,
  Grid3X3,
  Grid2X2,
  List
} from 'lucide-react';
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
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { apiMethods } from '../../services/api';

const VehicleMediaManager = ({
  vehicleId,
  vehicleName = '',
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

  const fetchImages = useCallback(async () => {
    if (!vehicleId) return;
    setLoading(true);
    try {
      const response = await apiMethods.get(`schools/vehicles/${vehicleId}/media/`);
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
      console.error('Failed to fetch vehicle images:', error);
      toast.error(t('media.failedToLoadVehicleImages'));
    } finally {
      setLoading(false);
    }
  }, [vehicleId, t]);

  const handleUploadSuccess = async (uploadedFiles) => {
    await fetchImages();
    setUploadDialogOpen(false);
    toast.success(
      t('media.imagesAddedToVehicle', {
        count: uploadedFiles.length,
        vehicle: vehicleName
      })
    );
  };

  const handleImageDelete = async (imageRelation) => {
    try {
      await apiMethods.delete(`media/relations/${imageRelation.id}/`);
      await fetchImages();
      toast.success(t('media.imageRemovedFromVehicle'));
    } catch (error) {
      console.error('Failed to delete vehicle image relation:', error);
      toast.error(t('media.failedToDeleteVehicleImage'));
    }
  };

  const handleSetFeatured = async (imageRelation, isFeatured) => {
    try {
      await apiMethods.patch(`media/relations/${imageRelation.id}/`, {
        is_featured: isFeatured
      });
      await fetchImages();
    } catch (error) {
      console.error('Failed to update vehicle featured status:', error);
      toast.error(t('media.failedToUpdateVehicleFeatured'));
    }
  };

  const handleImageEdit = () => {
    toast.info(t('media.editFeatureComingSoon'));
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
              <CardTitle>{t('media.vehicleImages')}</CardTitle>
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
                    {t('media.addImages')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {t('media.addImagesToVehicle', { vehicle: vehicleName })}
                    </DialogTitle>
                  </DialogHeader>
                  <ImageUpload
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(errors) => {
                      console.error('Vehicle media upload errors:', errors);
                    }}
                    relationData={{
                      content_type_id: Number(contentTypeId) || contentTypeId,
                      object_id: parseInt(vehicleId, 10),
                      relation_type: 'VEHICLE_GALLERY'
                    }}
                    maxFiles={10}
                    multiple
                    className="mt-4"
                    disabled={!contentTypeId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={images}
            onImageDelete={handleImageDelete}
            onImageEdit={handleImageEdit}
            onSetFeatured={handleSetFeatured}
            columns={getViewModeColumns()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleMediaManager;
