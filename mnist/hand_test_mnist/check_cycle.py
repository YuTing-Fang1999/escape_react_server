import numpy as np

n = 128

def surround(img):
	for i in range(128):
		img[0][i] = 0
		img[i][0] = 0
		img[127][i] = 0
		img[i][127] = 0
	return img

def have_cycle(img):

	img = img.astype(np.int32)
	img = surround(img)
	group = 0
	# print(img.shape)
	for i in range(n):
		for j in range(n):
			if img[i][j] == 0 :
				img = bfs(img, i, j, group+1)
				group += 1
	# print(group)
	return False if group == 1 else True
def bfs(arr, px, py, group_num):
	dx = [-1, 0, 1, 0]
	dy = [0, 1, 0, -1]
	queue = []
	arr[px][py] = group_num
	queue.append((px, py))
	while len(queue) > 0:
		x, y = queue.pop(0)
		for i in range(4):
			tx = x + dx[i]
			ty = y + dy[i]
			if 0 <= tx < n and 0 <= ty < n :
				if arr[tx][ty] == 0:
					arr[tx][ty] = arr[x][y]
					queue.append((tx, ty))
				if arr[tx][ty] == 254:
					continue
	return arr