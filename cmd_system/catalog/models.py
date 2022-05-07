from django.db import models
import catalog.helper as helper
from django.core.files.base import ContentFile

from catalog.helper import CMD14_DATA_COLUMN, CMDEX_DATA_COLUMN

# Create your models here.
class Field(models.Model):
    name = models.CharField(max_length=80)
    lat = models.FloatField(null=True)
    lon = models.FloatField(null=True)

    def __str__(self):
        """String for representing the Model object."""
        return self.name


def file_directory_path(instance, filename):
    return f"files/{instance.field.id}/{filename}"


def img_directory_path(instance, filename):
    return f"pictures/{instance.field.id}/{filename}"


class Survey(models.Model):
    field = models.ForeignKey("Field", related_name="surveys", on_delete=models.CASCADE)
    date = models.DateField()
    measure_type = models.CharField(max_length=40, null=True)
    probe = models.CharField(max_length=40, null=True)
    mode = models.CharField(max_length=40, null=True)
    name = models.CharField(max_length=80, null=True, unique=True)
    image = models.ImageField(upload_to=img_directory_path, null=True)
    image1 = models.ImageField(upload_to=img_directory_path, null=True)
    image2 = models.ImageField(upload_to=img_directory_path, null=True)
    image3 = models.ImageField(upload_to=img_directory_path, null=True)
    image4 = models.ImageField(upload_to=img_directory_path, null=True)
    image5 = models.ImageField(upload_to=img_directory_path, null=True)
    column_n = models.IntegerField(null=True)
    file_dat = models.FileField(upload_to=file_directory_path)
    file_txt = models.FileField(upload_to=file_directory_path)

    def save(self, *args, **kwargs):
        header = helper.read_header(self.file_txt.read().decode("utf-8"))
        data, column_n = helper.read_data(self.file_dat.read().decode("utf-8"))
        self.measure_type = header["Meas. type"].strip()
        self.probe = header["Probe"].strip()
        self.mode = header["Cal./Depth"].strip()
        # self.data = data.to_json(orient='records')
        self.name = header["File name"].strip()
        self.column_n = column_n
        if self.column_n == CMD14_DATA_COLUMN:
            # Generate 1 plot for CMD1 or CMD4
            self.image = ContentFile(
                helper.mykriging(data).getvalue(), f"{self.name}.png"
            )
        else:
            assert self.column_n == CMDEX_DATA_COLUMN
            # Generate 5 plots for CMDEX
            self.image1 = ContentFile(
                helper.mykriging(data[:, [0, 1, 2]]).getvalue(), f"{self.name}_1.png"
            )
            self.image2 = ContentFile(
                helper.mykriging(data[:, [0, 1, 3]]).getvalue(), f"{self.name}_2.png"
            )
            self.image3 = ContentFile(
                helper.mykriging(data[:, [0, 1, 4]]).getvalue(), f"{self.name}_3.png"
            )
            self.image4 = ContentFile(
                helper.mykriging(data[:, [0, 1, 5]]).getvalue(), f"{self.name}_4.png"
            )
            self.image5 = ContentFile(
                helper.mykriging(data[:, [0, 1, 6]]).getvalue(), f"{self.name}_5.png"
            )

            # Does not work in a list
            # images = [self.image1, self.image2, self.image3, self.image4, self.image5]
            # for i in range(1, 5):
            #     data_reduced = data[:, [0, 1, i + 2]]
            #     images[i] = ContentFile(helper.mykriging(data_reduced).getvalue(),f"{self.name}_{i+1}.png")

        field = Field.objects.get(pk=self.field.id)
        field.lat = data[0, 0]
        field.lon = data[0, 1]
        field.save()

        super().save(*args, **kwargs)

    # class Meta:
    #     ordering = ['due_back']
    #     permissions = (("can_mark_returned", "Set book as returned"),)

    def __str__(self):
        """String for representing the Model object."""
        return f"{self.field.name} - {self.name}"
