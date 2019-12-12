# -*- coding: UTF-8 -*-
# import flask
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

# import thread and queue
from queue import Queue
import threading
import requests
import json

# import mongodb
from pymongo import MongoClient
from bson import BSON
from bson import json_util

# import others
import time
import os
from datetime import datetime


# connect to mongodb server
client = MongoClient(host='localhost', port=27017)
# asign database
db = client.website

def checkIPInThread(ip, request):
	try:
		request_get = requests.get(request)
	except requests.exceptions.RequestException as e:	# if ip is not on the wifi
		db.screenState.find_one_and_update({'ip': str(ip)}, {"$set": {"isConnect": False}})
	else:
		db.screenState.find_one_and_update({'ip': str(ip)}, {"$set": {"isConnect": True}})			
		db.screenState.find_one_and_update({'ip': str(ip)}, {"$set": {"isPlaying": request_get.json()['isPlaying']}})

# get new id of notifications
def nextNotifications(sequenceName):
	sequenceDocument = db.notifications.find_and_modify(
		{ "_id": sequenceName },
		{ "$inc": { "sequence_value": 1 } },
		new = True
	);	
	newid = sequenceDocument["sequence_value"]
	return newid

def nextYoutubeSongIndex(sequenceName):
	sequenceDocument = db.youtubeSongIndex.find_and_modify(
		{ "_id": sequenceName },
		{ "$inc": { "sequence_value": 1 } },
		new = True
	);	
	newid = sequenceDocument["sequence_value"]
	return newid

app = Flask(__name__)
CORS(app)

#Check drawer (40 - 42)
@app.route('/checkDrawer', methods=['GET'])
def checkDrawer():
	startIP, endIP = 40, 42
	
	for ip in range(startIP, endIP + 1):
		try:
			request_get = requests.get("http://192.168.50." + str(ip))
		except requests.exceptions.RequestException as e:	# if ip is not on the wifi
			db.drawer.find_one_and_update({'ip': str(ip)}, {"$set": {"error": True}})
		else:
			db.drawer.find_one_and_update({'ip': str(ip)}, {"$set": {"error": False}})			
			message = request_get.json()
			db.drawer.find_one_and_update({'ip': str(ip)}, {"$set": message})
			

	drawer_json = db.drawer.find({'id': {'$exists': True}})
	drawer_json = json.loads(json_util.dumps(drawer_json))

	return jsonify(drawer_json)

# Check Door (45 - 47)
@app.route('/checkDoor', methods=['GET'])
def checkDoor():
	startIP, endIP = 45, 47

	for ip in range(startIP, endIP + 1):
		try:
			request_get = requests.get("http://192.168.50." + str(ip))
		except requests.exceptions.RequestException as e:	# if ip is not on the wifi
			db.door.find_one_and_update({'ip': str(ip)}, {"$set": {"error": True}})
		else:
			db.door.find_one_and_update({'ip': str(ip)}, {"$set": {"error": False}})			
			message = request_get.json()
			db.door.find_one_and_update({'ip': str(ip)}, {"$set": message})

	door_json = db.door.find({'id': {'$exists': True}})
	door_json = json.loads(json_util.dumps(door_json))

	return jsonify(door_json)

