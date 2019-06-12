from django.db import models

PLAN_TYPE = (('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly'), ('annual', 'Annual'))

class PlannerData(models.Model):
    plan_date = models.DateField()
    finish_timestamp = models.DateTimeField(auto_now=True)
    create_timestamp = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    is_finished = models.BooleanField(default=False)
    content = models.TextField()
    plan_type = models.CharField(choices=PLAN_TYPE, default='daily', max_length=10)
    owner = models.ForeignKey('auth.User', related_name='plannerdata', on_delete=models.CASCADE)
