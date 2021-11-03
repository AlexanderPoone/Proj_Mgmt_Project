##############################################
#
#   IMPORTANT: Scroll to the bottom of the code file. Replace the line with app.run(host='0.0.0.0', port=5351) if you don't have a SSH Certificate !!!
#
#   Issue Management & Visualisation
#
#   Author:		 Alex Poon
#   Create Date:	Sep 30, 2021
#   Last update:	Oct 29, 2021
#
##############################################

from glob import glob
from os.path import dirname, basename
from collections import Counter

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import guess_lexer, find_lexer_class_for_filename

from pymongo import MongoClient

from re import findall, DOTALL

# HTTP libraries
from flask import Flask, jsonify, make_response, request, send_from_directory, abort, redirect, render_template, render_template_string
from flask_cors import CORS

from urllib.parse import urlencode, quote
from urllib.request import urlopen, Request

# NLP libraries
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
# from gensim import corpora, models, similarities, downloader
from gensim.corpora.dictionary import Dictionary
from gensim.models.ldamodel import LdaModel
from gensim.parsing.preprocessing import preprocess_documents
from gensim.test.utils import common_texts
from wordcloud import WordCloud

# Standard library
from base64 import b64encode, b64decode
from datetime import datetime, timedelta
from json import dumps, loads
from pprint import pprint
from random import choice
from re import sub


app = Flask(__name__)
CORS(app)

nlp = spacy.load('basic_triage_small5')

myclient = MongoClient("mongodb://localhost:27017/") 
db = myclient["project"]

# label name: (color HEX, description, bootstrap color scheme)
lblScheme = {
	'class:software': ('DC3545', 'software bug report (Action: Assign issue to developer team.)', 'danger'),
	'class:performance': ('FFC107', 'performance issues (e.g. memory, I/O. Action: Assign it to tester team to feedback to dev team)', 'warning'),
	'class:documentation': ('198754', 'documentation errors (e.g. broken links, not clear, typos. Action: Assign it to documentation team)', 'success'),
	'class:support': ('0D6EFD', 'question/technical support (e.g. how to ~, cannot install. Action: Direct the users to support team)', 'primary'),
	'class:feature-request': ('0DCAF0', 'feature requests (save for later, when there is time capacity and resources)', 'info'),
	'class:invalid': ('F8F9FA', 'invalid/spam (Action: the issue should be closed immediately)', 'light'),
}


# team id: (team description, bootstrap color schem)
roleScheme = {
	'developer': ('Developer Team', 'danger'),
	'documentation': ('Documentation Team', 'success'),
	'tester': ('Tester Team', 'warning'),
	'support': ('Support Team', 'primary')	
}

# Force connection to be HTTPS
@app.before_request
def before_request():
	if request.url.startswith('http://'):
		url = request.url.replace('http://', 'https://', 1)
		code = 301  
		print(url)

		return redirect(url, code=code)


# Redirect to login
@app.route('/', methods = ['GET'])
def index():
	return redirect('login')

# Log in
@app.route('/login', methods = ['GET'])
def login():
	print(request.method)
	print(request.json)
	print(request.args)

	if 'code' not in request.args:
		query = {
			'client_id': '34ed33a5c053d0c8e014',
			'allow_signup': False
		}
		return redirect(f'https://github.com/login/oauth/authorize?{urlencode(query)}&scope=repo')
	else:
		url = 'https://github.com/login/oauth/access_token'

		headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}

		body = {'client_id': '34ed33a5c053d0c8e014',
		 'client_secret': '446a323da8084af5dc13db5beed18bb85b778da2',
		 'code': request.args['code']
		 }	

		data = dumps(body).encode('utf-8')
		print(data)

		req = Request(url, data=data)
		for h in headers:
			req.add_header(h, headers[h])

		try:
			res = urlopen(req)
			# print(res.info())
		except Exception as e:
			print(e.read())

		# Set cookies
		cookieContent = loads(res.read())
		response = make_response(redirect('/dashboard'))
		response.set_cookie('access_token', cookieContent['access_token'])
		return response

# Get auth'd user's name and avatar
def getUserInfo(username=None):
	url = 'https://api.github.com/user' if username is None else f'https://api.github.com/users/{username}'

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson = loads(res.read())

	return resJson

# Get contributors' names and avatars
def getContributors(owner, reponame):
	url = f'https://api.github.com/repos/{owner}/{reponame}/contributors'
	print(url)

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson = loads(res.read())

	contributorRoles = []
	collection = db['roles']
	for x in resJson:
		collaborator = [x for x in collection.find({'collaborator': x['login']})]
		if len(collaborator) == 0:
			collection.insert({'owner': owner, 'reponame': reponame, 'collaborator': x['login'], 'role': 'developer'})
			contributorRoles.append(['developer', *roleScheme['developer']])
		else:
			contributorRoles.append([collaborator[0]['role'], *roleScheme[collaborator[0]['role']]])

	print(resJson)

	return resJson, contributorRoles

