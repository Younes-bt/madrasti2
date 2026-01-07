from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class CustomPageNumberPagination(PageNumberPagination):
    """
    Custom pagination class that returns empty results instead of 404
    when an invalid page number is requested.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def paginate_queryset(self, queryset, request, view=None):
        """
        Override to handle invalid page numbers gracefully.
        Returns None (empty result) instead of raising NotFound.
        """
        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = self.get_page_number(request, paginator)

        try:
            self.page = paginator.page(page_number)
        except Exception:
            # If page number is invalid or out of range, return empty page
            # Instead of raising NotFound (404) error
            self.page = paginator.page(1)  # Get structure from page 1
            # Create empty page
            self.page.object_list = []
            self.request = request
            return []

        if paginator.num_pages > 1 and self.template is not None:
            self.display_page_controls = True

        self.request = request
        return list(self.page)

    def get_paginated_response(self, data):
        """
        Return paginated response with count, next, previous, and results.
        """
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))
