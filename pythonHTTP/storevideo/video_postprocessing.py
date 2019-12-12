import numpy as np
import tensorflow as tf
import cv2
import time

from threading import Thread
import threading
from os import getpid
import requests
import argparse

class DetectorAPI:
    def __init__(self, path_to_ckpt):
        self.path_to_ckpt = path_to_ckpt

        self.detection_graph = tf.Graph()
        with self.detection_graph.as_default():
            od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(self.path_to_ckpt, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def, name='')

        self.default_graph = self.detection_graph.as_default()
        self.sess = tf.Session(graph=self.detection_graph)

        # Definite input and output Tensors for detection_graph
        self.image_tensor = self.detection_graph.get_tensor_by_name('image_tensor:0')
        # Each box represents a part of the image where a particular object was detected.
        self.detection_boxes = self.detection_graph.get_tensor_by_name('detection_boxes:0')
        # Each score represent how level of confidence for each of the objects.
        # Score is shown on the result image, together with the class label.
        self.detection_scores = self.detection_graph.get_tensor_by_name('detection_scores:0')
        self.detection_classes = self.detection_graph.get_tensor_by_name('detection_classes:0')
        self.num_detections = self.detection_graph.get_tensor_by_name('num_detections:0')

    def processFrame(self, image):
        # Expand dimensions since the trained_model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(image, axis=0)
        # Actual detection.
        start_time = time.time()
        (boxes, scores, classes, num) = self.sess.run(
            [self.detection_boxes, self.detection_scores, self.detection_classes, self.num_detections],
            feed_dict={self.image_tensor: image_np_expanded})
        end_time = time.time()

        # print("Elapsed Time:", end_time-start_time)

        im_height, im_width,_ = image.shape
        boxes_list = [None for i in range(boxes.shape[1])]
        for i in range(boxes.shape[1]):
            boxes_list[i] = (int(boxes[0,i,0] * im_height),
                        int(boxes[0,i,1]*im_width),
                        int(boxes[0,i,2] * im_height),
                        int(boxes[0,i,3]*im_width))

        return boxes_list, scores[0].tolist(), [int(x) for x in classes[0].tolist()], int(num[0])

    def close(self):
        self.sess.close()
        self.default_graph.close()

def p(cap, file_name):
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(file_name, fourcc, 20.0, (640, 360))
    while cap.isOpened():
        ret, frame = cap.read()
        if ret == False:
            break
        frame = cv2.resize(frame, (640, 360), interpolation=cv2.INTER_CUBIC) # shape = (360, 640, 3)
        # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # (360, 640)
        # a = frame[:,:,np.newaxis]   # (360, 640, 1)
        # a = np.append(a, a, axis=2) # (360, 640, 2)
        # frame = np.append(frame[:,:,np.newaxis], a, axis=2)# (360, 640, 3)
        height, width, channels = frame.shape
        boxes, scores, classes, num = odapi.processFrame(frame)
        # Visualization of the results of a detection.
        for i in range(len(boxes)):
            # Class 1 represents human
            threshold = 0.7
            if classes[i] == 1 and scores[i] > threshold:
                box = boxes[i]
                cv2.rectangle(frame,(box[1],box[0]),(box[3],box[2]),(255,0,0),2)
                # cx = int((box[1]+box[3])/2)
                # cy = int((box[0]+box[2])/2)
                # cv2.circle(frame, (cx,cy), 2, (0,155,255), 2)

        # frame = cv2.flip(frame, -1)
        out.write(frame)

    out.release()
    cap.release()
if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--input_file', required=True)
    parser.add_argument('--output_file', required=True)
    args = parser.parse_args()
    model_path = '/home/micro/mushding-app/pythonHTTP/storevideo/faster_rcnn_inception_v2_coco_2018_01_28/frozen_inference_graph.pb'
    odapi = DetectorAPI(path_to_ckpt=model_path)

    print('processing', args.input_file)
    p( cv2.VideoCapture(args.input_file), args.output_file)
    print(args.output_file, 'save success')

    file_name = args.output_file.split('/')[-1]
    while(1):
        requests.get('http://192.168.50.225:8888/checkStoreVideo/' + file_name + '/' + str(getpid()))
        time.sleep(1)