# Main page
@app.route('/dashboard', methods = ['GET'])
def dashboard():
	userInfo = getUserInfo()
	###########################

	# Get all repos and stuff them into the template
	url = 'https://api.github.com/user/repos?sort=pushed&per_page=100'

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson2 = loads(res.read())

	for cnt in range(len(resJson2)):
		if resJson2[cnt]['language'] is not None:
			resJson2[cnt]['language'] = resJson2[cnt]['language'].replace('++','plusplus').replace('#','sharp').replace('HTML','html5').split(' ')[0]

	pprint(resJson2)
	open_issues = sum([x['open_issues'] for x in resJson2])
	open_issue_repos = sum([1 for x in resJson2 if x != 0])

	wordcloud = topicModelling()

	return render_template('index.html', segment='index', 
		avatar=userInfo['avatar_url'], usrname=userInfo['login'], name=userInfo['name'],
		open_issues=open_issues, open_issue_repos=open_issue_repos, repolist=resJson2, wordcloud=wordcloud)


# Unused
@app.route('/repocode/<string:owner>/<string:reponame>', methods = ['GET'])
def repoDetail(owner, reponame):
	###########################
	# Get logged in user's info

	userInfo = getUserInfo()
	###########################
	# Get collaborators usernames, names and avatars

	contributors, contributorRoles = getContributors(owner, reponame)
	###########################
	# Get source code

	# issues_to_topic(owner, reponame)

	url = f'https://api.github.com/repos/SoftFeta/tempusespatium/contents/app/src/main/java/hk/edu/cuhk/cse/tempusespatium/Round1Activity.java'
	codeFileName = basename(url)

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson2 = loads(res.read())

	code = b64decode(resJson2['content'].encode('utf-8')).decode('utf-8')
	print(code)

	lexer = find_lexer_class_for_filename(url) #guess_lexer(code)
	print(lexer)
	parsedHtml = highlight(code, lexer(), HtmlFormatter(linenos='table'))
	print(parsedHtml)

	return render_template('repo.html', segment='index', 
		avatar=userInfo['avatar_url'], usrname=userInfo['login'], name=userInfo['name'],
		open_issues=None, open_issue_repos=None, repoowner=owner, reponame=reponame, codeFileName=codeFileName,
		parsed = parsedHtml, contributors = contributors, contributorRoles = contributorRoles)


# Get chart data from local mongodb
@app.route('/test/generateBurnDownChart', methods = ['GET'])
def generateBurnDownChart():
	collection = db['tasks']
	totalTasks =  collection.aggregate([
		{"$group": {
			 "_id":  { "$concat": [
			{"$substr": [{"$year": "$enddate"}, 0, 4 ]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$month": "$enddate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$month": "$enddate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$month": "$enddate" }, 0, 2 ] }
			]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$dayOfMonth": "$enddate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$dayOfMonth": "$enddate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$dayOfMonth": "$enddate" }, 0, 2 ] }
			]}
			]},
			 "count": {"$sum": 1},
		}},
		{"$sort": { "_id": 1 }}
	   ])

	burntTasks = collection.aggregate([
		{"$match": {"status": "resolved"}},
		{"$group": {
			 "_id":  { "$concat": [
			{"$substr": [{"$year": "$enddate"}, 0, 4 ]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$month": "$enddate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$month": "$enddate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$month": "$enddate" }, 0, 2 ] }
			]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$dayOfMonth": "$enddate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$dayOfMonth": "$enddate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$dayOfMonth": "$enddate" }, 0, 2 ] }
			]}
			]},
			 "count": {"$sum": 1}
		}},
		{"$sort": { "_id": 1 }}
	   ])

	addedTasks = collection.aggregate([
		{"$group": {
			 "_id":  { "$concat": [
			{"$substr": [{"$year": "$startdate"}, 0, 4 ]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$month": "$startdate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$month": "$startdate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$month": "$startdate" }, 0, 2 ] }
			]},
			"-",
			{ "$cond": [
			{ "$lte": [ { "$dayOfMonth": "$startdate" }, 9 ] },
			{ "$concat": [
				"0", { "$substr": [ { "$dayOfMonth": "$startdate" }, 0, 2 ] }
			]},
			{ "$substr": [ { "$dayOfMonth": "$startdate" }, 0, 2 ] }
			]}
			]},
			 "count": {"$sum": 1}
		}},
		{"$sort": { "_id": 1 }}
	   ])

	totalTasks = [x for x in totalTasks]
	burntTasks = [x for x in burntTasks]
	addedTasks = [x for x in addedTasks]

	numTasksLeft = sum([x['count'] for x in totalTasks])
	numTasksExpected = sum([x['count'] for x in totalTasks])

	print(totalTasks)
	print(burntTasks)

	chartLeftEdge = datetime.strptime(addedTasks[0]['_id'], '%Y-%m-%d')
	chartRightEdge = datetime.strptime(totalTasks[-1]['_id'], '%Y-%m-%d')
	dayEntry = chartLeftEdge

	chartData = []

	delta = timedelta(days=1)
	while dayEntry <= chartRightEdge:
		dayEntryStr = dayEntry.strftime('%Y-%m-%d')
		numTasksLeft -= sum([x['count'] for x in burntTasks if x['_id'] == dayEntryStr])
		numTasksExpected -= sum([x['count'] for x in totalTasks if x['_id'] == dayEntryStr])
		numTaskAdded = sum([x['count'] for x in addedTasks if x['_id'] == dayEntryStr])

		chartData.push({
			'date': dayEntry,
			'numTasksLeft': numTasksLeft,
			'numTasksExpected': numTasksExpected,
			'numTaskAdded': numTaskAdded
		})

		#print(dayEntryStr, numTasksLeft, numTasksExpected, numTaskAdded)
		dayEntry += delta
	print(jsonify(chartData))


