from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import MediaFile, MediaRelation
import cloudinary.uploader

class MediaFileSerializer(serializers.ModelSerializer):
    """
    Serializer for MediaFile model with file upload handling.
    """
    
    # Read-only fields computed from the model
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    tags_list = serializers.ListField(source='get_tags_list', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    # File upload field - will be handled in create/update methods
    file_upload = serializers.FileField(write_only=True, required=False)
    
    class Meta:
        model = MediaFile
        fields = [
            'id',
            'title',
            'description', 
            'media_type',
            'file',
            'file_upload',  # For uploading
            'public_id',
            'url',
            'secure_url',
            'file_size',
            'file_size_display',
            'width',
            'height', 
            'duration',
            'format',
            'tags',
            'tags_list',
            'alt_text',
            'uploaded_by',
            'uploaded_by_name',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'public_id', 
            'url', 
            'secure_url', 
            'file_size', 
            'width', 
            'height', 
            'duration', 
            'format',
            'created_at', 
            'updated_at',
            'uploaded_by'
        ]
    
    def create(self, validated_data):
        """Handle file upload during creation"""
        file_upload = validated_data.pop('file_upload', None)
        
        # Set the uploaded_by to the current user
        if 'uploaded_by' not in validated_data:
            validated_data['uploaded_by'] = self.context['request'].user
        
        # Create the media file instance
        instance = super().create(validated_data)
        
        # Handle file upload if provided
        if file_upload:
            self._handle_file_upload(instance, file_upload)
        
        return instance
    
    def update(self, instance, validated_data):
        """Handle file upload during update"""
        file_upload = validated_data.pop('file_upload', None)
        
        # Update the instance
        instance = super().update(instance, validated_data)
        
        # Handle new file upload if provided
        if file_upload:
            self._handle_file_upload(instance, file_upload)
        
        return instance
    
    def _handle_file_upload(self, instance, file_upload):
        """Upload file to Cloudinary and update instance"""
        try:
            # Determine upload parameters based on media type
            upload_params = {
                'resource_type': 'auto',  # Let Cloudinary determine the type
                'use_filename': True,
                'unique_filename': True,
                'folder': f'madrasti/media/{instance.media_type.lower()}',
            }
            
            # Add specific parameters for images
            if instance.media_type == 'IMAGE':
                upload_params.update({
                    'transformation': [
                        {'quality': 'auto:good'},
                        {'fetch_format': 'auto'}
                    ]
                })
            
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(file_upload, **upload_params)
            
            # Update instance with Cloudinary data
            instance.file = upload_result['public_id']
            instance.public_id = upload_result['public_id']
            instance.url = upload_result['url']
            instance.secure_url = upload_result['secure_url']
            instance.file_size = upload_result.get('bytes', 0)
            instance.width = upload_result.get('width')
            instance.height = upload_result.get('height') 
            instance.duration = upload_result.get('duration')
            instance.format = upload_result.get('format', '')
            
            # Auto-detect media type if not set
            if not instance.media_type or instance.media_type == 'OTHER':
                resource_type = upload_result.get('resource_type', 'raw')
                if resource_type == 'image':
                    instance.media_type = 'IMAGE'
                elif resource_type == 'video':
                    instance.media_type = 'VIDEO'
                elif resource_type == 'raw':
                    format_type = upload_result.get('format', '').lower()
                    if format_type == 'pdf':
                        instance.media_type = 'PDF'
                    elif format_type in ['mp3', 'wav', 'ogg']:
                        instance.media_type = 'AUDIO'
                    else:
                        instance.media_type = 'DOCUMENT'
            
            # Set default title if not provided
            if not instance.title:
                instance.title = upload_result.get('original_filename', f'{instance.media_type} file')
            
            instance.save()
            
        except Exception as e:
            raise serializers.ValidationError(f'File upload failed: {str(e)}')


class MediaFileMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for MediaFile - used in nested relationships.
    """
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    
    class Meta:
        model = MediaFile
        fields = [
            'id',
            'title',
            'media_type', 
            'url',
            'secure_url',
            'file_size_display',
            'width',
            'height',
            'alt_text',
            'created_at'
        ]


class MediaRelationSerializer(serializers.ModelSerializer):
    """
    Serializer for MediaRelation model.
    """
    
    # Nested media file information
    media_file = MediaFileMinimalSerializer(read_only=True)
    media_file_id = serializers.UUIDField(write_only=True)
    
    # Content object information
    content_type_name = serializers.CharField(source='content_type.model', read_only=True)
    content_object_str = serializers.CharField(source='content_object.__str__', read_only=True)
    
    class Meta:
        model = MediaRelation
        fields = [
            'id',
            'media_file',
            'media_file_id',
            'content_type',
            'content_type_name',
            'object_id', 
            'content_object_str',
            'relation_type',
            'order',
            'is_featured',
            'caption',
            'created_at',
            'updated_at'
        ]
    
    def create(self, validated_data):
        """Handle media_file_id during creation"""
        media_file_id = validated_data.pop('media_file_id')
        validated_data['media_file_id'] = media_file_id
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Handle media_file_id during update"""
        if 'media_file_id' in validated_data:
            media_file_id = validated_data.pop('media_file_id')
            validated_data['media_file_id'] = media_file_id
        return super().update(instance, validated_data)


class MediaRelationMinimalSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for MediaRelation - for simple listings.
    """
    media_file = MediaFileMinimalSerializer(read_only=True)
    
    class Meta:
        model = MediaRelation
        fields = [
            'id',
            'media_file',
            'relation_type',
            'order',
            'is_featured',
            'caption'
        ]


class MediaUploadSerializer(serializers.Serializer):
    """
    Serializer specifically for handling file uploads with metadata.
    Used for bulk uploads or when you need more control over the upload process.
    """
    
    file = serializers.FileField()
    title = serializers.CharField(max_length=200, required=False)
    description = serializers.CharField(required=False)
    media_type = serializers.ChoiceField(choices=MediaFile.MEDIA_TYPES, required=False)
    tags = serializers.CharField(max_length=500, required=False)
    alt_text = serializers.CharField(max_length=255, required=False)
    
    # For creating relations at the same time
    content_type_id = serializers.IntegerField(required=False)
    object_id = serializers.IntegerField(required=False)
    relation_type = serializers.ChoiceField(choices=MediaRelation.RELATION_TYPES, required=False)
    is_featured = serializers.BooleanField(default=False)
    order = serializers.IntegerField(default=0)
    
    def create(self, validated_data):
        """Create MediaFile and optionally MediaRelation"""
        
        # Extract relation data
        content_type_id = validated_data.pop('content_type_id', None)
        object_id = validated_data.pop('object_id', None) 
        relation_type = validated_data.pop('relation_type', None)
        is_featured = validated_data.pop('is_featured', False)
        order = validated_data.pop('order', 0)
        
        # Create the MediaFile
        file_data = validated_data.pop('file')
        media_serializer = MediaFileSerializer(
            data={'file_upload': file_data, **validated_data},
            context=self.context
        )
        media_serializer.is_valid(raise_exception=True)
        media_file = media_serializer.save()
        
        # Create relation if specified
        if content_type_id and object_id and relation_type:
            MediaRelation.objects.create(
                media_file=media_file,
                content_type_id=content_type_id,
                object_id=object_id,
                relation_type=relation_type,
                is_featured=is_featured,
                order=order
            )
        
        return media_file