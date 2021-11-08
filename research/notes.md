# PowerPoint Notes

## Introduction

Most time of the software cycle is spent on maintenance instead of planning, designing, implementation etc. The informality of Modern Code Review has it upsides and downsides. One of the challenges is to keep MCR manageable for a large project.'Issues' is a vague term that actually encompasses many things. Not all reports are bona fide. There are many ways to classify issues. Here we present one way:
1. software bug report (Action: Assign issue to developer team.)
2. documentation errors (e.g. broken links, not clear, typos. Action: Assign issue to documentation team.)
3. performance issues (e.g. slow, huge memory consumption. Action: Assign issue to tester team to feedback to developer team.)
4. question/technical support (e.g. how to ..., cannot install. Action: Direct the users to user manual or the ops team.)
5. feature requests (save for later, when there is time capacity and resources)
6. invalid/spam (Action: the issue should be closed immediately)

We do supervised learning to classify these issues. The output confidence percentage that the issue belonging to categories, not the category itself. Tag only if confidence percentage is high!With such classifications, it is also easier to find duplicate issues. Pull requests can also be classified in such way (except #4).

(The tensorflow GitHub repo seems to agree with this six categories, they use ['type:bug', 'type:docs-bug', 'type:performance', 'type:support', 'type:feature', 'invalid']) We also need to make a URL list of public GitHub repositories with these issue labels, and use them for training.

#### Automated issue filtering
GitHub issues, by default, are free-form and unstructured. Therefore, it is probable there there are unconstructive issues like questions (should read the user manual instead of posting on GitHub), spam, or even gibberish. In some occasions, the team is too occupied to care about feature requests.

Sometimes, even if it is a bug report, it provides little useful information. For example, the version with the bug or log messages are not provided. How some GitHub projects tackle the issue is to limit the format of bug reports (GitHub has no restriction, but there is a GitHub feature to give users a bug template: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

Yet, the reporters may not follow the rules (they may delete / alter part of the template), or be familiar with the tag system as there are too many. And the workload of team members is not taken into account.

On top of this, most issue reports are for social interactions only, which constitutes a source of distraction.

##### Case study

https://github.com/tensorflowbutler ("I'm a bot that helps maintain the TensorFlow issues." Notice the word "triageservice" on the page)
https://github.com/fastlane/fastlane/issues/18004

According to the development team of Tensorflow:
> For internal changes, we also do our best to make sure each check-in appears as a single git commit, and includes the author’s GitHub account and a comment explaining the change. We have a special “tensorflow-gardener” account on GitHub that is scripted to manage this process, and you can see what an internal commit looks like once it’s been migrated to GitHub here.
https://www.oreilly.com/content/how-the-tensorflow-team-handles-open-source-support/

#### Automated bug triage
Automated bug triage by adding a custom severity tag to the issue. In a large repository, there may be many issue reports with different severity. (Even typos in the documentation are considered issues!) We want to fix the most serious bugs first, and schedule non-critical bugs for later. "Triage" means that in a traffic accident scene, the first aid workers have to determine among the injured, whose situation is more emergent. GitHub provides the feature of adding custom tags, in addition to the default tags like "invalid/This doesn't seem right"; "bug/Something isn't working"; "documentation/Improvements or additions to documentation"; "duplicate/This issue or pull request already exists"; "enhancement/New feature or request"; "question/Further information is requested"; "wontfix/This will not be worked on", etc. I suggest that, in a scale from 1 to 10, add tags "severity:<level>" and so on to rate the seriousness of the bug once the issue has been confirmed as valid.
	
Reference: https://github.com/oncletom/nodebook/issues?q=is%3Aopen+is%3Aissue

#### Automated issue assignment
Automatically assign the person-in-charge (assume there are more than one developer is responsible for one bug category, keep track of workload. Workload can be seen as the number of issues already assigned to a particular person (optionally, other repos are counted too), which can be obtained from GitHub API)

Most time of the software life span is spent on maintenance, not design and implementation.

Triaging is the name given for confirming, prioritizing, and organizing issue reports.
* An emerging topic (Petri net flow by Microsoft: https://github.com/microsoft/vscode/wiki/Issues-Triaging)

> Automatic Bug Triage using Semi-Supervised Text Classificationhttps://arxiv.org › cs
由 J Xuan 著作 · 2017 · 被引用 144 次 — Computer Science > Software Engineering. arXiv:1704.04769 (cs). [Submitted on 16 Apr 2017]. Title:Automatic Bug Triage using Semi-Supervised Text ...

> Automatic bug triage using text categorization - CiteSeerXhttps://citeseerx.ist.psu.edu › viewdoc › download
	PDF
	由 GC Murphy 著作 · 被引用 505 次 — Automatic bug triage using text categorization. Davor ˇCubranic. Department of Computer Science. University of British Columbia. 201–2366 Main

> Automatic Bug Triage in Software Systems Using Graph ...https://ieeexplore.ieee.org › document· 翻譯這個網頁
	由 I Alazzam 著作 · 2020 · 被引用 6 次 — Abstract: Bug triaging is the process of prioritizing bugs based on their severity, frequency, and risk in order to be assigned to ...
	DOI： 10.1109/TCSS.2020.3017501

* We did a simplified, generic version:
	* Assumption: 1 GitHub account per task.
	* Automated half of the job:
		1. remove invalid
		2. classification
		3. respond to reporter
		4. suggest assignee with the lowest workload (balance workload)
* Method used:
	* Small English CNN model from spacy

But you may say, code and images from the issue report will go into NLP, which will affect the result!

Actually it won't. Method: Markdown -----markdown Python library-----> HTML ------> extract text only.

#### Task list
* Users (issue reporters) love fast feedback: AJAX - Click 'create task/invalid issue/resolve task/delay task' without refreshing



<!-- ## Class UML for Java (for fun, fully automated from GitHub code)
Written in Pygments + PyGraphViz

* Spot violation of "low coupling, high cohesion"
* Spot circular imports -->

The UML Class Diagram gives a high-level overview. Cannot distinguish whether the added file is a third-party dependency or written by user himself: needs to index the namespace for STEP ONE.