# REPO MAIN PAGE
@app.route('/repo/<string:owner>/<string:reponame>', methods = ['GET'])
def issuesView(owner, reponame):
	global nlp

	###########################
	# Get logged in user's info

	userInfo = getUserInfo()
	###########################
	# Get collaborators usernames, names and avatars

	contributors, contributorRoles = getContributors(owner, reponame)
	###########################
	initialiseLabelSystem(owner, reponame)

	# list all issues
	###########################

	url = f"https://api.github.com/repos/{owner}/{reponame}/issues?pulls=false&state=open&per_page=100"

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	for h in headers:
		req.add_header(h, headers[h])

	try:
		res = urlopen(req)
	except Exception as e:
		print(str(e))

	issues = loads(res.read())

	#########################################################
	databaseTasks = []

	for issue in issues:
		if 'pull_request' in issue:
			# Skip
			continue

		issueIsNew = len(issue['labels']) == 0

		if issueIsNew:
			if issue["body"] is None or len(issue["body"].strip()) < 20:
				url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue["number"]}/comments'

				if issue["body"] is None or len(issue["body"].strip()) == 0:
					reply = f"Please try again by filling in the issue message body. We cannot work on an issue unless details are provided. Closed."
				else:
					reply = f"The issue message body is too short (should be more than 20 characters). Please provide more details. We cannot work on an issue unless details are provided. Closed."
				body = {'body': reply}

				data = dumps(body).encode('utf-8')

				req = Request(url, data=data)

				for h in headers:
					req.add_header(h, headers[h])

				try:
					res = urlopen(req)
				except Exception as e:
					print(e.read())
				print(res.read())

				url = f"https://api.github.com/repos/{owner}/{reponame}/issues/{issue['number']}/labels"

				body = {
					'labels': ['class:invalid']
				}

				data = dumps(body).encode('utf-8')
				print(data)

				req = Request(url, data=data)
				for h in headers:
					req.add_header(h, headers[h])

				try:
					res = urlopen(req)
				except Exception as e:
					print(e.read())
				print(res.read())

				url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue["number"]}'

				body = {'state': 'closed'}
				data = dumps(body).encode('utf-8')

				req = Request(url, data=data, method='PATCH')

				tok = request.cookies.get('access_token')

				headers = {
					'Accept': '*/*',
					'Content-Type': 'application/json',
					'Authorization': f"token {tok}"
				}
				for h in headers:
					req.add_header(h, headers[h])

				res = urlopen(req)

				issue['labels'] = [{'name': 'class:invalid'}]

				continue
			cleanedString = f'{issue["title"]} {" ".join(issue["body"].split(" ")[:34])}'

			out = nlp(cleanedString)
			print(f'DEBUG: {cleanedString} {out.cats}')

			# Add issue listing
			maxConfidence = max(out.cats.values())
			maxCat = max(out.cats, key=out.cats.get)
			print(maxCat)

			if maxConfidence > 0.5:
				########################################
				#  Request 1: Give issue the tag
				issue['bootstrapClass'] = lblScheme[maxCat][2];

				url = f"https://api.github.com/repos/{owner}/{reponame}/issues/{issue['number']}/labels"

				body = {
					'labels': [maxCat]
				}

				data = dumps(body).encode('utf-8')
				print(data)

				req = Request(url, data=data)
				for h in headers:
					req.add_header(h, headers[h])

				try:
					res = urlopen(req)
				except Exception as e:
					print(e.read())
				print(res.read())

				issue['labels'] = [{'name': maxCat}]





				if maxCat not in ('class:feature-request', 'class:invalid'):
					########################################
					print('Request 2: Assign the issue')

					collection = db['roles']

					teamMembers = list(collection.find({'role': maxCat.replace('software','developer').replace('performance','tester').replace('class:', '')}))

					collectionTasks = db['tasks']
					if len(teamMembers) == 0:
						# If the team has 0 members (which should not happen actually)
						print('This should not be shown!')

						assignee = list(collection.find())[0]['collaborator']
					else:
						# Get the person w/ the least workload
						countTasksByPerson = {}

						for x in teamMembers:
							countTasksByPerson[x['collaborator']] = collectionTasks.count_documents({'assignee': x['collaborator']})
						
						assignee = min(countTasksByPerson, key=countTasksByPerson.get)

					url = f"https://api.github.com/repos/{owner}/{reponame}/issues/{issue['number']}/assignees"

					body = {'assignees': [assignee]}
					data = dumps(body).encode('utf-8')

					req = Request(url, data=data)

					for h in headers:
						req.add_header(h, headers[h])

					try:
						res = urlopen(req)
					except Exception as e:
						print(e.read())
					print(res.read())

					issue['assignee'] = getUserInfo(assignee)

					#######################################
					url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue["number"]}/comments'

					reply = f"Hello @{issue['user']['login']}, thanks for the issue report! Your report is being reviewed and our team member @{assignee} will follow up the case soon. We will notify you whenever progress is made. Thanks!\n\nThis is an automated message. Wrongly classified? [Click here](#)."
					body = {'body': reply}

					data = dumps(body).encode('utf-8')

					req = Request(url, data=data)

					for h in headers:
						req.add_header(h, headers[h])

					try:
						res = urlopen(req)
					except Exception as e:
						print(e.read())
					print(res.read())
				elif maxCat == 'class:feature-request':
					url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue["number"]}/comments'

					reply = f"Hi @{issue['user']['login']}, thank you for your idea! Due to the large amount of work, we may not be able to add new features at this stage. We will schedule time to review this after a few stable releases.\n\nThis is an automated message. Wrongly classified? [Click here](#)."
					body = {'body': reply}

					data = dumps(body).encode('utf-8')

					req = Request(url, data=data)

					for h in headers:
						req.add_header(h, headers[h])

					try:
						res = urlopen(req)
					except Exception as e:
						print(e.read())
					print(res.read())
		else:
			print('Already labelled: left join database here')
			collection = db['tasks']

			existingTask = list(collection.find({'githubIssueID': issue['number']}))
			if len(existingTask) > 0:
				issue['startdate'] = existingTask[0]['startdate']
				issue['enddate'] = existingTask[0]['enddate']
				issue['status'] =  existingTask[0]['status']

				databaseTasks.append({
					'id': issue['number'],
					'name': f'Task #{issue["number"]}',
					'lane': issue['assignee']['login'],
					'start': issue['startdate'].strftime('%Y-%m-%d'),	# JavaScript Date object
					'end': issue['enddate'].strftime('%Y-%m-%d'),	# JavaScript Date object
					'desc': issue['body']
				})
			#issue['startdate'] = '2021-10-01'
						
	#################################################
	# Get all PRs
	url = f'https://api.github.com/repos/{owner}/{reponame}/pulls?per_page=100'

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	for h in headers:
		req.add_header(h, headers[h])

	try:
		res = urlopen(req)
		pullRequests = loads(res.read())
	except Exception as e:
		print(str(e))
			
	#################################################
	# Render
	return render_template('repo.html', 
		tasks=[x for x in issues if 'class:feature-request' not in [y['name'] for y in x['labels']] and 'class:invalid' not in x['labels'] and 'pull_request' not in x],
		pullRequests=pullRequests,
		segment='index', 
		avatar=userInfo['avatar_url'], usrname=userInfo['login'], name=userInfo['name'],
		open_issues=None, open_issue_repos=None, repoowner=owner, reponame=reponame,
		contributors = contributors, contributorRoles = contributorRoles, databaseTasks=databaseTasks)

