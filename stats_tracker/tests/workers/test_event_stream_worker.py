from workers.event_stream_workers import GameEventWorker

from leaderboards.leaderboards import get_top_players

from player_stats.player_stats import get_stats_for_game


class TestGameEventWorker:
    def test_process_events(self, test_db_url, sample_game_event_stream_events):
        GameEventWorker(test_db_url).process_events(sample_game_event_stream_events)

        top_ten = get_top_players("exrps")
        assert 2 == len(top_ten)
        assert top_ten[0]["user_id"] == "userA"
        assert top_ten[0]["score"] == 2

        stats = get_stats_for_game("exrps", "userA")
        assert stats["wins"] == "2"
        assert stats["losses"] == "0"
        assert stats["paper_selection_count"] == "1"

    def test_process_events_with_errors(
        self,
        test_db_url,
        invalid_event_product_id,
        invalid_result_product_id,
        invalid_event_missing_key,
    ):
        # These event streams all contains Exception causing data - we need to verify
        # they are handled. Errors will be logged
        GameEventWorker(test_db_url).process_events(invalid_event_product_id)
        GameEventWorker(test_db_url).process_events(invalid_result_product_id)
        GameEventWorker(test_db_url).process_events(invalid_event_missing_key)
