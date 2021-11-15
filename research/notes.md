# Research

## Issue Management Automation

Instead of planning, designing and implementation, most time of the software cycle is spent on maintenance. Estimates show that this laborious process takes up 67% [1] to 90% [2][3] of the total software development cost. The informality of Modern Code Review has its upsides and downsides. One of the challenges is to keep MCR manageable for a large project.

![image](https://user-images.githubusercontent.com/9071916/141829909-6cdc8301-1081-4602-8670-54f495a69f0c.png) [1]

‘Issues' is a vague term that actually encompasses many things. Not all reports are bona fide. There are many ways to classify issues. Here we present one way:

1. software bug report (Action: Assign issue to developer team.)
2. documentation errors (e.g., broken links, not clear, typos. Action: Assign issue to documentation team.)
3. performance issues (e.g., slow, huge memory consumption. Action: Assign issue to tester team to feedback to developer team.)
4. question/technical support (e.g., how to ..., cannot install. Action: Direct the users to user manual or the ops team.)
5. feature requests (save for later, when there is time capacity and resources)
6. invalid/spam (Action: the issue should be closed immediately)

We do supervised learning to classify these issues. The output confidence percentage that the issue belonging to categories, not the category itself. Tag only if confidence percentage is high!

With such classifications, it is also easier to find duplicate issues. Pull requests can also be classified in such way (except #4).

(The `tensorflow` GitHub repo seems to agree with these six categories, they use ['type:bug', 'type:docs-bug', 'type:performance', 'type:support', 'type:feature', 'invalid']) We also need to make a URL list of public GitHub repositories with these issue labels, and use them for training.

#### Automated issue filtering
GitHub issues, by default, are free-form and unstructured. Therefore, it is probable that there are unconstructive issues like questions (should read the user manual instead of posting on GitHub), spam, or even gibberish. On some occasions, the team is too occupied to care about feature requests.

Sometimes, even if it is a bug report, it provides little useful information. For example, the version with the bug or log messages are not provided. How some GitHub projects tackle the issue is to limit the format of bug reports (GitHub has no restriction, but there is a GitHub feature to give users a bug template [4]. This feature is used by big repositories like TensorFlow and Fastlane alongside bug triage.)

Yet, the reporters may not follow the rules (they may delete / alter part of the template) or be familiar with the tag system as there are too many. Also, the workload of team members is not considered. GitHub does not keep track of the percentage of work allocated to individuals.

On top of this, most issue reports are for social interactions only, which constitutes a source of distraction.

#### Automated bug triage
<p align="center">
  <img src="https://user-images.githubusercontent.com/9071916/141791696-7c0b38ce-0a33-485b-8036-b494194948ab.png" alt="How to clear out the clutter in Modern Code Review?"/>
	<br><em>How to <strong>clear out the clutter</strong> in Modern Code Review?</em>
</p>

Triaging is the name given for confirming, prioritizing, and organizing issue reports. It is an emerging topic. Methods using text classification [5][6], graph theory methods [7], and clustering [8] have been proposed.

Microsoft uses its own issue triage syetem extensively in its open-source projects, notably Visual Studio Code [9]. It involves a GitHub bot named *vscode-triage-bot* which isolates the issue type, software version, operating system version, and hardware info from the issue report. In the documentation, the company visualizes its intricate triage policy by state graphs.

* We did a simplified, generic version:
	* Assumption: 1 GitHub account per task.
	* Automated half of the job:
		1. remove invalid
		2. classification
		3. respond to reporter
		4. suggest assignee with the lowest workload (balance workload)
* Method used:
	* 'Small' English CNN (convolutional neural network) model from the **spacy** Python library. This 'small' network is chosen because of its speed. Its English corpus is based upon *WordNet 3.0* by Princeton University, its named entity recogniser is taken from *OntoNotes 5*, while its sentence recognizer is formulated on *ClearNLP* by Emery University. [10]

But you may say, code and images from the issue report will go into NLP, which will affect the result!

Actually, it won't. Method: Markdown -----markdown Python library-----> HTML ------> extract text only.

In a large repository, there may be many issue reports with different severity. (Even typos in the documentation are considered issues!) We want to fix the most serious bugs first, and schedule non-critical bugs for later. "Triage" means that in a traffic accident scene, the first aid workers must determine among the injured, whose situation is more emergent. GitHub provides the feature of adding custom tags, in addition to the default tags like "invalid/This doesn't seem right"; "bug/Something isn't working"; "documentation/Improvements or additions to documentation"; "duplicate/This issue or pull request already exists"; "enhancement/New feature or request"; "question/Further information is requested"; "wontfix/This will not be worked on", etc. I suggest that, in a scale from 1 to 10, add tags "severity:<level>" and so on to rate the seriousness of the bug once the issue has been confirmed as valid.
	
Reference: https://github.com/oncletom/nodebook/issues?q=is%3Aopen+is%3Aissue
	
##### Case study
There is an application called *Issue-Label Bot* on GitHub Marketplace. It automatically labels issues as a feature request, bug or question, using text classification. According to the page, is used by software like Weights & Bias, Apache Superset, and Kubeflow. [11]

TensorFlow is a large project on GitHub. At the time of writing, it has more than 2,700 open issues and 30,600 closed issues.
There is a bot called `tensorflowbutler` responsible for issue triage. (https://github.com/tensorflowbutler: "I'm a bot that helps maintain the TensorFlow issues." Notice the word "triageservice" on the page)

According to the development team of TensorFlow:
> For internal changes, we also do our best to make sure each check-in appears as a single git commit and includes the author's GitHub account and a comment explaining the change. We have a special `tensorflow-gardener` account on GitHub that is scripted to manage this process, and you can see what an internal commit looks like once it's been migrated to GitHub here. [12]

#### Automated issue assignment
Automatically assign the person-in-charge (assume there are more than one developer is responsible for one bug category, keep track of workload. Workload can be seen as the number of issues already assigned to a particular person (optionally, other repos are counted too), which can be obtained from GitHub API)


#### Task list
Users (issue reporters) love fast feedback. Therefore, the task list is implemented using AJAX. Efficiently, the team can click 'create task/invalid issue/resolve task/delay task' without refreshing.

# Citations
- [1] Software Maintenance Overview. TutorialsPoint. (n.d.). Retrieved November 15, 2021, from https://www.tutorialspoint.com/software_engineering/software_maintenance_overview.htm.
- [2] Dehaghani, S. M. H., & Hajrahimi, N. (2013, March). Which factors affect software projects maintenance cost more? Acta informatica medica : AIM : journal of the Society for Medical Informatics of Bosnia & Herzegovina : casopis Drustva za medicinsku informatiku BiH. Retrieved November 15, 2021, from https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3610582/.
- [3] Koskinen, J. (n.d.). Software Maintenance Costs - unican.es. University of Eastern Finland. Retrieved November 15, 2021, from https://ocw.unican.es/pluginfile.php/1408/course/section/1805/SMCOSTS.pdf. 
- [4] Configuring issue templates for your repository. GitHub Docs. (n.d.). Retrieved November 15, 2021, from https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository.
- [5] Čubranić, D., & Murphy, G. C. (n.d.). Automatic Bug Triage Using Text Categorization. University of British Columbia. Retrieved November 15, 2021, from https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.91.6144&rep=rep1&type=pdf. 
- [6] Xuan, J., Jiang, H., Ren, Z., Yan, J., & Luo, Z. (2017, April 16). Automatic Bug Triage Using Semi-supervised Text Classification. arXiv.org. Retrieved November 15, 2021, from https://arxiv.org/abs/1704.04769.
- [7] I. Alazzam, A. Aleroud, Z. Al Latifah and G. Karabatis, "Automatic Bug Triage in Software Systems Using Graph Neighborhood Relations for Feature Augmentation," in IEEE Transactions on Computational Social Systems, vol. 7, no. 5, pp. 1288-1303, Oct. 2020, doi: 10.1109/TCSS.2020.3017501.
- [8] Alenezi, M. (n.d.). Efficient Bug Triaging Using Text Mining. North Dakota State University. Retrieved November 15, 2021, from https://malenezi.github.io/malenezi/pdfs/BugTriaging.pdf.
- [9] Imms, D. (2021). Issues Triaging · Microsoft/vscode wiki. GitHub. Retrieved November 15, 2021, from https://github.com/microsoft/vscode/wiki/Issues-Triaging.
- [10] English · spaCy Models Documentation - en_core_web_sm. (2021). Retrieved November 15, 2021, from https://spacy.io/models/en#en_core_web_sm. 
- [11] Issue-Label BOT - GitHub Marketplace. GitHub. (n.d.). Retrieved November 15, 2021, from https://github.com/marketplace/issue-label-bot. 
- [12] Warden, P. (2017, May 4). How the TensorFlow Team Handles Open Source Support. O'Reilly Media. Retrieved November 15, 2021, from https://www.oreilly.com/content/how-the-tensorflow-team-handles-open-source-support/.
