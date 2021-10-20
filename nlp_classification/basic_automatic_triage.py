'''
# Basic Automatic Triage

Most time of the software cycle is spent on maintenance instead of planning, designing, implementation etc.

The informality of Modern Code Review has it upsides and downsides.
One of the challenges is to keep MCR manageable for a large project.
'Issues' is a vague term that actually encompasses many things. Not all reports are bona fide.
There are many ways to classify issues. Here we present one way:

 1. software bug report (Action: Assign issue to developer team.)
 2. documentation errors (e.g. broken links, not clear, typos. Action: Assign issue to documentation team.)
 3. performance issues (e.g. slow, huge memory consumption. Action: Assign issue to tester team to feedback to developer team.)
 4. question/technical support (e.g. how to ..., cannot install. Action: Direct the users to user manual or the ops team.)
 5. feature requests (save for later, when there is time capacity and resources)
 6. invalid/spam (Action: the issue should be closed immediately)

We do supervised learning to classify these issues.
The output confidence percentage that the issue belonging to categories, not the category itself.
Regressive.
The issue is tagged only if confidence percentage is high, above X% (TBA).

With such classifications, it is also easier to find duplicate issues.
Pull requests can also be classified in such way (except #4).

(Topic modelling -- topic: ___)

'''
from json import loads
from re import sub, DOTALL
import pandas as pd
from pprint import pprint
from urllib.request import urlopen, Request
from urllib.parse import quote

from bs4 import BeautifulSoup
from markdown import markdown

from sklearn.model_selection import StratifiedShuffleSplit
from spacy.lang.en.stop_words import STOP_WORDS
# Different GitHub repos define different tag systems
mapping = {
'numpy/numpy':
['00 - Bug',None,'04 - Documentation',None,'01 - Enhancement', None],
# ['type:bug', 'type:performance', 'type:docs-bug', 'type:support', 'type:feature', 'invalid'],
'kubernetes/minikube':
['kind/bug', None, 'kind/documentation', 'kind/support', None, None],
'pytorch/pytorch':
[None, 'module: performance', 'module: docs', None, 'feature', None],
'explosion/spaCy':
['bug', 'perf / speed', 'docs', None, 'proposal', None],
'Automattic/mongoose':
['confirmed-bug', 'performance',  'docs', None, 'new feature', None],
'fastlane/fastlane':	#'type:bug'
['type:breaking', 'topic: performance', 'type: documentation','type:question', 'type:feature', None],
'curl/curl':
[None, 'performance', 'documentation', None, 'feature-request', None],
'pyg-team/pytorch_geometric':
['bug', None,  'documentation','question', 'enhancement', None],
'gpuweb/gpuweb':
['bug', None, None, 'question', 'feature request', None],
'minio/minio':
['fixed', None, 'documentation', 'question', None, None],
'pugjs/pug':
['bug', 'performance', 'documentation', None, 'plugin-request', None],
'matplotlib/matplotlib':
['status: confirmed bug', 'Performance',  'Documentation','Community support', 'New feature', None],
}

# df = pd.DataFrame.from_dict(mapping, orient='index')
# pprint(df)

issueCats = ['class:software', 'class:performance', 'class:documentation', 'class:support', 'class:feature-request', 'class:invalid']

# Data collection using GitHub API
df2_src = {}
df2_cnt = 0

