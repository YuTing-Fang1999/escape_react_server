import cv2

for i in range(1,255,10):
	img = cv2.imread('month.png')
	img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	___, img = cv2.threshold(img, thresh=i, maxval=255, type=cv2.THRESH_BINARY_INV)
	
	img = cv2.resize(img, (128, 128))

	___, img = cv2.threshold(img, thresh=20, maxval=255, type=cv2.THRESH_BINARY)
	cv2.imshow('i = {}'.format(i), img)
	# cv2.imshow('i', img)
	cv2.waitKey(0)
	cv2.destroyAllWindows()
cv2.destroyAllWindows()	