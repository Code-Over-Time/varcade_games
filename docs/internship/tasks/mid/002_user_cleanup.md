# User Cleanup

**Category**: Backend Development

**Level:** Mid

**Tag:** v0.0.1 

## Description
There is a problem lurking in the Varcade Games server code.

If you take a look in the web portal server code you will find the following:

`website/server/game_portal/game_portal/games/views.py`

```
class LeaderboardView(APIView):
    http_method_names = ["get"]

    def get(self, request, product_id, format=None):
        leaderboard_result = get_leaderboard(product_id)
        # in_bulk will return a dict of UUID: Account.
        users = {
            str(k): v
            for k, v in Account.objects.in_bulk(
                [e["user_id"] for e in leaderboard_result]
            ).items()
        }

        for entry in leaderboard_result:
            try:
                entry["username"] = users[entry["user_id"]].username
            except:
                logging.warning(
                    f"Unable to process leaderboard user. User Entry: {entry}"
                )
                entry["username"] = "Unknown User"

        return Response(leaderboard_result)
```

What is happening here is that after fetching the leaderboard from the stats service, the game portal server needs to fetch the user account for each user in the leaderboard. The stats service only stores user IDs, so this is the point where we can fetch the actual name and populate the response for the client.

This code also handles the case where there is a user ID in the leaderboard data returned from the stats server, but NOT in the game portal database.

This can happen if a user creates an account, registers a score on the leaderboard, deletes their account.

There are two problems with this:

* The service request to get the leaderboard fetches the top ten. If there are users missing then what is returned to the client will be less than 10, so it is no longer displaying the top 10
* If every user in the top 10 has their account deleted, the leaderboard response will always be empty, despite there being entries in the leaderboard

We need to update our services so that users are removed from all leaderboards if their account is removed.

We can keep their game stats if they come back in the future, as these are per player so it doesn't matter if they hang around - it won't affect other players. But we need to clean out the leaderboards.

## Deliverable
1. Updated stats_tracker API that includes an endpoint for removing a user from all leaderboards, this includes:
	1. A new API endpoint
	2. New logic to remove a user from all leaderboards by ID
	3. Error handling
	4. Tests
5. Updated game portal code that calls the stats-tracker 'remove player' endpoint when a user account is deleted.
	1. This should include tests

## Acceptance Criteria
* Deleting a user removes them from **all** leaderboards they have registered a score on.

***

## Task Tips!

* Django `signals` will be useful here. We already use this functionality to create a user profile after an account is created, see `website/server/game_portal/game_portal/progiles/models.py`
* You can delete user account manually from the Game Portal admin panel in order to test this
