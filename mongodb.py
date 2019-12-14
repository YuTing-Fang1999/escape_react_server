from pymongo import MongoClient
import json

# connect to mongodb server
client = MongoClient(host='localhost', port=27017)
# asign database
db = client.website

drawerState = [								# room 2 drawer database
	{
	    "connected": True,
	    "error": True,						# adding for server
	    "ip": "40",							# adding for server
	    "hardware": "esp8266",
	    "id": "10",
	    "name": "Lock_table_1",
	    "variables": {
	      "lock": 0,
	      "pos": 80,
	      "pos_off": 160,
	      "pos_on": 80
	    }
	},
	{
	    "connected": True,
	    "error": True,						# adding for server
	    "ip": "41",							# adding for server
	    "hardware": "esp8266",
	    "id": "11",
	    "name": "Lock_table_2",
	    "variables": {
	      "lock": 0,
	      "pos": 55,
	      "pos_off": 150,
	      "pos_on": 55
	    }
	},
	{
	    "connected": True,
	    "error": True,						# adding for server
	    "ip": "42",							# adding for server
	    "hardware": "esp8266",
	    "id": "12",
	    "name": "Lock_table_3",
	    "variables": {
	      "lock": 0,
	      "pos": 60,
	      "pos_off": 150,
	      "pos_on": 60
	    }
	}
]

doorState = [								# room 2 door database
	{
	    "variables": {
	        "lock": 1,
	        "pos": 60,
	        "pos_on": 60,
	        "pos_off": 140
	    },
	    "id": "20",
	    "name": "Lock_door_1",
	    "hardware": "esp8266",
	    "error": True,						# adding for server
	    "ip": "45",							# adding for server
	    "connected": True,
	},
	{
	    "variables": {
	        "lock": 1,
	        "pos": 60,
	        "pos_on": 60,
	        "pos_off": 140
	    },
	    "id": "21",
	    "name": "Lock_door_2",
	    "hardware": "esp8266",
	    "error": True,						# adding for server
	    "ip": "46",							# adding for server
	    "connected": True,
	},
	{
	    "variables": {
	        "lock": 1,
	        "pos": 60,
	        "pos_on": 60,
	        "pos_off": 140
	    },
	    "id": "22",
	    "name": "Lock_door_3",
	    "hardware": "esp8266",
	    "error": True,						# adding for server
	    "ip": "47",							# adding for server
	    "connected": True,
	},
]

usbVideoState = {							# room 2 USBVideo database
	"usb_1": 0,
	"usb_2": 0,
	"usb_3": 0,
	"usb_loop": 0,
	"isPlaying": "stop",
	"error": True,							# adding for server
}

calculatorState = {							# room 2 calculator database
	'note_array': "",
	'isAnswer': False,
	"error": True,							# adding for server
}

timeCounter = {
	"countdown_num": "60",
    "countdown_run": "0",
    "countdown_sec": "60",
    "error": True,							# adding for server
}

firstRoomPower = {
	"isOpen": 0,
	"error": True,
}

secondRoomWritingCamera = {
	"date": -1,
	"month": -1,
	"isCorrect": False,
	"isRunning": False,
	"error": True,
}

secondRoomWireBox = {
	"isOpen": 0,
	"error": True,
}

secondRoomCoffin = {
	"isOpen": False,
	"error": True,
}

notifications = [
	{
		"_id": "productid",
		"sequence_value": 0,
	}
]

screenState = [
	{
		"ip": "213",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "214",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "215",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "216",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "217",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "218",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "219",
		"isPlaying": "stop",
		"isConnect": False,
	},
	{
		"ip": "220",
		"isPlaying": "stop",
		"isConnect": False,
	},
]

# time of saving vedio
savingTime={
	"min": 0,
	"sec": 0,
}
# vedio state
videoState={
	"name": "videoState",
	"start": False,
	"end": False,
	"A_done": False,
	"B_done": False,
	"C_done": False,
	"D_done": False,
}

#RFID
RFID={
	"name": "RFID",
	"isOpen": False,
}

password={
	"name": "password",
	"isOpen": False,
}

nineBlock={
	"name": "nineBlock",
	"isConnect": False,
	"pushBtn": False,
	"correct": False,
}

# <=========================================>

menuListState = {							# website menuList state
	'open': True,	
}

youtubeSongIndex = {
	"_id": "productid",
	"sequence_value": -1,
	"playNowIndex": 0,
	"isContinue": False,
	"isStopState": 0,
	"nowProgress": 0,
}

youtubeSongList = [
	{
	}
]

# <=========================================>

phoneLikesNum = {
	'likes': 0,
}

phoneTotalState = [
	{
		'documentInterviewB': False,
		'documentInterviewC': False,
		'documentInterviewD': False,
		'documentPictureC': False,
	},
	{
		'videoDiaryB': False,
		'videoPianoSheetC': False,
		'videoSisterPictureD': False,
	},
	{
		'tipRecord': False,
		'tipAccountBook': False,
		'tipFlashLight': False,
		'tipNineBlock': False,
	},
	{
		'playerHelp': False,
	}
]

collection = db.drawer
result = collection.remove({})
result = collection.insert_many(drawerState)

collection = db.door
result = collection.remove({})
result = collection.insert_many(doorState)

collection = db.usbVideo
result = collection.remove({})
result = collection.insert(usbVideoState)

collection = db.calculator
result = collection.remove({})
result = collection.insert(calculatorState)

collection = db.timeCounter
result = collection.remove({})
result = collection.insert(timeCounter)

collection = db.notifications
result = collection.remove({})
result = collection.insert(notifications)

collection = db.firstRoomPower
result = collection.remove({})
result = collection.insert(firstRoomPower)

collection = db.secondRoomWritingCamera
result = collection.remove({})
result = collection.insert(secondRoomWritingCamera)

collection = db.secondRoomWireBox
result = collection.remove({})
result = collection.insert(secondRoomWireBox)

collection = db.secondRoomCoffin
result = collection.remove({})
result = collection.insert(secondRoomCoffin)

collection = db.screenState
result = collection.remove({})
result = collection.insert(screenState)

# <=========================================>

collection = db.menuList
result = collection.remove({})
result = collection.insert(menuListState)

collection = db.youtubeSongIndex
result = collection.remove({})
result = collection.insert(youtubeSongIndex)

collection = db.youtubeSongList
result = collection.remove({})
result = collection.insert(youtubeSongList)

# <=========================================>

collection = db.phoneTotalState
result = collection.remove({})
result = collection.insert(phoneTotalState)

collection = db.phoneLikesNum
result = collection.remove({})
result = collection.insert(phoneLikesNum)

# <=========================================>

# time of saving vedio
collection = db.savingTime
result = collection.remove({})
result = collection.insert(savingTime)

# vedio state
collection = db.videoState
result = collection.remove({})
result = collection.insert(videoState)

collection = db.RFID
result = collection.remove({})
result = collection.insert(RFID)

collection = db.password
result = collection.remove({})
result = collection.insert(password)

collection = db.nineBlock
result = collection.remove({})
result = collection.insert(nineBlock)