There is one final thing we need to cover before you are ready to work on Varcade Games. Instrumentation.

>Instrumentation is a collective term for measuring instruments that are used for indicating, measuring and recording physical quantities.

When running a live product you're going to want to be sure that your live product is in fact live.

Servers can crash, or worse - have bugs that start corrupting all of your data. 

They will also behave very differently with one user than 1,000 concurrent users.

You don't want to have to sit around all day and night manually monitoring your servers to make sure they are operating as expected.

We need to put in place some automated monitoring systems so that we can forget about our servers until something goes wrong.

## Prometheus & Grafana

[![Grafana logo](img/grafana_logo.png)](img/grafana_logo.png)

We will be using two open source products in order to monitor and alert on our backend services.

Straight from the Grafana docs:

> Grafana is a complete observability stack that allows you to monitor and analyze mertrics, logs and traces. It allows you to query, visualize, alert on and understand your data no matter where it is stored.

> Prometheus is an open source systems monitoring system for which Grafana provides out-of-the-box support. This topic walks you through the steps to create a series of dashboards in Grafana to display system metrics for a server monitored by Prometheus.

In light of the above, what we will do is use `Prometheus` to **monitor** our servers. It will gather a bunch of interesting metrics about our running servers, like how long does a request take or how many requests are we getting.

We will then use Grafana to display that data in a nice dashboard that we can use to monitor system performance and stability. 

As always, I recommend you check out the official docs for both [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/) to get a sense of what they're about.

## k6

Another thing we will need to do is generate traffic for our system.

It's all well and good testing our backend manually by ourselves, but a single person using and distributed system is a very different thing to 1,000 people using that system.

We will use k6 to generate load and then monitor our system using Grafana to help understand if our system has any bottlenecks, how well it performs under load and when it breaks.

***

We've got a bit of setup to do first, so lets get started.
