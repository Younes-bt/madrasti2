from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from .models import MediaFile, MediaRelation
from .serializers import (
    MediaFileSerializer, 
    MediaRelationSerializer,
    MediaUploadSerializer,
    MediaFileMinimalSerializer,
    MediaRelationMinimalSerializer
)

class MediaFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing MediaFile instances.
    Supports CRUD operations and file uploads.
    """
    
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = MediaFile.objects.filter(is_active=True)
        
        # Filter by media type
        media_type = self.request.query_params.get('media_type')
        if media_type:
            queryset = queryset.filter(media_type=media_type)
        
        # Filter by uploaded user
        uploaded_by = self.request.query_params.get('uploaded_by')
        if uploaded_by:
            queryset = queryset.filter(uploaded_by=uploaded_by)
        
        # Search in title, description, and tags
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__icontains=search) |
                Q(alt_text__icontains=search)
            )
        
        # Filter by tags
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                queryset = queryset.filter(tags__icontains=tag)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'upload':
            return MediaUploadSerializer
        elif self.action == 'list':
            # Use minimal serializer for list view to improve performance
            return MediaFileMinimalSerializer
        return MediaFileSerializer
    
    @action(detail=False, methods=['post'])
    def upload(self, request):
        """
        Custom endpoint for file uploads with enhanced handling.
        POST /api/media/files/upload/
        """
        print(f"Upload request data: {request.data}")
        print(f"Upload request user: {request.user}")
        print(f"Upload request authenticated: {request.user.is_authenticated}")
        
        serializer = MediaUploadSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            try:
                media_file = serializer.save()
                response_serializer = MediaFileSerializer(media_file)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Upload error during save: {e}")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(f"Upload validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def relations(self, request, pk=None):
        """
        Get all relations for a specific media file.
        GET /api/media/files/{id}/relations/
        """
        media_file = self.get_object()
        relations = MediaRelation.objects.filter(media_file=media_file)
        serializer = MediaRelationMinimalSerializer(relations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get statistics about media files.
        GET /api/media/files/stats/
        """
        queryset = self.get_queryset()
        
        stats = {
            'total_files': queryset.count(),
            'by_type': {},
            'total_size': 0,
            'recent_uploads': queryset.count() # Last 7 days could be added
        }
        
        # Count by media type
        for media_type, _ in MediaFile.MEDIA_TYPES:
            count = queryset.filter(media_type=media_type).count()
            stats['by_type'][media_type.lower()] = count
        
        # Calculate total size
        total_size = sum(f.file_size or 0 for f in queryset)
        stats['total_size'] = total_size
        
        return Response(stats)


class MediaRelationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing MediaRelation instances.
    Allows linking media files to any model.
    """
    
    queryset = MediaRelation.objects.all()
    serializer_class = MediaRelationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = MediaRelation.objects.all()
        
        # Filter by content type and object
        content_type_id = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
        
        if content_type_id and object_id:
            queryset = queryset.filter(
                content_type_id=content_type_id,
                object_id=object_id
            )
        
        # Filter by relation type
        relation_type = self.request.query_params.get('relation_type')
        if relation_type:
            queryset = queryset.filter(relation_type=relation_type)
        
        # Filter featured items
        featured = self.request.query_params.get('featured')
        if featured is not None:
            is_featured = featured.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(is_featured=is_featured)
        
        # Filter by media file
        media_file_id = self.request.query_params.get('media_file')
        if media_file_id:
            queryset = queryset.filter(media_file_id=media_file_id)
        
        return queryset.order_by('order', 'created_at')
    
    def get_serializer_class(self):
        """Use minimal serializer for list view"""
        if self.action == 'list':
            return MediaRelationMinimalSerializer
        return MediaRelationSerializer
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Create multiple relations at once.
        POST /api/media/relations/bulk_create/
        """
        if not isinstance(request.data, list):
            return Response(
                {'error': 'Expected a list of relation data'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = MediaRelationSerializer(data=request.data, many=True)
        if serializer.is_valid():
            relations = serializer.save()
            response_serializer = MediaRelationMinimalSerializer(relations, many=True)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        """
        Reorder relations for a specific object.
        PATCH /api/media/relations/reorder/
        Expected data: {
            "content_type": 1,
            "object_id": 1,
            "relation_type": "ROOM_GALLERY",
            "orders": [{"id": 1, "order": 0}, {"id": 2, "order": 1}]
        }
        """
        content_type_id = request.data.get('content_type')
        object_id = request.data.get('object_id')
        relation_type = request.data.get('relation_type')
        orders = request.data.get('orders', [])
        
        if not all([content_type_id, object_id, relation_type, orders]):
            return Response(
                {'error': 'content_type, object_id, relation_type, and orders are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the orders
        updated_count = 0
        for order_data in orders:
            relation_id = order_data.get('id')
            new_order = order_data.get('order')
            
            if relation_id is not None and new_order is not None:
                MediaRelation.objects.filter(
                    id=relation_id,
                    content_type_id=content_type_id,
                    object_id=object_id,
                    relation_type=relation_type
                ).update(order=new_order)
                updated_count += 1
        
        return Response({'updated': updated_count})


# Helper views for specific use cases

class RoomMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Specialized viewset for room media.
    GET /api/rooms/{room_id}/media/
    """
    
    serializer_class = MediaRelationMinimalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        room_id = self.kwargs.get('room_pk')  # From nested route
        if not room_id:
            return MediaRelation.objects.none()
        
        # Get ContentType for Room model
        from schools.models import Room
        content_type = ContentType.objects.get_for_model(Room)
        
        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=room_id,
            relation_type__in=['ROOM_GALLERY', 'ROOM_FEATURED']
        ).order_by('order', 'created_at')


class VehicleMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Specialized viewset for vehicle media.
    GET /api/vehicles/{vehicle_id}/media/
    """

    serializer_class = MediaRelationMinimalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        vehicle_id = self.kwargs.get('vehicle_pk')
        if not vehicle_id:
            return MediaRelation.objects.none()

        from schools.models import Vehicle
        content_type = ContentType.objects.get_for_model(Vehicle)

        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=vehicle_id,
            relation_type__in=['VEHICLE_GALLERY', 'VEHICLE_FEATURED']
        ).order_by('order', 'created_at')


class VehicleMaintenanceMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Specialized viewset for vehicle maintenance record media.
    GET /api/vehicles/{vehicle_id}/maintenance-records/{record_id}/media/
    """

    serializer_class = MediaRelationMinimalSerializer
    queryset = MediaRelation.objects.none()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        maintenance_record_id = self.kwargs.get('maintenance_record_pk')
        if not maintenance_record_id:
            return MediaRelation.objects.none()

        from schools.models import VehicleMaintenanceRecord
        content_type = ContentType.objects.get_for_model(VehicleMaintenanceRecord)

        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=maintenance_record_id,
            relation_type='VEHICLE_MAINTENANCE_ATTACHMENT'
        ).order_by('order', 'created_at')


class VehicleGasoilMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Specialized viewset for vehicle gasoil record media.
    GET /api/vehicles/{vehicle_id}/gasoil-records/{record_id}/media/
    """

    serializer_class = MediaRelationMinimalSerializer
    queryset = MediaRelation.objects.none()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        gasoil_record_id = self.kwargs.get('gasoil_record_pk')
        if not gasoil_record_id:
            return MediaRelation.objects.none()

        from schools.models import GasoilRecord
        content_type = ContentType.objects.get_for_model(GasoilRecord)

        return MediaRelation.objects.filter(
            content_type=content_type,
            object_id=gasoil_record_id,
            relation_type='VEHICLE_GASOIL_ATTACHMENT'
        ).order_by('order', 'created_at')
