import numpy as np
import cv2
import time

from os import getpid
import requests

width = 640
height = 360

def merge(cap, output_file_name):
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    # out = cv2.VideoWriter(output_file_name, fourcc, 20.0, (Frame_Width, Frame_Height))
    out = cv2.VideoWriter(output_file_name, fourcc, 20.0, (width*2, height*2))
    # out = cv2.VideoWriter(output_file_name, fourcc, 20.0, (640, 360))
    coordinate = [(0, 0), (0, width), (height, 0), (height, width)]
    cnt = 0
    while cnt < 20*30 :
        Frame = np.zeros([height*2, width*2, 3], dtype=np.uint8)
        for i in range(4):
            ret, sub_frame = cap[i].read()
            if ret == False:
                continue
                # out.release()
                # return
            Frame[coordinate[i][0]:coordinate[i][0]+360, coordinate[i][1]:coordinate[i][1]+640] = sub_frame
        print(cnt)
        cnt+=1
        out.write(Frame)

    out.release()

if __name__ == '__main__':
    vediolist = [cv2.VideoCapture('frame_person_A.avi'),
                 cv2.VideoCapture('frame_person_B.avi'),
                 cv2.VideoCapture('frame_person_C.avi'),
                 cv2.VideoCapture('frame_person_D.avi')]

    merge( vediolist, 'merge.avi')
    print('merge.avi saved successfully')

    for cap in vediolist:
        cap.release()
    
    while(True):
        requests.get('http://192.168.50.225:8888/checkMergeVideo/'+str(getpid()))
        time.sleep(1)