import os
import numpy as np
import pandas as pd
from datetime import datetime
from pynwb import NWBHDF5IO
from PIL import Image, ImageSequence


def save_tiff2json(tiff_file_path, maxidx=10):
    folder_path = os.path.dirname(tiff_file_path)
    file_name, ext = os.path.splitext(os.path.basename(tiff_file_path))

    # Tiff画像を読み込む
    tiffs = []
    image = Image.open(tiff_file_path)

    for i, page in enumerate(ImageSequence.Iterator(image)):
        if i >= maxidx:
            break

        page = np.array(page)
        tiffs.append(page)

    tiffs = np.array(tiffs)

    images = []
    for i, _img in enumerate(tiffs):
        images.append(_img.tolist())

    pd.DataFrame(images).to_json(
        os.path.join(folder_path, f'{file_name}_{str(maxidx)}.json'), 
        indent=4,
        orient="values"
    )


def save_csv2json(csv_file_path):
    folder_path = os.path.dirname(csv_file_path)
    file_name, ext = os.path.splitext(os.path.basename(csv_file_path))
    pd.read_csv(csv_file_path).to_json(
        os.path.join(folder_path, f'{file_name}.json'), indent=4,orient="split")


def save_nwb(nwbfile, save_path):
    time = datetime.now().strftime("%Y%m%d-%H%M")

    if not os.path.exists(save_path):
        os.makedirs(save_path)

    with NWBHDF5IO(os.path.join(save_path, f'{time}.nwb'), 'w') as f:
        f.write(nwbfile)