# Assign a collaborator to a team
@app.route('/assign_team/<string:owner>/<string:reponame>/<string:collaborator>/<string:role>', methods = ['GET'])
def assignTeam(owner, reponame, collaborator, role):
	collection = db['roles']

	collection.update_one({'owner': owner, 'reponame': reponame, 'collaborator': collaborator}, {'$set': {'role': role}})

	return redirect(f'/repo/{owner}/{reponame}')

# Convert GitHub Issue to Task (Put into database)
@app.route('/confirm/<string:owner>/<string:reponame>/<int:issue_number>/<string:assignee>/<int:numdays>', methods = ['GET'])
def confirm(owner, reponame, issue_number, assignee, numdays):
	print('confirm', owner, reponame, issue_number, assignee, numdays)

	collection = db['tasks']
	########################################	
	print('Confirmed -> update the database')
	# max_date = list(collection.find({}).sort([('to', -1)]).limit(1))[0]
	# print(max_date)
	# print('Parse the date... If nothing, set from date to tomorrow.')

	startdate = datetime.today()
	enddate = startdate + timedelta(days=numdays)

	newtask = {
		 'owner': owner,
		 'reponame': reponame,
		 'githubIssueID': issue_number,
		 'startdate': startdate,												
		 'enddate': enddate,
		 'assignee': assignee,
		 'status': 'normal'
		}

	print(newtask)
	collection.insert(newtask)

	return f'<strong>Task created sucessfully!</strong>&nbsp;&nbsp;<a href="https://github.com/{owner}/{reponame}/issues/{issue_number}" target="_blank">View issue on GitHub</a>'