# Check Usb Video state (212) video 1 ~ 3
@app.route('/checkUsb', methods=['GET'])
def checkUsb():
	try:
		usbVideoState = requests.get('http://192.168.50.212:5000/checkScreenState')
	except requests.exceptions.RequestException as e:
		db.usbVideo.find_one_and_update({"usb_1": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.usbVideo.find_one_and_update({"usb_1": {"$exists": True}}, {"$set": usbVideoState.json()})
		db.usbVideo.find_one_and_update({"usb_1": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		usbVideo_json = db.usbVideo.find({'usb_1': {'$exists': True}})
		usbVideo_json = json.loads(json_util.dumps(usbVideo_json))
		return jsonify(usbVideo_json)

# Check calculator (211)
@app.route('/checkCalculator', methods=['GET'])
def checkCalculator():
	try:
		calculatorState = requests.get('http://192.168.50.211:5000/getCalculator')
	except requests.exceptions.RequestException as e:
		db.calculator.find_one_and_update({"note_array": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.calculator.find_one_and_update({"note_array": {"$exists": True}}, {"$set": calculatorState.json()})
		db.calculator.find_one_and_update({"note_array": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		calculator_json = db.calculator.find({'note_array': {'$exists': True}})
		calculator_json = json.loads(json_util.dumps(calculator_json))
		return jsonify(calculator_json)

# Get calculator (211)
@app.route('/getCalculator', methods=['GET'])
def getCalculator():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "DialpadIcon",
	    'message': "(第二間房間) 計算機順序 對了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})

	# Open drawer (C)(42)
	requests.get('http://192.168.50.225:8888/openDrawer/42/1')

	return "Open drawer successfully"

# Check notifications
@app.route('/checkNotifications', methods=['GET'])
def checkNotifications():
	result = db.notifications.find({'time': {'$exists': True}}).sort([("_id", -1)])
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# remove the notifications list in the database
@app.route('/clearNotifications', methods=['GET'])
def clearNotifications():
	result = db.notifications.remove({})	
	result = db.notifications.insert({"_id": "productid","sequence_value": 0})
	return "clearNotifications successfully"

# Check menuList
@app.route('/checkMenuList/<int:isOpen>', methods=['GET'])
def checkMenuList(isOpen):
	if isOpen == 1:
		db.menuList.find_one_and_update({'open': {'$exists': True}}, {'$set': {'open': True}})
	elif isOpen == 0:
		db.menuList.find_one_and_update({'open': {'$exists': True}}, {'$set': {'open': False}})
	
	menuList_json = db.menuList.find({'open': {'$exists': True}})
	menuList_json = json.loads(json_util.dumps(menuList_json))
	return jsonify(menuList_json)

# Check TimeNow -> DB
@app.route('/checkTimeNow', methods=['GET'])
def checkTimeNow():
	try:
		timeNow = requests.get('http://192.168.50.61')
	except requests.exceptions.RequestException as e:
		db.timeCounter.find_one_and_update({"countdown_num": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.timeCounter.find_one_and_update({"countdown_num": {"$exists": True}}, {"$set": timeNow.json()['variables']})
		db.timeCounter.find_one_and_update({"countdown_num": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		timeNow_json = db.timeCounter.find({'countdown_num': {'$exists': True}})
		timeNow_json = json.loads(json_util.dumps(timeNow_json))
		return jsonify(timeNow_json)

# Check TimeCounter (61)
@app.route('/checkTimeCounter/<int:index>/<int:adjustTime>', methods=['GET'])
def checkTimeCounter(index, adjustTime):
	if index == 2:
		requests.get('http://192.168.50.61/set_run?params=1') 		# start counting
	if index == 3:
		requests.get('http://192.168.50.61/set_run?params=0')		# pause counting
	if index == 4:
		requests.get('http://192.168.50.61/set_num?params=60')		# reset counting

	if index == 1:
		requests.get('http://192.168.50.61/set_add?params=' + str(adjustTime))
	if index == 0:
		requests.get('http://192.168.50.61/set_sub?params=' + str(adjustTime))
	return "change successfully"

# Open Drawer (40 - 42)
@app.route('/openDrawer/<int:index>/<int:isOpen>', methods=['GET'])
def openDrawer(index, isOpen):
	if index == 40:
		meg_index = " 1 "
	elif index == 41:
		meg_index = " 2 "
	elif index == 42:
		meg_index = " 3 "

	if isOpen == 1:
		meg_state = " 打開了！"
	elif isOpen == 0:
		meg_state = " 關起來了！"

	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "DnsIcon",
	    'message': "第" + meg_index + "個抽屜" + meg_state,
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})	
	requests.get('http://192.168.50.' + str(index) + '/set_lock?params=' + str(isOpen))
	return jsonify('open drawer successfully')

# Open Door (45 - 47)
@app.route('/openDoor/<int:index>/<int:isOpen>', methods=['GET'])
def openDoor(index, isOpen):
	if index == 45:
		meg_index = " 1 "
	elif index == 46:
		meg_index = " 2 "
	elif index == 47:
		meg_index = " 3 "

	if isOpen == 1:
		meg_state = " 打開了！"
	elif isOpen == 0:
		meg_state = " 關起來了！"
		
	# 如果門打開了就開始儲存影片
	if isOpen == 1:
		os.chdir("/home/micro/mushding-app/pythonHTTP/storevideo")
		now =datetime.now()
		db.savingTime.remove({})
		db.savingTime.insert({
			"min": now.minute,
			"sec": now.second,
		})
		db.videoState.update({"name": "videoState"}, {"$set": {"start": True}}, True)
		os.system("./videoA.sh &")	# sorry
	
	# if isOpen == 2:
		

	db.notifications.insert({
		'_id': nextNotifications("productid"),
		'avatarIcon': "MeetingRoomIcon",
		'message': "第" + meg_index + "扇門" + meg_state,
		'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	requests.get('http://192.168.50.' + str(index) + '/set_lock?params=' + str(isOpen))
	return jsonify('open door successfully')

# Check Electric Power (49) for web
@app.route('/checkPower', methods=['GET'])
def checkPower():
	try:
		power = requests.get('http://192.168.50.49')
	except requests.exceptions.RequestException as e:
		db.firstRoomPower.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.firstRoomPower.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		power_json = db.firstRoomPower.find({'isOpen': {'$exists': True}})
		power_json = json.loads(json_util.dumps(power_json))
		return jsonify(power_json)

# Get Electric Power (49) for progress
@app.route('/getPower/<int:index>', methods=['GET'])
def getPower(index):
	if index == 1:
		meg_state = " 打開了！"
	if index == 0:
		meg_state = " 關起來了！"

	# sound effect
	if index == 1:
		requests.get('http://192.168.50.210:5000/playFirstRoomPowerOn')
		time.sleep(1.1)
	
	# Open Camera
	if index == 1:
		requests.get('http://192.168.50.225:8888/setFirstRoomCamera/1')
		requests.get('http://192.168.50.225:8888/setFirstRoomCamera/2')
	elif index == 0:
		requests.get("http://192.168.50.225:8888/killFirstRoomCamera")
		requests.get("http://192.168.50.225:8888/setFirstRoomCamera/0")
	
	# Open Power
	requests.get('http://192.168.50.49/set_lock?params=' + str(index))

	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_1",
	    'message': "(第一間房間) 總電源 " + meg_state,
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.firstRoomPower.find_one_and_update({
		"isOpen": {"$exists": True}}, 
		{"$set": {"isOpen": index},
	})

	# Start recording video
	time.sleep(10)
	if index == 1:
		os.system('python3 /home/micro/mushding-app/pythonHTTP/storevideo/save_video.py &')

	return "open power successfully"

# Get phone 4 RFID card
@app.route('/getRFID', methods=['GET'])
def getRFID():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_1",
	    'message': "(第一間房間) RFID 開了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.RFID.update({"name": "RFID"}, {"$set": {"isOpen": True}}, True)

	return "RFID get successfully"

# Kill FirstRoom Camera
@app.route('/killFirstRoomCamera', methods=['GET'])
def killFirstRoomCamera():
	for i in range(3):
		os.system("ps aux | grep '[c]amera_p1' | grep -v 'grep python' | sed -n '1p' | awk {'print $2'} | xargs kill -9")
	for i in range(3):
		os.system("ps aux | grep '[c]amera_p2' | grep -v 'grep python' | sed -n '1p' | awk {'print $2'} | xargs kill -9")
	for i in range(3):
		os.system("ps aux | grep '[c]amera_p3' | grep -v 'grep python' | sed -n '1p' | awk {'print $2'} | xargs kill -9")
	return "kill successfully"

# Set FirstRoom Camera
@app.route('/setFirstRoomCamera/<int:index>', methods=['GET'])
def setFirstRoomCamera(index):
	savedPath = os.getcwd()
	os.chdir("/home/micro/YOLOv3/pjreddie/darknet")
	
	# not face at player
	if index == 0:
		requests.get("http://192.168.50.200:8090/move/180/80")
		requests.get("http://192.168.50.201:8090/move/180/80")
		requests.get("http://192.168.50.202:8090/move/0/80")
		requests.get("http://192.168.50.203:8090/move/0/80")
	# face at player (1)
	elif index == 1:
		try:
			requests.get('http://192.168.50.200:8090')
			requests.get('http://192.168.50.201:8090')
		except requests.exceptions.RequestException as e:
			return "Camera Disconnected"			
		else:
			os.system("python control.py --filename camera_p1.py &")
	# face at player (2)
	elif index == 2:
		try:
			requests.get('http://192.168.50.202:8090')
			requests.get('http://192.168.50.203:8090')
		except requests.exceptions.RequestException as e:
			return "Camera Disconnected"			
		else:
			os.system("python control.py --filename camera_p2.py &")
	# second room
	elif index == 3:
		try:
			requests.get('http://192.168.50.203:8090')
			requests.get('http://192.168.50.200:8090')
		except requests.exceptions.RequestException as e:
			return "Camera Disconnected"			
		else:
			os.system("python control.py --filename camera_p3.py &")
				
	os.chdir(savedPath)
	return "reset camera successfully"

# Reset Coffin
@app.route('/resetCoffin/<int:isOpen>', methods=['GET'])
def resetCoffin(isOpen):
	requests.get('http://192.168.50.62/set_lock?params=' + str(isOpen))
	db.secondRoomCoffin.find_one_and_update(
		{'isOpen': {'$exists': True}}, 
		{'$set': {'isOpen': isOpen}}
	)
	if isOpen == 1:
		requests.get('http://192.168.50.225:8888/getCoffin')
	return "reset WireBox successfully"

# Get Coffin
@app.route('/getCoffin', methods=['GET'])
def getCoffin():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_2",
	    'message': "(第二間房間) 娃娃棺材 開了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.secondRoomWireBox.find_one_and_update(
		{'isOpen': {'$exists': True}}, 
		{'$set': {'isOpen': 1}}
	)

	# Open Drawer (B)(41)
	requests.get('http://192.168.50.225:8888/openDrawer/41/1')

	return "get successfully"

# Check Coffin
@app.route('/checkCoffin', methods=['GET'])
def checkCoffin():
	try:
		coffin = requests.get('http://192.168.50.62')
	except requests.exceptions.RequestException as e:
		db.secondRoomCoffin.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.secondRoomCoffin.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": coffin.json()['variables']['lock']}})
		db.secondRoomCoffin.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		coffin_json = db.secondRoomCoffin.find({'isOpen': {'$exists': True}})
		coffin_json = json.loads(json_util.dumps(coffin_json))
		return jsonify(coffin_json)

# Check HandWriting Camera (205) Date
@app.route('/checkWritingCamera/<string:month>/<string:date>', methods=['GET'])		# in order to handle negetive int
def checkWritingCemara(month, date):
	month = int(month)
	date = int(date)

	if month == 0 and date == 0:		# for website update
		secondRoomWritingCamera_json = db.secondRoomWritingCamera.find({'date': {'$exists': True}})
		secondRoomWritingCamera_json = json.loads(json_util.dumps(secondRoomWritingCamera_json))
		return jsonify(secondRoomWritingCamera_json)

	date_json = {
		"month": month,
		"date": date,
	}
	db.secondRoomWritingCamera.find_one_and_update({"date": {"$exists": True}}, {"$set": json.loads(json.dumps(date_json))})
	db.secondRoomWritingCamera.find_one_and_update({"date": {"$exists": True}}, {"$set": {"error": False}})
	return "update date successfully"

# Get HandWriting Camera (205)
@app.route('/getWritingCamera/<int:pid>', methods=['GET'])
def getWritingCemara(pid):
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_2",
	    'message': "(第二間房間) 手寫辨識 過關了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.secondRoomWritingCamera.find_one_and_update(
		{"date": {"$exists": True}}, 
		{"$set": {"isCorrect": True}}
	)
	db.secondRoomWritingCamera.find_one_and_update(
		{'isRunning': {"$exists": True}}, 
		{"$set": {'isRunning': False}},
	)

	myCmd = 'kill -9 ' + str(pid) 
	os.system(myCmd)												

	# open (D)(40) Drawer
	requests.get('http://192.168.50.225:8888/openDrawer/40/1') 			
	return "kill pid successfully"
	
# Check Wier Box (60) for web
@app.route('/checkWireBox', methods=['GET'])
def checkWireBox():
	try:
		wireBox = requests.get('http://192.168.50.60')
	except requests.exceptions.RequestException as e:
		db.secondRoomWireBox.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": True}})
	else:
		db.secondRoomWireBox.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": wireBox.json()['variables']['lock']}})
		db.secondRoomWireBox.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"error": False}})
	finally:
		wireBox_json = db.secondRoomWireBox.find({'isOpen': {'$exists': True}})
		wireBox_json = json.loads(json_util.dumps(wireBox_json))
		return jsonify(wireBox_json)

# reset WireBox (60)
@app.route('/resetWireBox/<int:isOpen>', methods=['GET'])
def resetWireBox(isOpen):
	requests.get('http://192.168.50.60/set_lock?params=' + str(isOpen))
	db.secondRoomWireBox.find_one_and_update(
		{'isOpen': {'$exists': True}}, 
		{'$set': {'isOpen': isOpen}}
	)
	if isOpen == 1:
		requests.get('http://192.168.50.225:8888/getWireBox')
	return "reset WireBox successfully"

# Get Wire Box (60) for progress
@app.route('/getWireBox', methods=['GET'])
def getWireBox():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_2",
	    'message': "(第二間房間) 接線盒 過關了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.secondRoomWireBox.find_one_and_update(
		{'isOpen': {'$exists': True}}, 
		{'$set': {'isOpen': 1}}
	)
	# sound effect
	requests.get('http://192.168.50.210:5000/playSecondRoomWireBox')
	time.sleep(0.7)

	# Open 2nd door
	requests.get('http://192.168.50.225:8888/openDoor/46/1')				
	return "WierBox successfully"

# Get Nine Blocks
@app.route('/getNineBlock', methods=['GET'])
def getNineBlock():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_3",
	    'message': "(第三間房間) 九宮格 過關了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	return "get successfully"

@app.route('/checkMergeVideo/<int:pid>', methods=['GET'])
def checkMergeVideo(pid):
	os.system('kill -9 ' + str(pid))
	requests.get('http://192.168.50.217:5000/downloadVideo')
	return "kill pid successfully"

# from db return All Screen State
@app.route('/checkAllScreenState', methods=['GET'])
def checkAllScreenState():
	startIP, endIP = 213, 220

	threads = []
	for ip in range(startIP, endIP + 1):
		request = "http://192.168.50." + str(ip) + ":5000/checkScreenState"
		threads.append(threading.Thread(target = checkIPInThread, args = (ip, request, )))
		threads[ip - 213].start()

	for ip in range(startIP, endIP + 1):
		threads[ip - 213].join()

	result = db.screenState.find()
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# !!! reset Room state !!!
@app.route('/resetRoomState/<int:room>', methods=['GET'])
def resetRoomState(room):
	if room == 3:
		pass
	elif room == 2:
		# Close All Drawer
		for ip in range(40, 43):
			requests.get('http://192.168.50.225:8888/openDrawer/' + ip + '/0')

		# reset wireBox and coffin
		requests.get('http://192.168.50.225:8888/resetWireBox')
		requests.get('http://192.168.50.225:8888/resetCoffin')

		# reset calculator
		requests.get('http://192.168.50.211:5000/calculator/11')
	elif room == 1:
		# Close Light
		requests.get('http://192.168.50.225:8888/getPower/0')

	return "test"

# !!! reset ALL Room state !!!
@app.route('/resetALLState', methods=['GET'])
def resetALLState():
	return "test"

# Youtube SongList Series

# Stop Playing
@app.route('/stopPlaying', methods=['GET'])
def stopPlaying():
	requests.get("http://192.168.50.210:5000/stopYoutubeDLList")
	result = db.youtubeSongIndex.find_one_and_update({'isStopState': {'$exists': True}}, {"$set": {"isStopState": 2}})
	return "stopPlaying successfully"

# pause Playing
@app.route('/pausePlaying', methods=['GET'])
def pausePlaying():
	requests.get("http://192.168.50.210:5000/pauseYoutubeDLList")
	result = db.youtubeSongIndex.find_one_and_update({'isStopState': {'$exists': True}}, {"$set": {"isStopState": 1}})
	return "pausePlaying successfully"

# restart Playing
@app.route('/restartPlaying', methods=['GET'])
def restartPlaying():
	requests.get("http://192.168.50.210:5000/replayYoutubeDLList")
	result = db.youtubeSongIndex.find_one_and_update({'isStopState': {'$exists': True}}, {"$set": {"isStopState": 0}})
	return "restartPlaying successfully"

# start Playing
@app.route('/startPlaying/<int:index>', methods=['GET'])
def startPlaying(index):
	requests.get("http://192.168.50.210:5000/playsongList/" + str(index))
	result = db.youtubeSongIndex.find_one_and_update({'isStopState': {'$exists': True}}, {"$set": {"isStopState": 0}})
	return "restartPlaying successfully"

# Stop Continue
@app.route('/stopContinue', methods=['GET'])
def stopContinue():
	result = db.youtubeSongIndex.find_one_and_update({'isContinue': {'$exists': True}}, {"$set": {"isContinue": False}})
	result = json.loads(json_util.dumps(result))
	return "set successfully"

# Start Continue
@app.route('/startContinue', methods=['GET'])
def startContinue():
	result = db.youtubeSongIndex.find_one_and_update({'isContinue': {'$exists': True}}, {"$set": {"isContinue": True}})
	result = json.loads(json_util.dumps(result))
	return "set successfully"
	
# return song information
@app.route('/checkSongIndex', methods=['GET'])
def checkSongIndex():
	# check progress
	result = requests.get('http://192.168.50.210:5000/checkPosition')
	duration = result.json()['duration']
	position = result.json()['position']
	percentages = 0
	if duration != 0:
		percentages = 100 * float(position)/float(duration)

	result = db.youtubeSongIndex.find_one_and_update({'nowProgress': {'$exists': True}}, {"$set": {"nowProgress": percentages}})

	result = db.youtubeSongIndex.find({'playNowIndex': {'$exists': True}})
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# update next Song
@app.route('/nextSongIndex/<int:index>', methods=['GET'])
def nextSongIndex(index):
	result = db.youtubeSongIndex.find_one_and_update({'playNowIndex': {'$exists': True}}, {"$set": {"playNowIndex": index}})
	return "set successfully"

# next Song
@app.route('/nextSong', methods=['GET'])
def nextSong():
	result = db.youtubeSongIndex.find_one_and_update({'playNowIndex': {'$exists': True}}, {"$inc": {"playNowIndex": 1}}, new=True)
	result = json.loads(json_util.dumps(result))
	
	song = db.youtubeSongList.find({'index': {'$exists': True}})
	song = json.loads(json_util.dumps(song))

	nowIndex = result['playNowIndex']

	if nowIndex > len(song) - 1:
		result = db.youtubeSongIndex.find_one_and_update({'playNowIndex': {'$exists': True}}, {"$set":{"playNowIndex": 0}})
		nowIndex = 0 
	if result['isContinue']:
		requests.get('http://192.168.50.210:5000/playsongList/' + str(nowIndex))
	
	return "nextSong successfully"

# clear songIndex
@app.route('/deleteAllSongList', methods=['GET'])
def deleteAllSongList():
	db.youtubeSongIndex.find_one_and_update({"sequence_value": {"$exists": True}}, {"$set": {"sequence_value": -1}})
	db.youtubeSongList.remove({})
	requests.get('http://192.168.50.210:5000/deleteAllSong')
	return "download successfully" 

# Control download List
@app.route('/downloadYoutubeSongList/<string:website>', methods=['GET'])
def downloadYoutubeSongList(website):
	
	songIndex = nextYoutubeSongIndex("productid")
	requests.get('http://192.168.50.210:5000/downloadYoutubeDL/' + website + '/' + str(songIndex))
	return "download successfully" 

# remove Youtube Song List in the database
@app.route('/deleteYoutubeSongList/<int:index>', methods=['GET'])
def deleteYoutubeSongList(index):
	resultFind = db.youtubeSongList.find({"index": index})
	resultData = json.loads(json_util.dumps(resultFind))

	requests.get('http://192.168.50.210:5000/deleteYoutubeDLList/' + str(resultData[0]['index']) + '/'+ resultData[0]['songName'])
	db.youtubeSongList.remove({})	
	return "delete successfully"

# insert new song into DB
@app.route('/checkYoutubeSongList', methods=['GET'])
def checkYoutubeSongList():
	result = db.youtubeSongIndex.find({'sequence_value': {'$exists': True}})
	result = json.loads(json_util.dumps(result))

	result = requests.get("http://192.168.50.210:5000/checkYoutubeDLList")
	# print(result.json()[0]['index'])
	# exit()
	db.youtubeSongList.remove({})	
	if result.json() != []:
		db.youtubeSongList.insert(result.json())

	result = db.youtubeSongList.find({'index': {'$exists': True}})
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# Phone Series

# return All phone state
@app.route('/checkAllPhoneState', methods=['GET'])
def checkAllPhoneState():
	result = db.phoneTotalState.find()
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# change phone state
@app.route('/changeAllPhoneState/<string:name>/<int:isRead>', methods=['GET'])
def changeAllPhoneState(name, isRead):
	value = True
	if isRead == 0:
		value = False
	elif isRead == 1:
		value = True

	result = db.phoneTotalState.find_one_and_update({name: {"$exists": True}}, {"$set": {name: value}})
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# Room1 Player got password -> door opened
@app.route('/getFirstRoomPassword', methods=['GET'])
def getFirstRoomPassword():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "PhoneAndroidIcon",
	    'message': "(第一間房間) 手機密碼鎖 開了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.password.update({"name": "password"}, {"$set": {"isOpen": True}}, True)
	# Open first door (45)
	requests.get("http://192.168.50.225:8888/openDoor/45/1")

	# turn Camera to second room
	time.sleep(2)
	requests.get("http://192.168.50.225:8888/setFirstRoomCamera/3")

	return "password get successfully"

# Room2 Player scan account book to activate writing camera
@app.route('/getAccountBookChecked', methods=['GET'])
def getAccountBookChecked():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "PhoneAndroidIcon",
	    'message': "(第二間房間) 玩家掃描到錯誤帳本了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	# start to run writing camera py
	os.system('python3 /home/micro/mushding-app/mnist/run_mnist.py --x1 1166 --y1 353 --len1 137 --x2 1139 --y2 701 --len2 130 &')

	# update mnist is running
	db.secondRoomWritingCamera.find_one_and_update(
		{'isRunning': {"$exists": True}}, 
		{"$set": {'isRunning': True}},
	)
	return "checked successfully"

# Player need help
@app.route('/getPlayerHelp', methods=['GET'])
def getPlayerHelp():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "NotificationImportantIcon",
	    'message': "玩家求救！！！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})

	# player help change to true
	result = db.phoneTotalState.find_one_and_update({'playerHelp': {"$exists": True}}, {"$set": {'playerHelp': True}})
	return "player get help successfully"

# Return Help DB
@app.route('/checkPlayerHelp', methods=['GET'])
def checkPlayerHelp():
	result = db.phoneTotalState.find({'playerHelp': {"$exists": True}})
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# Player don't need help
@app.route('/clearPlayerHelp', methods=['GET'])
def clearPlayerHelp():
	result = db.phoneTotalState.find_one_and_update({'playerHelp': {"$exists": True}}, {"$set": {'playerHelp': False}})
	return "clear player help successfully"

# Get Player press Likes number
@app.route('/getLikes', methods=['GET'])
def getLikes():
	result = db.phoneLikesNum.find({'likes': {"$exists": True}})
	result = json.loads(json_util.dumps(result))
	return jsonify(result)

# Add Likes 1
@app.route('/addLikes', methods=['GET'])
def addLikes():
	result = db.phoneLikesNum.find_one_and_update({'likes': {"$exists": True}}, {"$inc": {'likes': 1}})
	return "adding likes successfully"


# Check DashBoard Process for react

@app.route('/checkRoom1', methods=['GET'])
def checkRoom1():
	data={}
	firstRoomPower_json = db.firstRoomPower.find({'isOpen': {'$exists': True}})
	firstRoomPower_json = json.loads(json_util.dumps(firstRoomPower_json))
	data["firstRoomPower"]=firstRoomPower_json[0]["isOpen"]

	RFID_json = db.RFID.find({"name": "RFID"})
	RFID_json = json.loads(json_util.dumps(RFID_json))
	data["RFID"]=RFID_json[0]["isOpen"]

	pw_json = db.password.find({"name": "password"})
	pw_json = json.loads(json_util.dumps(pw_json))
	data["password"]=pw_json[0]["isOpen"]

	return data

@app.route('/checkB', methods=['GET'])
def checkB():
	data={}
	coffin_json = db.secondRoomCoffin.find({'isOpen': {'$exists': True}})
	coffin_json = json.loads(json_util.dumps(coffin_json))
	data["coffin"]=coffin_json[0]["isOpen"]

	drawer_json = db.drawer.find({"ip": "41"})
	drawer_json = json.loads(json_util.dumps(drawer_json))
	data["drawer"]=drawer_json[0]["variables"]["lock"]

	
	phone_json = db.phoneTotalState.find()
	phone_json = json.loads(json_util.dumps(phone_json))
	data["diary"]=phone_json[1]["videoDiaryB"]

	return data

@app.route('/checkC', methods=['GET'])
def checkC():
	data={}

	phone_json = db.phoneTotalState.find()
	phone_json = json.loads(json_util.dumps(phone_json))
	data["photo"]=phone_json[0]["documentPictureC"]

	phone_json = db.phoneTotalState.find()
	phone_json = json.loads(json_util.dumps(phone_json))
	data["poano"]=phone_json[1]["videoPianoSheetC"]

	calculator_json = db.calculator.find()
	calculator_json = json.loads(json_util.dumps(calculator_json))
	data["calculator"]=calculator_json[0]["isAnswer"]

	drawer_json = db.drawer.find({"ip": "42"})
	drawer_json = json.loads(json_util.dumps(drawer_json))
	data["drawer"]=drawer_json[0]["variables"]["lock"]

	return data

@app.route('/checkD', methods=['GET'])
def checkD():
	data={}

	phone_json = db.phoneTotalState.find()
	phone_json = json.loads(json_util.dumps(phone_json))
	data["photo"]=phone_json[1]["videoSisterPictureD"]

	phone_json = db.phoneTotalState.find()
	phone_json = json.loads(json_util.dumps(phone_json))
	data["moneyBook"]=phone_json[0]["documentInterviewD"]

	write_json = db.secondRoomWritingCamera.find()
	write_json = json.loads(json_util.dumps(write_json))
	data["write"]=write_json[0]["isCorrect"]

	drawer_json = db.drawer.find({"ip": "40"})
	drawer_json = json.loads(json_util.dumps(drawer_json))
	data["drawer"]=drawer_json[0]["variables"]["lock"]

	return data

@app.route('/checkRoom2', methods=['GET'])
def checkRoom2():
	data={}

	wireBox_json = db.secondRoomWireBox.find({'isOpen': {'$exists': True}})
	wireBox_json = json.loads(json_util.dumps(wireBox_json))
	data["wireBox"]=wireBox_json[0]["isOpen"]
	# door2
	door_json = db.door.find({"ip": "46"})
	door_json = json.loads(json_util.dumps(door_json))
	data["door2_lock"]=door_json[0]["variables"]["lock"]

	return data

@app.route('/checkRoom3', methods=['GET'])
def checkRoom3():
	data={}
	return data
@app.route('/checkVideo')

def checkVideo():
	data={}
	dirpath=os.getcwd()
	dirpath=os.path.join(dirpath,"pythonHTTP","storevideo")
	data["outputA"]=os.path.isfile(os.path.join(dirpath,"outputA.avi"))
	data["outputB"]=os.path.isfile(os.path.join(dirpath,"outputB.avi"))
	data["outputC"]=os.path.isfile(os.path.join(dirpath,"outputC.avi"))
	data["outputD"]=os.path.isfile(os.path.join(dirpath,"outputD.avi"))
	data["frame_person_A"]=os.path.isfile(os.path.join(dirpath,"frame_person_A.avi"))
	data["frame_person_B"]=os.path.isfile(os.path.join(dirpath,"frame_person_B.avi"))
	data["frame_person_C"]=os.path.isfile(os.path.join(dirpath,"frame_person_C.avi"))
	data["frame_person_D"]=os.path.isfile(os.path.join(dirpath,"frame_person_D.avi"))

	time_json = db.savingTime.find()
	time_json = json.loads(json_util.dumps(time_json))
	data["time"]=time_json[0]

	state_json = db.videoState.find({"name": "videoState"})
	state_json = json.loads(json_util.dumps(state_json))
	data["state"]=state_json[0]

	if(data["state"]["A_done"] and data["state"]["B_done"] and data["state"]["C_done"] and data["state"]["D_done"]):
		db.videoState.update({"name": "videoState"}, {"$set": {"end": True}}, True)
	
	return data

@app.route('/checkStoreVideo/<string:name>/<int:pid>', methods=['GET'])
def checkStoreVideo(name, pid):
	now =datetime.now()
	db.savingTime.remove({})
	db.savingTime.insert({
		"min": now.minute,
		"sec": now.second,
	})
	os.chdir("/home/micro/mushding-app/pythonHTTP/storevideo")
	if name == "frame_person_A.avi":
		os.system('kill -9 ' + str(pid))
		db.videoState.update({"name": "videoState"}, {"$set": {"A_done": True}}, True)
		m=os.system("./videoB.sh &")
	if name == "frame_person_B.avi":
		os.system('kill -9 ' + str(pid))
		db.videoState.update({"name": "videoState"}, {"$set": {"B_done": True}}, True)
		m=os.system("./videoC.sh &")
	if name == "frame_person_C.avi":
		os.system('kill -9 ' + str(pid))
		db.videoState.update({"name": "videoState"}, {"$set": {"C_done": True}}, True)
		m=os.system("./videoD.sh &")
	if name == "frame_person_D.avi":
		os.system('kill -9 ' + str(pid))
		# start merge video
		os.system('python3 ./merge_video.py &')
		db.videoState.update({"name": "videoState"}, {"$set": {"D_done": True}}, True)
	if m==0:
		return "開始儲存"
	else:
		return "儲存失敗"
	return 

# react button control
@app.route('/StoreVideo/<string:name>', methods=['GET'])
def StoreVideo(name):
	now =datetime.now()
	db.savingTime.remove({})
	db.savingTime.insert({
		"min": now.minute,
		"sec": now.second,
	})
	os.chdir("/home/micro/mushding-app/pythonHTTP/storevideo")
	key=""
	if name == "frame_person_A":
		# key="A_done"
		db.videoState.update({"name": "videoState"}, {"$set": {"start": True}}, True)
		os.system("./videoA.sh")
	if name == "frame_person_B":
		# key="B_done"
		os.system("./videoB.sh")
	if name == "frame_person_C":
		# key="C_done"
		os.system("./videoC.sh")
	if name == "frame_person_D":
		# key="D_done"/
		os.system("./videoC.sh")
	# db.videoState.update({"name": "videoState"}, {"$set": {key: True}}, True)
	return name

@app.route('/ResetStoreVideo', methods=['GET'])
def ResetStoreVideo():
	db.videoState.update(
		{"name": "videoState"},
		{"$set": {
			"A_done": False,
			"B_done": False,
			"C_done": False,
			"D_done": False,
			"start": False,
			"end": False,
		}}, True
	)
	return "ok"

app.run(debug=True, host="192.168.50.225", port=8888, threaded=True) 

