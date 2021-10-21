##############################################
#
#   Issue Management + Release Notes Generation
#   (Automatic Bug Triage and Assignment by Topic Modelling)
#   Draft only
#
#	Author:		Alex Poon
#	Date:		  Sep 30, 2021
#	Last update:   Oct 19, 2021
#
##############################################

from glob import glob
from os.path import dirname, basename
from collections import Counter

from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import guess_lexer, find_lexer_class_for_filename

import pygraphviz

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
from json import dumps, loads
from pprint import pprint
from re import sub


app = Flask(__name__)
CORS(app)

nlp = spacy.load('basic_triage_small2')

myclient = MongoClient("mongodb://localhost:27017/") 
db = myclient["project"]

lblScheme = {
	'class:software': ('DC3545', 'software bug report (Action: Assign issue to developer team.)', 'danger'),
	'class:performance': ('FFC107', 'performance issues (e.g. memory, I/O. Action: Assign it to tester team to feedback to dev team)', 'warning'),
	'class:documentation': ('198754', 'documentation errors (e.g. broken links, not clear, typos. Action: Assign it to documentation team)', 'success'),
	'class:support': ('0D6EFD', 'question/technical support (e.g. how to ~, cannot install. Action: Direct the users to support team)', 'primary'),
	'class:feature-request': ('0DCAF0', 'feature requests (save for later, when there is time capacity and resources)', 'info'),
	'class:invalid': ('F8F9FA', 'invalid/spam (Action: the issue should be closed immediately)', 'light'),
}

roleScheme = {
	'developer': ('Developer Team', 'danger'),
	'documentation': ('Documentation Team', 'success'),
	'tester': ('Tester Team', 'warning'),
	'support': ('Support Team', 'primary')	
}



'''
https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
'''
@app.route('/', methods = ['GET'])
def index():
	return redirect('login')

@app.route('/login', methods = ['GET'])
def login():
	'''
	ImmutableMultiDict([('error', 'access_denied'), ('error_description', 'The user has denied your application access.'), ('error_uri', 'https://docs.github.com/apps/managing-oauth-apps/troubleshooting-authorization-request-errors/#access-denied')])
	ImmutableMultiDict([('code', 'c9427c0daabef591bec8')])
	'''
	print(request.method)
	print(request.json)
	print(request.args)

	if 'code' not in request.args:
		query = {
			'client_id': '34ed33a5c053d0c8e014',
			'redirect_uri': 'https://dord.mynetgear.com:5351/login',
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

def getUserInfo():
	# Get auth'd user's name and avatar
	url = 'https://api.github.com/user'

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

	url = f"https://api.github.com/repos/{owner}/{reponame}/issues?state=all&per_page=100"

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

	for issue in issues:
		print('Hi')
		print(issue['labels'])
		issueIsNew = len(issue['labels']) == 0
		if issueIsNew:
			cleanedString = f'{issue["title"]} {issue["body"][:30]}'

			out = nlp(cleanedString)
			print(out.cats)

			# Add issue listing
			maxConfidence = max(out.cats.values())
			maxCat = max(out.cats, key=out.cats.get)
			print(maxCat)

			if maxConfidence > 0.5:
				########################################
				#  Request 1: Give issue the tag
				issue['bootstrapClass'] = lblScheme[maxCat][2];

				url = f"https://api.github.com/repos/{owner}/{reponame}/issues/{issue['number']}/labels"

				# body = {
				# 	'name': maxCat,			#  may add emoji
				# 	'color': lblScheme[maxCat][0],
				# 	'description': lblScheme[maxCat][1]
				# }
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

				if maxCat not in ('class:support', 'class:invalid'):
					########################################
					print('Request 2: Assign the issue')

					collection = db['roles']

					teamMembers = [x for x in collection.find({'role': maxCat.replace('class:', '')})]

					if len(teamMembers) == 0:
						assignee = None
					else:
						from random import choice
						assignee = choice(teamMembers)

					url = f"https://api.github.com/repos/{owner}/{reponame}/issues/{issue['number']}/assignees"

					body = {'assignees': ['DerWahrheitssucher']}
					data = dumps(body).encode('utf-8')

					req = Request(url, data=data)

					for h in headers:
						req.add_header(h, headers[h])

					try:
						res = urlopen(req)
					except Exception as e:
						print(e.read())
					print(res.read())

					########################################
					print('At last, update the database')

					collection = db['issues']
					mylist = [ 
						{
						 'owner': owner,
						 'reponame': reponame,
						 'githubIssueID': issue['id'],
						 'from': '',				# TODO
						 'to': '',					# TODO
						 'assignee': None,#assignee['collaborator'],
						 'status': 'normal'
						}
					] 
					collection.insert_many(mylist)
	return render_template('repo.html', segment='index', 
		avatar=userInfo['avatar_url'], usrname=userInfo['login'], name=userInfo['name'],
		open_issues=None, open_issue_repos=None, repoowner=owner, reponame=reponame,
		contributors = contributors, contributorRoles = contributorRoles)


@app.route('/assign_team/<string:owner>/<string:repo>/<string:collaborator>/<string:role>', methods = ['GET'])
def assignTeam(owner, reponame, collaborator, role):
	collection = db['roles']
	mylist = [ 
		{'owner': owner, 'reponame': reponame, 'collaborator': collaborator, 'role': role}
	] 
	collection.insert_many(mylist)

	return redirect(f'/repo/{owner}/{reponame}')



@app.route('/resolved/<string:owner>/<string:repo>/<string:issue_number>', methods = ['GET'])
def resolved(owner, repo, issue_number):
	url = f'https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments'

	body = {'body': 'The issue has been resolved in # and will be closed. If you have further enquiries, please open a new issue and link to this issue. Thank you!'}
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
	url = f'https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}'

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

	'''
	collection = db['backlogs']
	mylist = [ 
		{'owner': owner, 'reponame': reponame, 'githubIssueID': issue_number, 'log': 'Delay reason'}
	] 
	collection.insert_many(mylist)
	'''

	return redirect(f'/repo/{owner}/{reponame}')


'''
Get source code: https://docs.github.com/en/rest/reference/git#get-a-tree
'''
@app.route('/generateClassUml/<string:owner>/<string:reponame>', methods = ['GET'])
def generateClassUml(owner, reponame):
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
		A.add_node(ent,shape='box',label=f'{ent}\n_____________\n_____________\n\n') #color='goldenrod2', style='filled',


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


'''
Remove Default Label System by GitHub
'''
def deleteLabelSystem(owner, reponame):
	tok = request.cookies.get('access_token')
	headers = {
		'Accept': '*/*',
		'Content-Type': 'application/json',
		'Authorization': f"token {tok}"
	}

	# cnt = 0

	for lbl in ['bug','documentation','duplicate','enhancement','good first issue','help wanted','invalid','question']: #*lblScheme.keys()]:
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
	app.run(host='0.0.0.0', port=5351, ssl_context=('_internal/cert.pem', '_internal/privkey.pem'))
