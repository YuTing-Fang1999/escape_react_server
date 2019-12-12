import cv2
import numpy as np
from threading import Thread
import threading
import time
import os
import signal
import sys

def f(cap='', symbol=''):
  # use XVID encoding
  fourcc = cv2.VideoWriter_fourcc(*'XVID')
  # FPS = 20.0，size 640x360
  out = cv2.VideoWriter('/home/micro/mushding-app/pythonHTTP/storevideo/'+'output'+symbol+'.avi', fourcc, 20.0, (640, 360))
  # init_time = time.monotonic()
  # while time.monotonic() - init_time < 30:
  cnt = 0
  while True:
    ret, frame = cap.read()
    frame = cv2.resize(frame, (640, 360), interpolation=cv2.INTER_CUBIC) # shape = (360, 640, 3)
    if ret == True:
      frame = cv2.flip(frame, -1)
      out.write(frame)
      cnt+=1
      if cnt > 20 * 30: #FPS * 30s
        break
    else:
      continue

  out.release()
  cap.release()
  # cv2.destroyAllWindows()

if __name__ == '__main__' :
  caplist = [(cv2.VideoCapture('http://192.168.50.200:8080/?action=stream'), 'A'),
             (cv2.VideoCapture('http://192.168.50.201:8080/?action=stream'), 'B'),
             (cv2.VideoCapture('http://192.168.50.202:8080/?action=stream'), 'C'),
             (cv2.VideoCapture('http://192.168.50.203:8080/?action=stream'), 'D')]
  # caplist = [(cv2.VideoCapture('http://192.168.50.200:8080/?action=stream'), 'Q')]
  threads = []
  for cap in caplist :
    threads.append(threading.Thread(target = f, args = (cap[0], cap[1], )))
  for i in threads :
    i.start()