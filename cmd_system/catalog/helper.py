import csv
import pandas as pd
from io import StringIO, BytesIO
import matplotlib.pyplot as plt
from matplotlib.path import Path
from pykrige.ok import OrdinaryKriging
from scipy.spatial import ConvexHull
import numpy as np

# Six kinds of data in total, see the table below. Total columns excludes the empty last "Note" column
# File name	        Type	        Probe	Column index	    total columns
# CON_CMD1.dat	    Continual	    CMD1	0,1,2	            4
# CON_CMD4.dat	    Continual	    CMD4	0,1,2	            4
# CON_CMDEX.dat	    Continual	    CMDEX	0,1,2,4,6,8,9	    12
# GPSCON_CMD1.dat	GPS Continual	CMD1	0,1,4	            6
# GPSCON_CMD4.dat	GPS Continual	CMD4	0,1,4	            6
# GPSCON_CMDEX.dat	GPS Continual	CMDEX	0,1,4,6,8,10,11	    14
# MAN_CMD1.dat	    Manual	        CMD1	0,1,2	            5
# MAN_CMD4.dat	    Manual	        CMD4	0,1,2	            5
# MAN_CMDEX.dat	    Manual	        CMDEX	0,1,2,5,8,11,12	    15

# Only two types of data column: 3 for CMD1_4 and 7 or CMDEX
CMD14_DATA_COLUMN = 3
CMDEX_DATA_COLUMN = 7

CMD14_CON_FILE_COLUMN = 4
CMD14_CON_COND_COLUMN_INDEX = [0, 1, 2]
CMD14_CON_DATA_COLUMN = len(CMD14_CON_COND_COLUMN_INDEX)

CMDEX_CON_FILE_COLUMN = 12
CMDEX_CON_COND_COLUMN_INDEX = [0, 1, 2, 4, 6, 8, 9]
CMDEX_CON_DATA_COLUMN = len(CMDEX_CON_COND_COLUMN_INDEX)

CMD14_GPSCON_FILE_COLUMN = 6
CMD14_GPSCON_COND_COLUMN_INDEX = [0, 1, 4]
CMD14_GPSCON_DATA_COLUMN = len(CMD14_GPSCON_COND_COLUMN_INDEX)

CMDEX_GPSCON_FILE_COLUMN = 14
CMDEX_GPSCON_COND_COLUMN_INDEX = [0, 1, 4, 6, 8, 10, 11]
CMDEX_GPSCON_DATA_COLUMN = len(CMDEX_GPSCON_COND_COLUMN_INDEX)

CMD14_MAN_FILE_COLUMN = 5
CMD14_MAN_COND_COLUMN_INDEX = [0, 1, 2]
CMD14_MAN_DATA_COLUMN = len(CMD14_MAN_COND_COLUMN_INDEX)

CMDEX_MAN_FILE_EX_COLUMN = 15
CMDEX_MAN_COND_COLUMN_INDEX = [0, 1, 2, 5, 8, 11, 12]
CMDEX_MAN_DATA_COLUMN = len(CMDEX_MAN_COND_COLUMN_INDEX)


def read_header(header_file):
    """
    Read header data. Dealing discrepancies with different file formats

    :param header_file: string, the name of the header file
    :return: header, dictionary storing header info
    """
    # with open(header_file, "r") as f_txt:
    header = dict(csv.reader(StringIO(header_file), delimiter=":"))
    # Rename "File Name" into "File name" for consistency
    if "File Name" in header:
        header["File name"] = header.pop("File Name")

    return header


