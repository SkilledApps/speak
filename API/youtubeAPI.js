var DOMParser = require('xmldom').DOMParser

const API_KEY = 'AIzaSyCnkNKecXxIbzhI-0BMLzFwza_0BUv29ek';

const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search?type=video&maxResults=10&part=snippet&key=' + API_KEY + '&q='

const VIDEO_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&key=' + API_KEY + '&id='

const CAPTIONS_ENDPOINT = 'http://video.google.com/timedtext?lang='

export function searchYoutube(query) {
  return fetch(SEARCH_ENDPOINT + query)
    .then(r => r.json())
    .then(r => r.items)
    .then(items => {
      const ids = items.map(i => i.id.videoId);
      return fetch(VIDEO_ENDPOINT + ids.join(','))
        .then(r => r.json())
        .then(contentsDetails => {
          return items.map(item => {
            item.details = contentsDetails.items.filter(c => c.id === item.id.videoId)[0]
            item.inSearch = true;
            return item;
          })
        })
    })
    .catch(e => console.error(e));
}


export function obtainVideoFromLink(youtubeId) {
  const NativeModules = require('react-native').NativeModules;
  return NativeModules.YoutubeParser.obtainVideoFromLink('http://www.youtube.com/watch?v=' + youtubeId);
}

function parseIntoTimestamps(xml) {
  if (!xml) {
    return [];
  }
  var doc = new DOMParser().parseFromString(
    xml
    ,'text/xml');
  const childs = [];
  for (var i=0; i<doc.documentElement.childNodes.length; i++) {
    let node = doc.documentElement.childNodes[i];
    childs.push({
      title: node.firstChild.data,
      time: parseFloat(node.getAttribute('start')),
      isMuted: false
    });
  }
  return childs;
}
export function getCaptions(lang, youtubeId) {
  return fetch(CAPTIONS_ENDPOINT + lang + '&v=' + youtubeId)
    .then(r => r.text())
    .then(r => parseIntoTimestamps(r))
    .catch(e => console.error('getCaptions error', e))
}
