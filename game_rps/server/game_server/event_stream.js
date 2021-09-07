const redis = require('redis')
const logger = require('./logger')

const GAME_EVENT_STREAM_ID = 'game_event_stream'

class StreamEvent {
  constructor (gameId, type, eventData) {
    this.gameId = gameId
    this.type = type
    this.eventData = eventData
  }
}

// For matchmaker events
class StateChangeEvent extends StreamEvent {
  constructor (gameId, newState) {
    super(gameId, 'state_change', {
      new_state: newState
    })
  }
}

// Game play events
class GameplayEvent extends StreamEvent {
  constructor (gameId, userId, eventName, eventData) {
    super(gameId, 'gameplay', {
      event_name: eventName,
      event_data: eventData,
      user_id: userId
    })
  }
}

class GameProgressEvent extends StreamEvent {
  constructor (gameId, progressEvent, p1Id, p2Id, eventData) {
    let enrichedEventData = {
      event_name: 'progression',
      progress_event: progressEvent,
      p1_id: p1Id,
      p2_id: p2Id
    }
    enrichedEventData = { ...eventData, ...enrichedEventData }
    super(gameId, 'gameplay', enrichedEventData)
  }
}

class GameOverEvent extends StreamEvent {
  constructor (gameId, winnerId, loserId) {
    super(gameId, 'game_over', {
      winner_id: winnerId,
      loser_id: loserId
    })
  }
}

class EventStream {
  constructor (eventStreamURL, productId) {
    this.eventStreamURL = eventStreamURL
    this.productId = productId
    this.client = redis.createClient(this.eventStreamURL)
  }

  sendStreamEvent (streamEvent) {
    const eventArgs = [
      GAME_EVENT_STREAM_ID, '*',
      'product_id', this.productId,
      'game_id', streamEvent.gameId,
      'type', streamEvent.type
    ]
    if (streamEvent.eventData) {
      eventArgs.push(...Object.entries(streamEvent.eventData).flat())
    }
    // last arg to xadd can be an error handler
    eventArgs.push((err, res) => {
      if (err) {
        logger.error('Unable to send eventstream event.', err)
      }
    })
    this.client.xadd(...eventArgs)
  }
}

module.exports = {
  StreamEvent: StreamEvent,
  EventStream: EventStream,
  GameplayEvent: GameplayEvent,
  StateChangeEvent: StateChangeEvent,
  GameOverEvent: GameOverEvent,
  GameProgressEvent: GameProgressEvent
}
