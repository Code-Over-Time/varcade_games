import json

import pytest

from core.db import initialise_db, get_stats_tracker_db

from player_stats.player_stats import track_event, get_stats_for_game

from player_stats.handlers import PlayerStatsHandler, EXRPSStatsHandler


class TestPlayerStats:
    def test_track_event(self, stats_tracker_db):
        with pytest.raises(ValueError):  # Events cannot be None
            track_event("exrps", None)

        track_event("unknown_handler", {})  # Should fallback to default

        # Should go through fine (handlers deal with event content and warn rather than fail)
        track_event("exrps", {})


class TestPlayerStatsHandler:
    def test_handle_game_over_event(self, stats_tracker_db, test_game_over_event):
        _verify_player_handler_process_event(PlayerStatsHandler(), test_game_over_event)


class TestEXRPSStatsHandler:
    def test_handle_game_over_event(self, stats_tracker_db, test_game_over_event):
        _verify_player_handler_process_event(EXRPSStatsHandler(), test_game_over_event)

    def test_handle_weapon_select_event(
        self, stats_tracker_db, test_weapon_select_event
    ):
        handler = PlayerStatsHandler()
        handler.process_event(test_weapon_select_event)
        assert handler.get_stats("exrps", "userA") == {}  # Won't work - wrong handler

        handler = EXRPSStatsHandler()
        handler.process_event(test_weapon_select_event)
        assert handler.get_stats("exrps", "userA") == {"paper_selection_count": "1"}


class TestPlayerStatsApi:
    def test_get_user_stats(self, stats_tracker_db, test_client, test_game_over_event):
        response = test_client.get(f"stats/exrps/userA")
        assert response.status_code == 200
        assert json.loads(response.data) == {}

        PlayerStatsHandler().process_event(test_game_over_event)

        response = test_client.get(f"stats/exrps/userA")
        assert response.status_code == 200
        assert json.loads(response.data) == {"wins": "1", "losses": "0", "games": "1"}


############## Private Helper Functions


def _verify_player_handler_process_event(handler, event):
    assert handler.get_stats("exrps", "userA") == {}

    handler.process_event({"invalid": "event"})  # This should do nothing
    assert handler.get_stats("exrps", "userA") == {}

    handler.process_event(event)
    assert handler.get_stats("exrps", "userA") == {
        "wins": "1",
        "games": "1",
        "losses": "0",
    }
    assert handler.get_stats("exrps", "userB") == {
        "wins": "0",
        "games": "1",
        "losses": "1",
    }
