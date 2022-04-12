In order to generate some traffic on our distributed system we're going to use a tool called [k6](https://k6.io/), which is an:

> Open source load testing tool and SaaS for engineering teams

It's a tool written in GoLang that allows us to write Javascript in order great load tests.

## Installing k6

To get set up with [k6](https://k6.io/) you should follow the [official documentation](https://k6.io/docs/getting-started/installation/) for your system.

!!! Important
    If you are using Windows you need to follow the Linux instructions using your Linux shell, since you will be running the load test from within your Linux environment.

## Running the test

In order to run the load test navigate to the `build_tools/load_generator` directory on your command line.

In that directory is a Javascript file that contains a script that will spawn 500 virtual users.

Those users will each register a new account and run the various requests a browser would run to load the website. It will also create new Rock Paper Scissors Apocalypse multi-player games and play the game.

To run the script enter the following command:

```bash
k6 run site_navigation.js
```

If you get an error you should verify that your installation of k6 and its dependencies were all successful.

If everything works you should see some output like this flash by on the screen:

```bash

          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: site_navigation.js
     output: -

  scenarios: (100.00%) 1 scenario, 500 max VUs, 15m30s max duration (incl. graceful stop):
           * default: 500 looping VUs for 15m0s (gracefulStop: 30s)

INFO[0000] Fetching VCG client, identifier: 1272         source=console
INFO[0000] Fetching VCG client, identifier: 1957         source=console
INFO[0000] Fetching VCG client, identifier: 8352         source=console
INFO[0000] Fetching VCG client, identifier: 4549         source=console
INFO[0000] Fetching VCG client, identifier: 4845         source=console
INFO[0000] Fetching VCG client, identifier: 2130         source=console
INFO[0000] Fetching VCG client, identifier: 4910         source=console
INFO[0000] Fetching VCG client, identifier: 7115         source=console

```

There are a couple of things worth noting here. 

k6 tells us that it is running `500 VUs`, which means `500 Virtual Users`.

It also says `15m30s max duration`, telling us that this test will run for 15 minutes.

That means our users will be load the website, creating games and playing games for 15 minutes straight.

This gives us an understand of how the whole system will handle load over a specific period of time.

If you want the end the text early you can just hit `ctrl+c`. Once the test has finished a summary will be displayed:


```bash
running (00m02.8s), 000/500 VUs, 0 complete and 500 interrupted iterations
default ✗ [--------------------------------------] 500 VUs  00m02.8s/15m0s
WARN[0003] No script iterations finished, consider making the test duration longer 

     █ landing and registration

       ✗ statusCode
        ↳  99% — ✓ 512 / ✗ 1

     █ homepage

       ✓ statusCode

     checks.........................: 99.80% ✓ 512   ✗ 1    
     data_received..................: 393 kB 138 kB/s
     data_sent......................: 160 kB 56 kB/s
     group_duration.................: avg=1.98s    min=1.21s   med=2.03s    max=2.72s    p(90)=2.56s    p(95)=2.64s   
     http_req_blocked...............: avg=8.57ms   min=57.68µs med=2.72ms   max=35.66ms  p(90)=31.5ms   p(95)=33.75ms 
     http_req_connecting............: avg=8.35ms   min=39.69µs med=2.62ms   max=35.63ms  p(90)=31.45ms  p(95)=33.57ms 
     http_req_duration..............: avg=175.8ms  min=33.35ms med=165.71ms max=1.62s    p(90)=217.07ms p(95)=224.57ms
       { expected_response:true }...: avg=174.06ms min=33.35ms med=165.57ms max=1.62s    p(90)=217.05ms p(95)=224.44ms
     http_req_failed................: 0.19%  ✓ 1     ✗ 512  
     http_req_receiving.............: avg=33.86µs  min=15.58µs med=29.85µs  max=119.25µs p(90)=52.29µs  p(95)=60.46µs 
     http_req_sending...............: avg=1.24ms   min=17.03µs med=213.58µs max=48.79ms  p(90)=2.12ms   p(95)=9.78ms  
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=174.52ms min=26.01ms med=164.44ms max=1.62s    p(90)=217.02ms p(95)=224.51ms
     http_reqs......................: 513    180.657393/s
     vus............................: 500    min=500 max=500
     vus_max........................: 500    min=500 max=500

```

### Configuration

We can configure this tests by making some changes to `build_tools/load_generator/site_navigation.js`:

```js
import http from 'k6/http';

import ws from 'k6/ws';

import { sleep, group, check } from 'k6';

export let options = {
  vus: 500,
  duration: '15m'
};
```

At the top of the file we can set the number of Virtual Users (vus) and the duration.

If your machine is struggling to run the test with 500 users you can try lowering the value to 50 and going from there.

## The Metrics

If you head back to your Grafana dashboard you won't see anything exciting just yet. The system needs a few seconds to update.

Our Prometheus server will get updates from the services at regular updates, so we will see updated values every 15 seconds or so.

Once the test has been running for a few minutes the dashboard should explode into life.

Now when you make changes to Varcade Games you can test them under load!