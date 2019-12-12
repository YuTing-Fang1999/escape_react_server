import torch
import torch.nn as nn
import cv2
import numpy as np
from os import getpid
from feature_spread import biamp
from getimg import getimage
import time
import requests
from mnist_model import LeNet, predict
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--x1',  default=1166, type=int)
    parser.add_argument('--y1',  default=353,  type=int)
    parser.add_argument('--len1',default=137,  type=int)
    parser.add_argument('--x2',  default=1139, type=int)
    parser.add_argument('--y2',  default=701,  type=int)
    parser.add_argument('--len2',default=130,  type=int)
    args = parser.parse_args()

    net = torch.load('/home/micro/mushding-app/mnist/model/mnist_model_128_10.pth')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    net.to(device)
    print(net)
    print('-'*50)

    count = 0
    net.eval()
    with torch.no_grad() :
        while(1):
            month_img, day_img = getimage(args.x1, args.y1, args.len1, args.x2, args.y2, args.len2)
            month = predict( biamp(month_img), net )
            day = predict( biamp(day_img), net )
            print(month,'/',day, ' count = ', count, sep="")
            requests.get('http://192.168.50.225:8888/checkWritingCamera/'+str(month)+'/'+str(day))
            if month == 5 and day == 5:
                if count > 1:
                    break
                count += 1
                time.sleep(1)
            else:
                count = 0
                # time.sleep(1)
        #call server
        while(1):
            requests.get('http://192.168.50.225:8888/getWritingCamera/'+str(getpid()))
            sleep(1)