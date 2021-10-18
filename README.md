# CS5351 Project - Scrum Visualisation & Issue Management
**Group 2**

# Objective
In this project, we are writing a web application using the GitHub REST API. The app includes Scrum-style visualisation (burndown chart) and improved issues management.

# Description (by Janice)
## Purpose of Burndown Chart
	- Predict completion time -> Avoid missing the deadline 
	- Visulization of progress to the whole team
  
Display the remaining work across time
 
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
 
## Reference
* [https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.698.9879&rep=rep1&type=pdf](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.698.9879&rep=rep1&type=pdf) 
* [https://resources.scrumalliance.org/Article/trouble-sprint-burndowns](https://resources.scrumalliance.org/Article/trouble-sprint-burndowns) 
* [https://businessanalyst.techcanvass.com/burn-down-and-burn-up-charts/](https://businessanalyst.techcanvass.com/burn-down-and-burn-up-charts/) 
* [https://www.infoq.com/articles/burndown-analysis/](https://www.infoq.com/articles/burndown-analysis/)
* [https://www.mountaingoatsoftware.com/agile/scrum/scrum-tools/release-burndown/alternative](https://www.mountaingoatsoftware.com/agile/scrum/scrum-tools/release-burndown/alternative)

# Implementation
We are using the **Flask** framework, since many functions can be added by directly calling Python.

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
