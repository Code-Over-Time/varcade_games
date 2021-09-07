const chai = require('chai')
const chaiHttp = require('chai-http')
const RPSApp = require('../game_server/app')

chai.use(chaiHttp)
const should = chai.should()

describe('game_server_http_api', () => { // eslint-disable-line
  describe('GET /active_games', () => { // eslint-disable-line 
    it('should get an empty object representing all active games', (done) => { // eslint-disable-line
      chai.request(RPSApp.appServer)
        .get('/active_games')
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.should.be.eql([])
          done()
        })
    })
  })

  describe('GET /create_game', () => { // eslint-disable-line
    it('should successfully create a new game', (done) => { // eslint-disable-line
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'testGameId',
          userId: '1',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .get('/active_games')
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.should.be.eql(['testGameId'])
        })

      done()
    })

    it('should fail to create a new game due to invalid userId format', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'testGameId',
          userId: '',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid userId in create or join request')
          done()
        })
    })

    it('should fail to create a new game due to missing gameId', (done) => { // eslint-disable-line
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          userId: 'testUserId',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid gameId in create or join request')
          done()
        })
    })

    it('should fail to create a new game due to invalid username format', (done) => { // eslint-disable-line
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'testGameId',
          userId: 'testUserId',
          username: null
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid username in create or join request')
          done()
        })
    })
  })

  describe('GET /join_game', () => { // eslint-disable-line
    it('should successfully join a game', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'testGameId2',
          userId: 'testUserId',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'testGameId2',
          userId: 'testUserId',
          username: 'testUsername2'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      done()
    })

    it('should fail to join a game due to invalid gameId format', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: '',
          userId: 'testUserId',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid userId in create or join request')
          done()
        })
    })

    it('should fail to join a game due to invalid userId format', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'testGameId',
          userId: '',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid userId in create or join request')
          done()
        })
    })

    it('should fail to join a game due to missing username', (done) => { // eslint-disable-line
      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'testGameId',
          userId: 'testUserId'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.message.includes('Received an invalid userId in create or join request')
          done()
        })
    })
  })

  describe('POST /remove_player', () => { // eslint-disable-line
    it('should successfully remove a player from a game', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'playerRemovalGame',
          userId: 'userA',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'playerRemovalGame',
          userId: 'userB',
          username: 'testUsername2'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/remove_player')
        .send({
          gameId: 'playerRemovalGame',
          userId: 'userB'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('playerRemoved', true)
        })

      done()
    })

    it('should fail to remove an invalid player from a game', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'invalidPlayerRemoval',
          userId: 'userA',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'invalidPlayerRemoval',
          userId: 'userB',
          username: 'testUsername2'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/remove_player')
        .send({
          gameId: 'invalidPlayerRemoval',
          userId: 'userC'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(404)
        })

      done()
    })

    it('should fail to remove host from a game', (done) => { // eslint-disable-line 
      chai.request(RPSApp.appServer)
        .post('/create_game')
        .send({
          gameId: 'invalidHostRemoval',
          userId: 'userA',
          username: 'testUsername'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/join_game')
        .send({
          gameId: 'invalidHostRemoval',
          userId: 'userB',
          username: 'testUsername2'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('gameToken')
        })

      chai.request(RPSApp.appServer)
        .post('/remove_player')
        .send({
          gameId: 'invalidHostRemoval',
          userId: 'userA'
        })
        .end((err, res) => {
          should.not.exist(err)
          res.should.have.status(400)
          res.body.message.includes('The host of a game cannot be removed')
        })

      done()
    })
  })
})