for repo in mapping:
	issueCatCnt = -1
	for lbl in mapping[repo]:
		issueCatCnt += 1

		if lbl is None:
			continue
		print('************************************************')
		print(repo, lbl)

		issues = ['']
		pageNum = 1
		while len(issues) != 0:
			headers = {
				'Accept': '*/*',
				'Content-Type': 'application/json',
				'Authorization': f"Basic U29mdEZldGE6Z2hwX2JOczFHSTZPWUZmb0ZoMXpqQlBHeFhVYnVxUVB2MTRjUFVVQg=="
			}

			url = f"https://api.github.com/repos/{repo}/issues?state=all&labels={quote(lbl)}&per_page=100&page={pageNum}"

			req = Request(url)
			for h in headers:
				req.add_header(h, headers[h])

			try:
				res = urlopen(req)
			except Exception as e:
				print(str(e))

			issues = loads(res.read().decode('utf-8'))

			# issues = [x['title']  for x in resp] #[x['body'] for x in resp]

			for issue in issues:
				# TODO: Remove all non-English words: https://stackoverflow.com/questions/59301446/i-want-to-remove-non-english-words-from-a-sentence-in-python-3-x
				if not isinstance(issue['body'], str): 
					continue
				# Remove all inline code and blocks of code
				issueTitle = sub(r'`.*?`', '',issue['title'], flags=DOTALL)
				issueTitle = sub(r'(\n|\r|\t|\"|\“|\”|\[|\]|\(|\)|\xa0|…|\*)', ' ', issueTitle)
				issueTitle = sub(r'[\.]{2,}', ' ', issueTitle)
				issueTitle = sub(r'-+\>', '', issueTitle)
				for x in STOP_WORDS:
					issueTitle = sub(f'(?<= ){x}(?= )', '', issueTitle)
				issueTitle = sub(r' ,', ',', issueTitle)
				issueTitle = sub(r' \.', '.', issueTitle)
				issueTitle = sub(r' \;', ';', issueTitle)
				issueTitle = sub(r' \?', '?', issueTitle)
				issueTitle = sub(r' \:', ':', issueTitle)
				issueTitle = sub(r'[‘’]', '\'', issueTitle)
				issueTitle = sub(r'@[0-9a-zA-z_]+', '', issueTitle)
				issueTitle = sub(r'C \+ \+', 'C++', issueTitle)
				issueTitle = sub(r'(?<= )(cc|CC)', '', issueTitle)
				issueTitle = sub(r'\`', '', issueTitle)
				issueTitle = sub(r'#[0-9]+', '', issueTitle)
				issueTitle = sub(r'[0-9a-zA-Z_.\/\-\\\:]{24,}', '', issueTitle)
				issueTitle = sub(r'  +', ' ', issueTitle).strip()

				issueBody = sub(r'`.*?`','',sub(r'```.*?```', '', issue['body'], flags=DOTALL), flags=DOTALL)

				# Convert Markdown to plain text
				issueBody = markdown(issueBody)
				try:
					issueBody = ' '.join([x.getText() for x in BeautifulSoup(issueBody, features="html.parser").findAll('p')])
				except Exception as e:
					print(e)
					continue

				# Get first 50 words of the body ("Head" the body)
				issueBody = sub(r'https?:\/\/[0-9a-zA-Z~%_\=\+\#\-\/\.\?\&\,\:]*', '', issueBody)
				issueBody = sub(r'(\n|\r|\t|\"|\“|\”|\[|\]|\(|\)|\xa0|…|\*\$)', ' ', issueBody)
				issueBody = sub(r'Is your feature request related to a problem\?', '', issueBody)
				issueBody = sub(r'Please describe\.', '', issueBody)
				issueBody = sub(r'Do you want to request a feature or report a bug\?', '', issueBody)
				issueBody = sub(r'What is the current behaviou?r\?', '', issueBody)
				issueBody = sub(r'What is the expected behaviou?r\?', '', issueBody)
				issueBody = sub(r'Original report at SourceForge, opened .*? 20[0-9]{2}', '', issueBody)
				issueBody = sub(r'[\.]{2,}', ' ', issueBody)
				issueBody = sub(r'-+\>', '', issueBody)
				for x in STOP_WORDS:
					issueBody = sub(f'(?<= ){x}(?= )', '', issueBody)
				issueBody = sub(r' ,', ',', issueBody)
				issueBody = sub(r' \.', '.', issueBody)
				issueBody = sub(r' \;', ';', issueBody)
				issueBody = sub(r' \?', '?', issueBody)
				issueBody = sub(r' \:', ':', issueBody)
				issueBody = sub(r'[‘’]', '\'', issueBody)
				issueBody = sub(r'@[0-9a-zA-z_]+', '', issueBody)
				issueBody = sub(r'C \+ \+', 'C++', issueBody)
				issueBody = sub(r'(?<= )(cc|CC)', '', issueBody)
				issueBody = sub(r'\`', '', issueBody)
				issueBody = sub(r'[0-9a-zA-Z_.\/\-\\\:]{24,}', '', issueBody)
				issueBody = sub(r'-{3,}', '', issueBody)
				issueBody = sub(r'={3,}', '', issueBody)
				issueBody = sub(r'#[0-9]+', '', issueBody)
				issueBody = sub(r'  +', ' ', issueBody)
				issueBody = ' '.join(issueBody.split(' ')[0:50]).strip()
				print(f'{issueTitle} | {issueBody}')
				print('************************')

				# TF-IDF
				df2_src[df2_cnt] = {'category': issueCatCnt, 'title': issueTitle, 'head': issueBody, 'sourceRepo': repo}
				df2_cnt += 1

			#pprint(df2_src[df2_cnt - 1])

			pageNum += 1

df2 = pd.DataFrame.from_dict(df2_src, orient='index')
df2.to_csv('triage2.csv')
df2.to_json('triage2.json')
pprint(df2)

# Data splitting
sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=0)
for train_index, test_index in sss.split(X, ys):
    X_train, X_test = X[train_index], X[test_index]
    y_train, y_test = ys[train_index], ys[test_index]

# If you are using the Scikit Learn API, there is a method called predict_proba() for several classification models like Logistic Regression, SVM, Random Forest, etc. If your classifier does not provide one, you can wrap it with the CalibratedClassifierCV which can be found in sklearn.calibration, then use the above method to calculate the distance from the decision boundary