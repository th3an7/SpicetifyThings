// NAME: Twitch Now Playing plugin
// AUTHOR: Th3An7 (twitch.tv/th3an7)
// DESCRIPTION: Get current song info in OBS (or somewhere else)a

/// <reference path="../globals.d.ts" />

(async function TwitchNP() {
		let songInfo;
		let ws;
		let currState = 0;

		const info = {
			Artist: () => Spicetify.Player.data.track.metadata.artist_name,
			Title: () => Spicetify.Player.data.track.metadata.title,
			Duration: () => convertTimeToString(Spicetify.Player.getDuration()),
			DurationMs: () => Spicetify.Player.getDuration(),
			Position: () => convertTimeToString(Spicetify.Player.getProgress()),
			PositionMs: () => Spicetify.Player.getProgress(),
			Cover: () => Spicetify.Player.data.track.metadata.image_url.replace("spotify:image:", "https://i.scdn.co/image/"),

			State: () => Spicetify.Player.isPlaying(),
			Link: () => Spicetify.Player.data.track.uri.replace("spotify:track:", "https://open.spotify.com/track/"),
			Volume: () => Math.round(Spicetify.Player.getVolume() * 100),
			ArtistHero: () => getArtistHero(Spicetify.Player.data.track.metadata.artist_uri.split(":")[2])
		};

		async function updateInfo() {
			if (!Spicetify.Player.data && currState !== 0) {
				ws.send("STATE:" + 0);
				currState = 0;
				return;
			}
		
			for (const field in info) {
				try {
					const data = await info[field].call();
					if (data !== undefined && songInfo[field] !== data) {
						ws.send(`${field}:${data}`);
						songInfo[field] = data;
					}
				}   
				catch (e) {
					ws.send(`ERROR: Cannot update ${field}`);
					ws.send("ERRORInfo: " + e);
				}
			}
		}
		
		//Spicetify.Player.addEventListener('onplaypause', updateInfo);
		//Spicetify.Player.addEventListener('songchange', updateInfo);

		(function init() {
			ws = new WebSocket("ws://localhost:1234/spotify");
			let sendData;

			ws.onopen = () => {
				ws.send("CONNECTED");
				currState = 1;
				songInfo = {};
				sendData = setInterval(updateInfo, 1000);
			};

			ws.onclose = () => {
				clearInterval(sendData);
				setTimeout(init, 2000);
			};

		})();

		window.onbeforeunload = () => {
			ws.onclose = null;
			ws.close();
		};

		function pad(number, length) {
			var str = String(number);
			while (str.length < length) {
				str = "0" + str;
			}
			return str;
		}

		function convertTimeToString(timeInMs) {
			const seconds = ((timeInMs % 60000) / 1000).toFixed(0);
			const minutes = Math.floor(timeInMs / 60000);
			return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		}
		
		/*async function getArtistHero(artistId) {
			const promise = new Promise((resolve, reject) => {
				resolve(Spicetify.CosmosAsync.get(`hm://artist/v1/${artistId}/desktop?format=json`));
			});
			promise.then(data => {return data.header_image.image});
		}*/
		
		async function getArtistHero(artistId) {
			let data = await Spicetify.CosmosAsync.get(`https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryArtistOverview&variables=%7B%22uri%22%3A%22spotify%3Aartist%3A${artistId}%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22433e28d1e949372d3ca3aa6c47975cff428b5dc37b12f5325d9213accadf770a%22%7D%7D`);
			console.log(data);
			return data.data.artist.visuals.headerImage.sources[0].url;
		}
	})();