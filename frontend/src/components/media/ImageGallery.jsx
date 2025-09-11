import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Trash2, 
  Star, 
  StarOff,
  Edit,
  MoreVertical 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

const ImageGallery = ({ 
  images = [],
  onImageDelete,
  onImageEdit,
  onSetFeatured,
  canEdit = true,
  columns = 3,
  className = "",
  showImageDetails = true
}) => {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (images.length === 0) return;
    
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    
    setSelectedImageIndex(newIndex);
  };

  const handleImageAction = async (action, image) => {
    try {
      switch (action) {
        case 'delete':
          if (window.confirm(t('media.confirmDeleteImage'))) {
            await onImageDelete?.(image);
            toast.success(t('media.imageDeleted'));
          }
          break;
        case 'edit':
          onImageEdit?.(image);
          break;
        case 'setFeatured':
          await onSetFeatured?.(image, !image.is_featured);
          toast.success(
            image.is_featured 
              ? t('media.unsetAsFeatured') 
              : t('media.setAsFeatured')
          );
          break;
        case 'download':
          window.open(image.media_file.secure_url || image.media_file.url, '_blank');
          break;
      }
    } catch (error) {
      console.error('Image action failed:', error);
      toast.error(t('media.actionFailed'));
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const ImageCard = ({ image, index }) => {
    const mediaFile = image.media_file;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-0">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={mediaFile.secure_url || mediaFile.url}
                alt={mediaFile.alt_text || mediaFile.title || `Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                onClick={() => openLightbox(index)}
                loading="lazy"
              />
              
              {/* Featured Badge */}
              {image.is_featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-50">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {t('media.featured')}
                </Badge>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-black hover:bg-white"
                  onClick={() => openLightbox(index)}
                >
                  {t('media.viewFull')}
                </Button>
              </div>
              
              {/* Actions Menu */}
              {canEdit && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/90 text-black hover:bg-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleImageAction('setFeatured', image)}
                        className="cursor-pointer"
                      >
                        {image.is_featured ? (
                          <>
                            <StarOff className="mr-2 h-4 w-4" />
                            {t('media.unsetAsFeatured')}
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            {t('media.setAsFeatured')}
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleImageAction('download', image)}
                        className="cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {t('media.download')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleImageAction('edit', image)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('media.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleImageAction('delete', image)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('media.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            
            {/* Image Details */}
            {showImageDetails && (
              <div className="p-3">
                <h4 className="font-medium text-sm truncate mb-1">
                  {mediaFile.title || `Image ${index + 1}`}
                </h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {mediaFile.width && mediaFile.height 
                      ? `${mediaFile.width}×${mediaFile.height}`
                      : t('media.unknownDimensions')
                    }
                  </span>
                  <span>{formatFileSize(mediaFile.file_size)}</span>
                </div>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {image.caption}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  if (images.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-muted-foreground">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              📷
            </div>
            <h3 className="text-lg font-medium mb-2">
              {t('media.noImages')}
            </h3>
            <p className="text-sm">
              {t('media.noImagesDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Gallery Grid */}
      <div 
        className={`grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {images.map((image, index) => (
          <ImageCard key={image.id || index} image={image} index={index} />
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedImage?.media_file.title || t('media.image')} 
                ({selectedImageIndex + 1} {t('common.of')} {images.length})
              </span>
              <div className="flex items-center space-x-2">
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateImage(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateImage(1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Download Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleImageAction('download', selectedImage)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="flex flex-col items-center space-y-4">
              {/* Full Size Image */}
              <div className="relative max-h-[60vh] overflow-hidden rounded-lg">
                <img
                  src={selectedImage.media_file.secure_url || selectedImage.media_file.url}
                  alt={selectedImage.media_file.alt_text || selectedImage.media_file.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Image Details */}
              <div className="w-full p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>{t('media.fileName')}:</strong> {selectedImage.media_file.title}
                  </div>
                  <div>
                    <strong>{t('media.fileSize')}:</strong> {formatFileSize(selectedImage.media_file.file_size)}
                  </div>
                  <div>
                    <strong>{t('media.dimensions')}:</strong> {
                      selectedImage.media_file.width && selectedImage.media_file.height 
                        ? `${selectedImage.media_file.width} × ${selectedImage.media_file.height}`
                        : t('media.unknownDimensions')
                    }
                  </div>
                  <div>
                    <strong>{t('media.format')}:</strong> {selectedImage.media_file.format?.toUpperCase() || t('common.unknown')}
                  </div>
                </div>
                
                {selectedImage.caption && (
                  <div className="mt-2 pt-2 border-t">
                    <strong>{t('media.caption')}:</strong> {selectedImage.caption}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;