def read_data(data_file):
    """
    Read header and data, dealing with different kinds of data type

    :param data_file: string, the name of the data file
    :return: data, numpy array consisting of the XYZ data, Z can be multiple
            column_n, list of the conductivity value column index
    """
    # with open(data_file, "rb") as f_dat:
    df = pd.read_csv(StringIO(data_file), delimiter="\t")
    # Remove the last empty column "Note"
    df = df.iloc[:, :-1].dropna()

    if df.shape[1] == CMD14_CON_FILE_COLUMN:
        data = data_munging(df, CMD14_CON_COND_COLUMN_INDEX)
        column_n = CMD14_CON_DATA_COLUMN
    elif df.shape[1] == CMDEX_CON_FILE_COLUMN:
        data = data_munging(df, CMDEX_CON_COND_COLUMN_INDEX)
        column_n = CMDEX_CON_DATA_COLUMN
    elif df.shape[1] == CMD14_GPSCON_FILE_COLUMN:
        data = data_munging(df, CMD14_GPSCON_COND_COLUMN_INDEX)
        column_n = CMD14_GPSCON_DATA_COLUMN
    elif df.shape[1] == CMDEX_GPSCON_FILE_COLUMN:
        data = data_munging(df, CMDEX_GPSCON_COND_COLUMN_INDEX)
        column_n = CMDEX_GPSCON_DATA_COLUMN
    elif df.shape[1] == CMD14_MAN_FILE_COLUMN:
        data = data_munging(df, CMD14_MAN_COND_COLUMN_INDEX)
        column_n = CMD14_MAN_DATA_COLUMN
    elif df.shape[1] == CMDEX_MAN_FILE_EX_COLUMN:
        data = data_munging(df, CMDEX_MAN_COND_COLUMN_INDEX)
        column_n = CMDEX_MAN_DATA_COLUMN
    else:
        pass
    # data.rename(columns={'Cond.[mS/m]':'Cond'}, inplace=True)
    data = data.groupby(['Latitude', 'Longitude']).mean().reset_index()
    print(data.head())
    print(data.to_numpy())
    return data.to_numpy(), column_n


def data_munging(df, column_index):
    """
    Convert the native GPS data format (3129.6033N, 12120.0470E) to degree format (31.493388, 121.334117),
    only used in GPS continual mode.

    :param df: pandas dataframe of the native GPS data format
    :return: 2 tuple of converted coordinates in degree
    """
    if "Latitude" in df and df.Latitude.dtype != "float":
        lat_float = df["Latitude"].str[:-1].astype(float)
        lon_float = df["Longitude"].str[:-1].astype(float)
        lat_in_degree_float = lat_float // 100 + lat_float % 100 / 60
        lon_in_degree_float = lon_float // 100 + lon_float % 100 / 60
        df["Latitude"] = lat_in_degree_float
        df["Longitude"] = lon_in_degree_float
    return df.iloc[:, column_index]


def mykriging(data):
    """
    Spatial interpolate data using kriging algorithm,
    blank the XYZ data using boundary of convex hull,
    and make a contour plot, saved in the image_path.

    :param data: (:, 3) numpy array consisting X, Y and conductivity data
    :param image_path: string, path used for save image
    :return: none
    """
    points = data[:, [1, 0]]
    hull = ConvexHull(points)
    polygon = points[hull.vertices]
    poly_path = Path(polygon)
    gridx = np.linspace(points[:, 0].min(), points[:, 0].max(), 100)
    gridy = np.linspace(points[:, 1].min(), points[:, 1].max(), 100)

    x, y = np.meshgrid(gridx, gridy)
    coors = np.hstack((x.reshape(-1, 1), y.reshape(-1, 1)))
    mask = poly_path.contains_points(coors).reshape(100, 100)

    ok = OrdinaryKriging(
        data[:, 1], data[:, 0], data[:, 2], variogram_parameters=[1, 0]
    )
    z, ss = ok.execute("masked", gridx, gridy, mask=~mask)

    fig = plt.figure(figsize=[9.6, 7.2])
    # levels = np.linspace(z.min(), z.max(), 20)
    plt.ticklabel_format(style="plain", useOffset=False, axis="both")
    plt.contourf(gridx, gridy, z, levels=20, cmap=plt.get_cmap("jet"))
    plt.colorbar()
    plt.scatter(data[:, 1], data[:, 0], s=2, c="#708090")
    CS = plt.contour(gridx, gridy, z, colors="k", linewidths=0.5)
    plt.clabel(CS, fmt="%1.0f")
    figure = BytesIO()
    plt.savefig(figure, bbox_inches="tight", pad_inches=0.2)
    return figure

if __name__ == "__main__":
    data_file = '../data/浦东南汇振亚助剂厂/0427NHLO.dat'
    with open(data_file, "r") as f_dat:
        data, column_n = read_data(f_dat.read())
        print(mykriging(data.to_numpy(),'yes.png'))
