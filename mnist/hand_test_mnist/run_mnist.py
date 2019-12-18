import torch
import torch.nn as nn
import cv2
import numpy as np
from mnist_model import LeNet, predict
from check_cycle import have_cycle

if __name__ == '__main__':
    print('loading model')
    net = torch.load('./model/mnist_model_128_10.pth')
    print('loaded successed')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    net.to(device)
    print(net)
    print('-'*50)
    count = 0
    net.eval()
    with torch.no_grad() :
        # month_img, day_img = getimage(args.x1, args.y1, args.len1, args.x2, args.y2, args.len2)
        month_img = cv2.imread('biamp_month.png', 0)
        day_img = cv2.imread('biamp_day.png', 0)
        month = predict( month_img, net )
        day = predict( day_img, net )
        # if have_cycle( month ):
        #     month = -2
        # if have_cycle( day ):
        #     day = -2
        print(month,'/',day, ' count = ', count, sep="")
