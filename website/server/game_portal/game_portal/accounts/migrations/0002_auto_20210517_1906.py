# Generated by Django 3.0.8 on 2021-05-17 19:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("accounts", "0001_initial")]

    operations = [
        migrations.RenameField(model_name="account", old_name="id", new_name="user_id")
    ]