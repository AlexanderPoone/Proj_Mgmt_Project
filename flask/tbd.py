from pprint import pprint
import pandas as pd

with open('testset.csv', 'r', encoding='utf-8') as f:
	lines = [x.strip() for x in f.readlines()]

data = {}
cnt = 0
for z in [x.split('; ') for x in lines][1:]:
	data[cnt] = {'title': z[0], 'body': z[1], 'ground_truth': z[2]}#'len': len(z[1])}
	cnt += 1

df = pd.DataFrame.from_dict(data, orient='index')
df.to_csv('test_set.csv')
print(df)