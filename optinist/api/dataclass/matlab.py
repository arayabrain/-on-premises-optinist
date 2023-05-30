import numpy as np
import scipy.io as sio

from optinist.api.dataclass.base import BaseData
from optinist.api.dir_path import DIRPATH


class MatlabData(BaseData):
    def __init__(self, data, output_dir=DIRPATH.OUTPUT_DIR, file_name="matlab"):
        super().__init__(file_name)
        self.json_path = None

        if isinstance(data, str):
            self.data = sio.loadmat(data)
        else:
            self.data = self.data = np.array(data)
