# How It Works

In this section you will find hands on tasks.

Each task will include a 'tag' that you can create a new branch from in order to work on your task.

For example, if a task requires that you use tag `v0.0.1` then you must create your development branch from that tag as follows:

```bash
git checkout -b <New Branch Name> v0.0.1
```

Each Varcade Games tag represent a `version` of the overall project. 

We need to do this because the main branch of Varcade Games will be continually evolving, but we want to have a consistent `snapshot` of the project to ensure that everyone who is doing the tasks is working against the same code. 

This saves us having to update the tasks listed here as the codebase evolves.

**Note:** You can work on all tasks with the same `tag` in the same branch.

So, for example - all `v0.0.1` tasks will require the `v0.0.1` tag. So you can create one branch as follows:

```
git checkout -b development v0.0.1
``` 

Now the `development` branch will be your main branch and you can work on all `v0.0.1` tasks in this branch.

## Experience Level

Each task will have an associated `experience level`. This will give you an idea of how challenging the task will be, depending on how much experience you have working with Varcade Games. 

The levels are:

* Junior
* Mid
* Senior
* Principle

`Junior` tasks tend to be small tweaks and bug fixes that are applied to isolated parts of the projects. For example changing some UI, or adding some additional logging to one of the server projects.

`Mid` tasks are for people that have a good working knowledge of all of the various projects within Varcade Games. These may involve updating multiple projects, for example adding a new field to the website database, updating an API to include this new field and finally updating the UI to display this new field to the user.

`Senior` tasks will usually include some sort of architectural considerations. For example, adding an entirely new feature to Varcade Games. This work will need deep thought and consideration about the far reaching consequences of the changes you are making.

`Principle` tasks are the most technical advanced tasks. These may include profiling and optimization work and will require deeper understanding of the underlying concepts and design of the various libraries and applications used to build Varcade Games.

Needless to say, you should complete all of the tasks at each level before proceeding to the next level.

!!! info
	These levels mirror the titles you may expect to find in engineering organizations, and I have tried to set the content of the tasks according to what may be expected of engineers at each level.