# Dump the issue (for example: duplicates)
@app.route('/reject/<string:owner>/<string:reponame>/<int:issue_number>', methods = ['GET'])
def reject(owner, reponame, issue_number):
	print('reject', owner, reponame, issue_number)

	url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue_number}/comments'

	body = {'body': f'This issue has been reviewed and is marked as `invalid` because of the following reason:\n\nDuplicate\n\nThis issue is being closed.'}

	data = dumps(body).encode('utf-8')

	req = Request(url, data=data)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	
	##############################################
	# Close the issue
	url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue_number}'

	body = {'state': 'closed'}
	data = dumps(body).encode('utf-8')

	req = Request(url, data=data, method='PATCH')

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)

	return f'<strong>Issue closed and marked as invalid sucessfully!</strong>&nbsp;&nbsp;<a href="https://github.com/{owner}/{reponame}/issues/{issue_number}" target="_blank">View issue on GitHub</a>'

# Task finished: Select pull req. Feedback to user. Close issue.
@app.route('/resolve/<string:owner>/<string:reponame>/<int:issue_number>/<int:pull_request_number>', methods = ['GET'])
def resolve(owner, reponame, issue_number, pull_request_number):
	print('resolve', owner, reponame, issue_number, pull_request_number)

	url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue_number}/comments'

	body = {'body': f'Hello, a patch regarding this issue has been added in Pull Request #{pull_request_number}. Please check it out and feel free to comment on it.\n\nThe issue is considered resolved and is being closed. If you have further enquiries, please open a new issue and link to this issue. Thank you!'}

	data = dumps(body).encode('utf-8')

	req = Request(url, data=data)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	
	##############################################
	# Mark issue as 'resolved' in MongoDB
	collection = db['tasks']
	
	query = { "githubIssueID": issue_number }
	findres = list(collection.find(query))[0]

	enddate = findres['enddate']

	newvalues = { "$set": { "status": "resolved", "enddate": datetime.today() , "originalenddate": enddate } }

	collection.update_one(query, newvalues)

	##############################################
	# Close the issue
	url = f'https://api.github.com/repos/{owner}/{reponame}/issues/{issue_number}'

	body = {'state': 'closed'}
	data = dumps(body).encode('utf-8')

	req = Request(url, data=data, method='PATCH')

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)

	return f'<strong>Task resolved successfully!</strong>&nbsp;&nbsp;<a href="https://github.com/{owner}/{reponame}/issues/{issue_number}" target="_blank">View issue on GitHub</a>'


# Task delayed: create backlog, reassign time frame
@app.route('/delay/<string:owner>/<string:reponame>/<int:issue_number>/<int:delaydays>', methods = ['GET'])
def delay(owner, reponame, issue_number, delaydays):
	print('delay', owner, reponame, issue_number, delaydays)

	# TODO TODO TODO TODO TODO

	collection = db['tasks']

	query = { "githubIssueID": issue_number }

	findres = list(collection.find(query))[0]

	enddate = findres['enddate']
	newdate = enddate + timedelta(delaydays)

	if 'originalenddate' in findres:
		newvalues = { "$set": { "status": "delayed", "enddate": newdate, "originalenddate": enddate } }
	else:
		newvalues = { "$set": { "status": "delayed", "enddate": newdate } }

	collection.update_one(query, newvalues)

	# TODO TODO TODO TODO TODO

	return jsonify([f'<strong>Task marked as delayed!</strong>&nbsp;&nbsp;<a href="https://github.com/{owner}/{reponame}/issues/{issue_number}" target="_blank">View issue on GitHub</a>', f'{newdate.strftime("%Y-%m-%d")} <span style="color: red;">(DELAYED)</span>'])


