import http from 'k6/http';

import ws from 'k6/ws';

import { sleep, group, check } from 'k6';

export let options = {
  vus: 500,
  duration: '15m'
};

const playGame = true
const vuIdentifier = Math.floor(Math.random() * 10000)
var userId;
const params = {
    headers: {
      'Content-Type': 'application/json',
    },
};

function handleResponse(response, expectedStatusCode) {
    const checkMsg =  `request for ${response.request.url} status is ${response.status}`
    check(response, {
        statusCode: (r) => r.status === expectedStatusCode,
     });
    if (response.status != expectedStatusCode) {
        console.error(`Request to url: ${response.request.url} ${vuIdentifier} failed. Response: ${JSON.stringify(response)}`)
        return false
    }
    return true
}

export default function () {


    group('landing and registration', function () {
        console.log(`Fetching VCG client, identifier: ${vuIdentifier}`)
        var response = http.get('http://varcade.local:8002/');
        if (!handleResponse(response, 200)) {
            console.log(`Failed to VCG client, user: ${vuIdentifier}`)
            return
        }
        sleep(1);

        if (!params.headers["Authorization"]) {
            const payload = JSON.stringify({
                username: `keverts${vuIdentifier}`, 
                email: `kev${vuIdentifier}@kev.com`, 
                password: "pa88w0rd"
            });

            console.log(`Registering user: ${payload}, identifier: ${vuIdentifier}`)

            response = http.post('http://api.varcade.local:8000/register/', payload, params)
            if (!handleResponse(response, 201)) {
                console.log(`Register Failed for user: ${vuIdentifier}`)
                return
            }
            console.log(`Registration successful, user: ${vuIdentifier}`)
            params.headers["Authorization"] = `Bearer ${response.json().access}`
        }
    });

    group('homepage', function () {
        console.log(`Loading user profile, user: ${vuIdentifier}`)
        var response = http.get('http://api.varcade.local:8000/profile_service/v1/profile/', params)
        if (!handleResponse(response, 200)) {
            return
        }
        console.log(`Profile loaded, user: ${vuIdentifier}`)
        userId = response.json().user.id

        console.log(`Loading games, user: ${vuIdentifier}`)
        response = http.get('http://api.varcade.local:8000/games/v1/games', params)
        if (!handleResponse(response, 200)) {
            return
        }
        console.log(`Games loaded, user: ${vuIdentifier}`)
        sleep(2)
    });

    group('game page', function () {
        console.log(`Loading game, user: ${vuIdentifier}`)
        var response = http.get('http://varcade.local:8090/main.js', params)
        if (!handleResponse(response, 200)) {
            console.log(`Failed to load game, user: ${vuIdentifier}`)
            return
        }
        console.log(`Game loaded, user: ${vuIdentifier}`)

        console.log(`Loading stats, user: ${vuIdentifier}`)
        response = http.get('http://api.varcade.local:8000/games/v1/stats/exrps', params)
        if (!handleResponse(response, 200)) {
            console.log(`Failed to load stats, user: ${vuIdentifier}`)
            return
        }

        console.log(`Loading leaderboard, user: ${vuIdentifier}`)
        response = http.get('http://api.varcade.local:8000/games/v1/leaderboard/exrps', params)
        if (!handleResponse(response, 200)) {
            console.log(`Failed to load leaderboard, user: ${vuIdentifier}`)
            return
        }
    });

    if (playGame && __VU % 10 != 0) {
        var joinGameToken, targetGameServer;  // We'll get this from either joining and existing game or creating

        group('join or create game', function () {
            
            const createGame = __VU % 2 == 0

            if (createGame) {
                console.log(`Creating a new game for user: ${vuIdentifier}, vu: ${__VU}`)
                var payload = JSON.stringify({
                    game_type: 0, 
                    num_players: 2
                })

                response = http.post('http://matchmaker.varcade.local:5050/game_lobby/exrps/create_game', payload, params)
                handleResponse(response, 200)
                joinGameToken = response.json().token
                targetGameServer = response.json().target_game_server
            }
            else {
                console.log(`Waiting for games to join for user: ${vuIdentifier}`)
                for (var i = 0; i <= 10; i++) {
                    var response = http.get('http://matchmaker.varcade.local:5050/game_lobby/exrps/open_games', params)
                    const requestWasSuccessful = handleResponse(response, 200)
                    if (requestWasSuccessful) {
                        var responseData = response.json() 
                        if (responseData.length > 0) {
                            console.log(`Found open games to connect to, user: ${vuIdentifier}, Game ID: ${responseData[0].game_id}`)
                            response = http.post(
                                `http://matchmaker.varcade.local:5050/game_lobby/exrps/join_game/${responseData[0].game_id}`, 
                                "{}",
                                params
                            )
                            handleResponse(response, 200)
                            if (response.status === 200) {
                                joinGameToken = response.json().token
                                targetGameServer = response.json().target_game_server
                                break;
                            }
                        }
                    }
                    console.log(`No game found, going to sleep for a second, user: ${vuIdentifier}`)
                    sleep(1)
                }
            }
        });

        if (!joinGameToken) {
            return
        }


        group('play game', function () {
        
            var wsUrl = `ws://${targetGameServer}/?game_token=${joinGameToken}&user_id=${userId}`
            var fighterSelected = false;

            console.log(`Connecting to game server, user: ${vuIdentifier}`)

            const res = ws.connect(wsUrl, params, function (socket) {
                socket.on('open', () => {
                    console.log(`Connected to game server, user: ${vuIdentifier}`)
                    socket.send(JSON.stringify({
                        type: 'select_fighter',
                        characterId: 'man'
                    }))
                    console.log(`Sent fighter selection, user: ${vuIdentifier}`)
                    fighterSelected = true
                    socket.send(JSON.stringify({
                        type: 'start_battle'
                    }))
                    console.log(`Sent start battle, user: ${vuIdentifier}`)
                });

                socket.on('message', (data) => {
                    
                    console.debug('Message received: ', data)
                    const msgData = JSON.parse(data)

                    if (msgData.type === "RPSGameEvent" && msgData.eventData.type === 1) {
                        console.log(`Game started for user: ${vuIdentifier}`)
                    }
                    else if (msgData.type === "RPSGameEvent" && msgData.eventData.type === 4) {
                        console.log(`Game complete for user: ${vuIdentifier}`)
                        socket.close()
                    }
                    else if (msgData.type === "RPSRoundEvent" && msgData.eventData.type === 1) {
                        // Do nothing here, this gives all games a fixed length through
                        // consistent attrition
                        // var weaponChoice = Math.floor(Math.random() * 3)
                        // console.debug(`Selecting weapon ${weaponChoice} for user: ${vuIdentifier}`)
                        // socket.send(JSON.stringify({
                        //     type: 'select_weapon',
                        //     index: weaponChoice
                        // }))
                    }

                });
                socket.on('close', () => console.log(`Disconnected from game server, user: ${vuIdentifier}`));
            });
            check(res, { 'websocket status is 101': (r) => r && r.status === 101 });
        });
    }

}