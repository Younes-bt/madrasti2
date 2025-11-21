from django.apps import AppConfig


class HomeworkConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'homework'

    def ready(self):
        """
        Import signals to ensure they are registered.
        """
        import homework.signals  # noqa
