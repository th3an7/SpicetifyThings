# SpicetifyOBS
## Display currently playing song in OBS using Spicetify plugin

https://user-images.githubusercontent.com/13398380/191394837-305672e2-731f-445c-a54c-0c38c176ea66.mov

#### Prerequisites:
* Python
* SimpleWebSocketServer - use `pip install SimpleWebSocketServer`

#### How to use:
0. Clone this repo or download everything from this folder
1. Install `TwitchNPPlugin.js` Spicetify plugin by copying it into `%appdata%\spicetify\Extensions` and running `spicetify config extensions TwitchNPPlugin.js`, then `spicetify apply`
3. Start `server.py`
4. In OBS, add `client.html` as Browser Source with size set to 1920x1080

#### Known Issues:
* If artist does not have "Hero" background image, it will display transparent (or white?) background
* After starting server/refreshing page, data is not visible - just change song once to refresh it
* Play/pause animation may be a little bit broken - weird stretching could be observed when pausing...
* Overlay is not scaling automatically



## Disclaimer: 
I know it has some issues and I'm probably **NOT** going to fix them unless it's stops working completely (or if I feel like it)
This whole "project" was made for my own usage - I'm just uploading it as a PoC and for others as an idea for their own plugins/overlays
