# Introduction

Varcade Games is `pluggable`.

This means we can dynamically add games via the web application's admin panel.

This section will cover the behind the scenes for this functionality.

The server side of Varcade Games is built using [Django](https://www.djangoproject.com/).

From the Django homepage:

>Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It’s free and open source.

Or more succinctly:

>The web framework for perfectionists with deadlines.

This project leverages the built in Django admin system as well as some Javascript to dynamically add and remove games to and from the system - no code changes or deployments required!

First lets take a look at the admin panel...