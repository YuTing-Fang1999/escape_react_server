import numpy as np
import cv2
import time
from os import listdir
from threading import Thread
import requests
class VideoStreamWidget(object):
	def __init__(self, src=0):
		# Create a VideoCapture object
		self.capture = cv2.VideoCapture(src)

		# Start the thread to read frames from the video stream
		self.thread = Thread(target=self.update, args=())
		self.thread.daemon = True
		self.thread.start()

	def update(self):
		# Read the next frame from the stream in a different thread
		while True:
			if self.capture.isOpened():
				(self.status, self.frame) = self.capture.read()

	def show_frame(self):
		# Display frames in main program
		if self.status:
			# self.frame = self.maintain_aspect_ratio_resize(self.frame, width=600)
			return (cv2.flip(self.frame, -1))

		# Press Q on keyboard to stop recording
		# key = cv2.waitKey(1)
		# if key == ord('q'):
		# 	self.capture.release()
		# 	cv2.destroyAllWindows()
		# 	exit(1)

# if __name__ == '__main__':
stream_link = 'http://192.168.50.205:8080/?action=stream'
video_stream_widget = VideoStreamWidget(stream_link)
def getimage(x1=1166, y1=353, len1=137, x2=1139, y2=701, len2=130):
	while True:
		try:
			img = video_stream_widget.show_frame()
			#1184, 337
			# x1, y1 = 1184, 337
			# x2, y2 = 1175, 690
			subimg1 = img[y1:y1+len1, x1:x1+len1]
			# cv2.imwrite("./month.png",subimg1)
			subimg2 = img[y2:y2+len2, x2:x2+len2]
			# cv2.imwrite("./day.png",subimg2)

			return subimg1, subimg2
		except AttributeError:
			pass