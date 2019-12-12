import torch
import torch.nn as nn
import cv2
import numpy as np
import argparse

def biamp(input_img):
	SIZE = 128
	input_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
	___, img = cv2.threshold(input_img, thresh=90, maxval=255, type=cv2.THRESH_BINARY_INV)
	
	img = cv2.resize(img, (SIZE, SIZE))

	___, img = cv2.threshold(img, thresh=20, maxval=255, type=cv2.THRESH_BINARY)

	arr = np.zeros(SIZE*SIZE, dtype=np.uint8).reshape(SIZE, SIZE)


	def fill(x, y):
		l = x - 5
		u = y - 5
		r = x + 5
		d = y + 5
		if l < 0 :
			l = 0
		if u < 0 :
			u = 0
		if r >= SIZE :
			r = SIZE
		if d >= SIZE :
			d = SIZE
		for i in range(l, r):
			for j in range(u, d):
				arr[i][j] = 255

	dx = [0,1,0,-1]
	dy = [-1,0,1,0]
	block = {}
	que = []
	def dfs(x, y, cnt):
		if cnt > 100:
			que.append((x, y))
			return


		for i in range(4):
			tx = x+dx[i]
			ty = y+dy[i]
			# print(tx, ty)
			if tx < 0 or tx >= SIZE or ty < 0 or ty >= SIZE:
				continue
			if arr[tx][ty] == 255 :
				arr[tx][ty] = arr[x][y]
				block[arr[tx][ty]] += 1
				dfs(tx, ty, cnt+1)

	for i in range(SIZE):
		for j in range(SIZE):
			if img[i][j] == 255 :
				fill(i, j)

	color = 255
	for i in range(SIZE):
		for j in range(SIZE):
			if arr[i][j] == 255 :
				color -= 1
				arr[i][j] = color
				block[color] = 1
				dfs(i, j, 1)
				while( len(que) != 0 ):
					dfs(que[0][0],que[0][1],1)
					que.pop(0)
	
	# for i in block:
	# 	print(i, block[i])
	# print('-'*50)
	if len(block) > 0:
		max_size = 254
		for i in block:
			if block[max_size] < block[i]:
				max_size = i

		for i in range(SIZE):
			for j in range(SIZE):
				if arr[i][j] != max_size:
					arr[i][j] = 0

	return arr
