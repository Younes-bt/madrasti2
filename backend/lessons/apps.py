from django.apps import AppConfig

class LessonsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lessons'
    verbose_name = 'Lessons Management'
    
    def ready(self):
        """
        This method is called when the app is ready.
        You can use it for app initialization tasks.
        """
        pass