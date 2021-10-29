# CS5351 Project - Issue Management & Visualisation
**Group 2**

# Objective
In this project, we are writing a web application using the GitHub REST API. The app includes Scrum-style visualisation (burndown chart) and improved issues management.

# Description (by Janice)
## Purpose of Burndown Chart
* Predict completion time -> Avoid missing the deadline 
* Visulization of progress to the whole team
* Display the remaining work across time
 
## Litmitations

* Burndown chart doesn’t show any changes (+/-) (e.g.) Chart may be flatten due to completed work = new work
	- Does not show the impact of scope changes
 
* Cannot show the dependency work (Bottleneck) / any blocked issues (Long WIP) 
	- Reducing WIP : Get more stories done with fewer defects found in proudction 
 
* Cannot show the imbalance work (productiviy imbalance) 
	- Can make use of this point if assigning issue to developer is one of our functions 
	- Solution: Burndown chart by developer 
 
## Solution
 
* Burn up chart
	- inclusion of the scope line 
	- tracks when work has been added to or removed from the project 

* Phil Goodwin and Russ Rufer’s Modified Burn Down Chart
	- Alternative way to show the extra work 
	- New Velocity prediction 
 
* Adding WIP line for chain issue? (Bottleneck)
 
## Terminologies

* Velocity: total effort estimates associated with user stories that were completed during an iteration 
* Scope creep: Uncontrolled growth in a project’s scope

## Issue Classification (by Alex)
Most time of the software cycle is spent on maintenance instead of planning, designing, implementation etc.

The informality of Modern Code Review has it upsides and downsides. One of the challenges is to keep MCR manageable for a large project. 'Issues' is a vague term that actually encompasses many things. Not all reports are bona fide. Thus, having too many issue reports is a severe distraction for large projects.

There are many ways to classify issues. **We override GitHub's default labelling system with our own:**

 1. software bug report (Action: Assign issue to developer team.)
 2. documentation errors (e.g. broken links, not clear, typos. Action: Assign issue to documentation team.)
 3. performance issues (e.g. slow, huge memory consumption. Action: Assign issue to tester team to feedback to developer team.)
 4. question/technical support (e.g. how to ..., cannot install. Action: Direct the users to user manual or the ops team.)
 5. feature requests (save for later, when there is time capacity and resources)
 6. invalid/spam (Action: the issue should be closed immediately)

We do supervised learning to classify these issues **using the `spacy` library's `en_core_web_sm` pipeline (includes the corpus, tagger, lemmatizer and a CNN model)**. As in multi-class classification, the output **confidence percentage** that the issue belonging to categories, not the category itself. The issue is tagged only if confidence percentage is high, above 50%.

With such classifications, it is also easier to find duplicate issues. If the we continue to improve the application, pull requests can also be classified in such way (except "question/technical support").

## Reference
* [https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.698.9879&rep=rep1&type=pdf](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.698.9879&rep=rep1&type=pdf) 
* [https://resources.scrumalliance.org/Article/trouble-sprint-burndowns](https://resources.scrumalliance.org/Article/trouble-sprint-burndowns) 
* [https://businessanalyst.techcanvass.com/burn-down-and-burn-up-charts/](https://businessanalyst.techcanvass.com/burn-down-and-burn-up-charts/) 
* [https://www.infoq.com/articles/burndown-analysis/](https://www.infoq.com/articles/burndown-analysis/)
* [https://www.mountaingoatsoftware.com/agile/scrum/scrum-tools/release-burndown/alternative](https://www.mountaingoatsoftware.com/agile/scrum/scrum-tools/release-burndown/alternative)

# Implementation
We are using the **Flask** framework, since many functions can be added by directly calling Python, including NLP (for classification of issues) and complex visualisation like class diagrams.

## Flow
![image](https://user-images.githubusercontent.com/9071916/137674320-6294ccd5-51dc-46df-b276-46dc15244f1c.png)

## Schema design
We keep the following data:

Collection `roles`
| owner | reponame | collaborator | role |
|-----|-----|-----|-----|
| str | str | str | 'developer'\|'documentation'\|'support' |

Collection `issues`
| owner | reponame | githubIssueID | from | to | assignee | status |
|-----|-----|-----|-----|-----|-----|-----|
| str | str | int | date | date | str | 'normal'\|'delayed' |

Collection `backlogs`
| owner | reponame | githubIssueID | log |
|-----|-----|-----|-----|
| str | str | int | str |