# Generate UML Class Diagram (JUST FOR FUN)
@app.route('/generateClassUml/<string:owner>/<string:reponame>', methods = ['GET'])
def generateClassUml(owner, reponame):
	import pygraphviz

	userInfo = getUserInfo()
	###########################
	# Get collaborators usernames, names and avatars

	contributors, contributorRoles = getContributors(owner, reponame)
	###########################

	url = f'https://api.github.com/repos/SoftFeta/tempusespatium/contents/app/src/main/java/hk/edu/cuhk/cse/tempusespatium/Round1Activity.java'
	codeFileName = basename(url)

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson = loads(res.read())

	code = b64decode(resJson['content'].encode('utf-8')).decode('utf-8')
	print(code)

	lexer = find_lexer_class_for_filename(url) #guess_lexer(code)
	lexer = lexer()
	print(lexer)
	parsedHtml = highlight(code, lexer, HtmlFormatter(linenos='table'))
	print(parsedHtml)

	# Loop all tokens
	tokens = lexer.get_tokens(code)

	###########################
	tok = request.cookies.get('access_token')
	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	url2 = 'https://api.github.com/repos/SoftFeta/tempusespatium/git/trees/master?recursive=1'
	
	req = Request(url2)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson2 = loads(res.read())

	# Determine the root directory
	javaFiles = [x['path'] for x in resJson2['tree'] if x['path'].endswith('.java')]

	dirnameCounter = Counter([dirname(f) for f in javaFiles])

	root = dirnameCounter.most_common(1)[0][0]

	print('Namespace: ', root)

	includedFiles = [f for f in javaFiles if dirname(f) == root]
	
	entities = [basename(f).split('.')[0] for f in includedFiles]
	
	print('Files: ', entities)

	A = pygraphviz.AGraph(directed=True)
	for ent in entities:
		# Is there lemon chiffon?
		A.add_node(ent,shape='box',label=f'{ent}\n_____________\n_____________\n\n',color='black', fillcolor='lemonchiffon', style='filled')


	imports = set()
	currentClass = basename(url).split('.')[0]

	##############################################################
	lookarea = findall(r'\{.+?\{', code, flags=DOTALL)
	print(378, lookarea)
	if len(lookarea) > 0:
		lookarea = lookarea[0]
	else:
		lookarea = code

	# Members
	mem0 = [*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]	 # =>   - {memberName}: {memberType}
	mem0 = [f'- {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem0]
	mem1 = [*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]	  # =>   + {memberName}: {memberType}
	mem1 =[f'+ {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem1]
	mem2 = [*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea),
	*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea)],*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]]   # =>   # {memberName}: {memberType}
	mem2 =[f'# {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem2]
	mems = '\n'.join([*mem0, *mem1, *mem2])
	print(378, mems)

	# Methods
	met0 = [*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code), *findall(r'(?<=private static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)]	 # =>   - {methodName}: {methodType}
	met0 =set([f'- {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met0])
	met1 = [*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code), *findall(r'(?<=public static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)]	  # =>   + {methodName}: {methodType}
	met1 =set([f'+ {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met1])
	met2 = [*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code), *findall(r'(?<=protected static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code),
	*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)], *[lstrip(l.replace('static ', '')) for l in findall(r'^\s*static [A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)]]   # =>   # {methodName}: {methodType}
	met2 =set([f'# {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met2])
	mets = '\n'.join([*met0, *met1, *met2])
	print(378, mets)

	A.get_node(currentClass).attr['label'] = f'{currentClass}\n_____________\n{mems}\n_____________\n{mets}\n'
	##############################################################

	for t in tokens:
		if str(t[0]) == 'Token.Name' and t[1] in entities and t[1] != currentClass:

			print(367, t)
			imports.add(t[1])

	for i in imports:
		A.add_edge(currentClass, i, arrowhead="vee")


	#######################################################

	for ent in entities:
		if ent != currentClass:
			imports = set()

			url = f'https://api.github.com/repos/SoftFeta/tempusespatium/contents/app/src/main/java/hk/edu/cuhk/cse/tempusespatium/{ent}.java'

			req = Request(url)

			tok = request.cookies.get('access_token')

			headers = {
				'Accept': '*/*',
				'Content-Type': 'application/json',
				'Authorization': f"token {tok}"
			}
			for h in headers:
				req.add_header(h, headers[h])

			res = urlopen(req)
			resJson = loads(res.read())

			code = b64decode(resJson['content'].encode('utf-8')).decode('utf-8')
			print(code)

			#############################################

			# TODO: Remove everything that is not outer block

			# Lookarea
			lookarea = findall(r'\{.+?\{', code, flags=DOTALL)

			if len(lookarea) > 0:
				lookarea = lookarea[0]
			else:
				lookarea = code

			# Members
			mem0 = [*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]	 # =>   - {memberName}: {memberType}
			mem0 = [f'- {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem0]
			mem1 = [*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]	  # =>   + {memberName}: {memberType}
			mem1 =[f'+ {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem1]
			mem2 = [*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea),*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea),
			*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+(?=;)', lookarea)],*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+(?= \=)', lookarea)]]   # =>   # {memberName}: {memberType}
			mem2 =[f'# {m.split(" ")[1]}: {m.split(" ")[0]}' for m in mem2]
			mems = '\n'.join([*mem0, *mem1, *mem2])
			#print(mems)

			# Methods
			met0 = [*findall(r'(?<=private )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_, \t\r\n]+?\)', code), *findall(r'(?<=private static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_, \t\r\n]+?\)', code)]	 # =>   - {methodName}: {methodType}
			met0 =set([f'- {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met0])
			met1 = [*findall(r'(?<=public )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_, \t\r\n]+?\)', code), *findall(r'(?<=public static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_, \t\r\n]+?\)', code)]	  # =>   + {methodName}: {methodType}
			met1 =set([f'+ {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met1])
			met2 = [*findall(r'(?<=protected )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code), *findall(r'(?<=protected static )[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code),
			*[lstrip(l) for l in findall(r'^\s*[A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)], *[lstrip(l.replace('static ', '')) for l in findall(r'^\s*static [A-Za-z0-9_]+ [A-Za-z0-9_]+\([A-Za-z0-9_@, \t\r\n]+?\)', code)]]   # =>   # {methodName}: {methodType}			met2 =set([f'# {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met2])
			met2 =set([f'# {" ".join(m.split(" ")[1:])}: {m.split(" ")[0]}' for m in met2])
			mets = '\n'.join([*met0, *met1, *met2])
			#print(mets)

			A.get_node(ent).attr['label'] = f'{ent}\n_____________\n{mems}\n_____________\n{mets}\n'
			#############################################

			lexer = find_lexer_class_for_filename(url) #guess_lexer(code)
			lexer = lexer()

			# Loop all tokens
			tokens = lexer.get_tokens(code)

			youreInsideImplementBlock = False
			youreInsideExtendsBlock = False
			
			for t in tokens:
				print(t)
				if str(t[0]) == 'Token.Name' and t[1] in entities and t[1] != ent:
					if youreInsideImplementBlock:
						A.add_edge(ent, t[1], arrowhead="onormal", style="dashed")
						if not A.get_node(t[1]).attr['label'].startswith('<<'):
							A.get_node(t[1]).attr['label'] = f'<<interface>>\n{A.get_node(t[1]).attr["label"]}'
					elif youreInsideExtendsBlock:
						A.add_edge(ent, t[1], arrowhead="onormal")
					else:
						imports.add(t[1])
				if t[1] == 'implements':
					youreInsideImplementBlock = True
				elif t[1] == 'extends':
					youreInsideExtendsBlock = True
				elif t[1] == '{':
					youreInsideExtendsBlock = False
					youreInsideImplementBlock = False

			for i in imports:
				A.add_edge(ent, i, arrowhead="vee")
	#######################################################

	A.layout(prog="dot")		# ['neato'|'dot'|'twopi'|'circo'|'fdp'|'nop']
	graphString = f'<img style="width: 100%;" src="data:image/jpeg;base64,{b64encode(A.draw(None, "jpeg")).decode("utf-8")}">'

	return render_template('repo.html', segment='index', 
		avatar=userInfo['avatar_url'], usrname=userInfo['login'], name=userInfo['name'],
		open_issues=None, open_issue_repos=None, repoowner=owner, reponame=reponame, codeFileName=codeFileName,
		graph = graphString, parsed=parsedHtml, contributors = contributors, contributorRoles = contributorRoles)



# Remove Default Label System by GitHub
def deleteLabelSystem(owner, reponame):
	tok = request.cookies.get('access_token')
	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	# cnt = 0

	for lbl in ['bug','documentation','duplicate','enhancement','good first issue','help wanted','invalid','question','wontfix']: #*lblScheme.keys()]:
		url = f"https://api.github.com/repos/{owner}/{reponame}/labels/{quote(lbl)}"

		body = {}

		data = dumps(body).encode('utf-8')
		print(data)

		req = Request(url, data=data, method='DELETE')
		for h in headers:
			req.add_header(h, headers[h])

		try:
			res = urlopen(req)
		except Exception as e:
			print(e)

# Initialise Our Label System
def initialiseLabelSystem(owner, reponame):
	deleteLabelSystem(owner, reponame)

	tok = request.cookies.get('access_token')
	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	# cnt = 0

	for lbl in lblScheme:
		url = f"https://api.github.com/repos/{owner}/{reponame}/labels"

		body = {
			'name': lbl,
			'color': lblScheme[lbl][0],
			'description': lblScheme[lbl][1]
		}

		data = dumps(body).encode('utf-8')
		print(data)

		req = Request(url, data=data)
		for h in headers:
			req.add_header(h, headers[h])

		try:
			res = urlopen(req)
		except Exception as e:
			print(e.read())
		# cnt += 1


@app.route('/issuesToTopic/<string:owner>/<string:reponame>', methods = ['GET'])
def issuesToTopic(owner, reponame):
	initialiseLabelSystem(owner, reponame)
	return 'under construction'


'''
1. Topic model repos in Topics predefined on GitHub one by one.
2. Classify the repo the user has chosen to one of these Topics.
3. Add severity rating.

Possibly connect to a MongoDB database
Start button -> AJAX
Reference: https://ieeexplore.ieee.org/document/5298419
'''
def topicModelling(doNlp=False):
	repo = 'istio'

	url = f'https://api.github.com/repos/istio/{repo}/issues?per_page=100&state=all'

	req = Request(url)

	tok = request.cookies.get('access_token')

	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}
	for h in headers:
		req.add_header(h, headers[h])

	res = urlopen(req)
	resJson = loads(res.read())
	#pprint(resJson)

	# English only for the time being, TODO: detect language
	nlp = spacy.load("en_core_web_sm")#trf")

	# Remove code strings and code blocks from issue text body
	text = [sub(r'`.*?`','',sub(r'```.*?```', '', x['body'])) for x in resJson if isinstance(x['body'],str)]
	#pprint(text)
	docs = [[chunk.text.lower() for chunk in nlp(t).noun_chunks if chunk.text.lower().replace(' ','').isalpha() and (chunk.text.lower().replace(' ','') not in [*STOP_WORDS, repo]) and len(chunk.text.lower().replace(' ','')) >= 3] for t in text]

	# Generate word cloud for visualisation
	long_string = ','.join(docs[0])
	wordcloud = WordCloud(font_path='C:\\WINDOWS\\Fonts\\SCRIPTBL.TTF', background_color="white", max_words=5000, contour_width=3, contour_color='steelblue')
	wordcloud.generate(long_string)

	# Analyze syntax
	# print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
	if doNlp:
		print(docs)
		common_dictionary = Dictionary(docs[1:])
		# TODO: Try TF-ID
		common_corpus = [common_dictionary.doc2bow(t) for t in docs[1:]]

		# Train the model on the corpus
		lda = LdaModel(common_corpus, id2word=common_dictionary, num_topics=10)
		# pprint(lda.get_topics())
		pprint(lda.print_topics())

		lda.inference([common_dictionary.doc2bow(docs[0])])

	# print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

	# # Find named entities, phrases and concepts
	# for entity in doc.ents:
	#	 print(entity.text, entity.label_)
	'''
	# Stream a training corpus directly from S3.
	corpus = corpora.MmCorpus("s3://path/to/corpus")

	# Train Latent Semantic Indexing with 200D vectors.
	lsi = models.LsiModel(corpus, num_topics=20)

	# Convert another corpus to the LSI space and index it.
	index = similarities.MatrixSimilarity(lsi[another_corpus])

	# Compute similarity of a query vs indexed documents.
	sims = index[query]
	'''

	return wordcloud.to_svg(embed_font=True)

# Log out
@app.route('/logout', methods = ['GET'])
def logout():
	#	Delete an app authorization
	tok = request.cookies.get('access_token')
	print(tok)
	url = 'https://api.github.com/applications/34ed33a5c053d0c8e014/grant'

	# Must use Basic Authorization here
	headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': f"Basic {b64encode('34ed33a5c053d0c8e014:446a323da8084af5dc13db5beed18bb85b778da2'.encode('utf-8')).decode('utf-8')}"
	}

	body = {
		'access_token': tok
	}
	data = dumps(body).encode('utf-8')

	req = Request(url, data=data, method='DELETE')

	for h in headers:
		req.add_header(h, headers[h])

	try:
		res = urlopen(req)
	except Exception as e:
		print(e.read())
	print(res.read())

	return redirect('login')

if __name__ == "__main__":
	# Replace below with app.run(host='0.0.0.0', port=5351) if you don't have a SSH Certificate !!!
	app.run(host='0.0.0.0', port=5351, ssl_context=('_internal/cert.pem', '_internal/privkey.pem'))