class LeaderboardHandler:
    """This class can be overridden and registered as a leaderboard handler. This gives individual games
    the ability to handle more complex scoring, such as ELO
    """

    def get_updated_scores(
        self, winner_id, winner_current_score, loser_id, loser_current_score
    ):
        """
        Default implementation with return current score + 1 for the winner and current score for the loser

        returns: tuple containing the new score for the winner and the new scores for the loser
        """
        if winner_current_score is None:
            winner_current_score = 0
        if loser_current_score is None:
            loser_current_score = 0
        return (winner_current_score + 1, loser_current_score)
