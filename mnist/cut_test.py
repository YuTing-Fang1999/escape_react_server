from getimg import getimage
from feature_spread import biamp
import numpy as np
import cv2

if __name__ == '__main__':
    try:
        month, day = getimage()
        cv2.imwrite('month.png', month)
        cv2.imwrite('day.png', day)

        month = biamp(month)
        a = month[:,:,np.newaxis]   # (128, 128, 1)
        a = np.append(a, a, axis=2) # (128, 128, 2)
        month = np.append(month[:,:,np.newaxis], a, axis=2)# (128, 128, 3)

        cv2.imwrite('biamp_month.png', month)

        day = biamp(day)
        a = day[:,:,np.newaxis]   # (128, 128, 1)
        a = np.append(a, a, axis=2) # (128, 128, 2)
        day = np.append(day[:,:,np.newaxis], a, axis=2)# (128, 128, 3)
        cv2.imwrite('biamp_day.png', day)
        print('End')
    except Exception:
        pass