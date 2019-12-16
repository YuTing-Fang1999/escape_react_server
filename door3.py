@app.route('/checkWarningLight', methods=['GET'])
def checkWarningLight():
	try:
		warningLight = requests.get('http://192.168.50.63')
	except requests.exceptions.RequestException as e:
		db.warningLight.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isConnect": False}})
	else:
		db.warningLight.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isConnect": True}})
	finally:
		warningLight_json = db.warningLight.find({'isOpen': {'$exists': True}})
		warningLight_json = json.loads(json_util.dumps(warningLight_json))
		return jsonify(warningLight_json)

# reset RFID (60)
@app.route('/resetWarningLight/<int:isOpen>', methods=['GET'])
def resetWarningLight(isOpen):
	if isOpen==0:
		db.warningLight.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": False}})
		requests.get('http://192.168.50.63/set_reset?params=' + str(isOpen))
	if isOpen==1:
		db.warningLight.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": True}})
		requests.get('http://192.168.50.63/set_rese?params=' + str(isOpen))
	return "0k"

# Get RFID (60) for progress
@app.route('/getWarningLight', methods=['GET'])
def getWarningLight():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_3",
	    'message': "(第三間房間) WarningLight 打開了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.warningLight.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": True}})	

	return "warningLight successfully"

   @app.route('/checkGear', methods=['GET'])
def checkGear():
	try:
		gear = requests.get('http://192.168.50.63')
	except requests.exceptions.RequestException as e:
		db.gear.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isConnect": False}})
	else:
		db.gear.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isConnect": True}})
	finally:
		gear_json = db.gear.find({'isOpen': {'$exists': True}})
		gear_json = json.loads(json_util.dumps(gear_json))
		return jsonify(gear_json)

# reset RFID (60)
@app.route('/resetGear/<int:isOpen>', methods=['GET'])
def resetGear(isOpen):
	if isOpen==0:
		db.gear.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": False}})
		requests.get('http://192.168.50.63/set_reset?params=' + str(isOpen))
	if isOpen==1:
		db.gear.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": True}})
		requests.get('http://192.168.50.63/set_rese?params=' + str(isOpen))
	return "0k"

# Get RFID (60) for progress
@app.route('/getGear', methods=['GET'])
def getGear():
	db.notifications.insert({
	    '_id': nextNotifications("productid"),
	    'avatarIcon': "BuildIcon_3",
	    'message': "(第三間房間) Gear 打開了！ ",
	    'time': time.strftime("%H:%M:%S", time.localtime()),
	})
	db.gear.find_one_and_update({"isOpen": {"$exists": True}}, {"$set": {"isOpen": True}})	

	return "gear successfully"
