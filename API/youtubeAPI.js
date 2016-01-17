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
  const link = NativeModules.YoutubeParser.obtainVideoFromLink('http://www.youtube.com/watch?v=' + youtubeId);
  //console.log(youtubeId, link);
  return link;
}

function parseIntoTimestamps(xml) {
  // var parseString = require('xml2js').parseString;
  // var xml = "<root>Hello xml2js!</root>"
  // parseString(xml, function (err, result) {
  //     console.dir(result);
  // });
  var doc = new DOMParser().parseFromString(
    xml
    ,'text/xml');

  const childs = [];
  for (var i=0; i<doc.documentElement.childNodes.length; i++) {
    let node = doc.documentElement.childNodes[i];
    childs.push({
      title: node.firstChild.data,
      time: node.getAttribute('start'),
      isMuted: false
    });
    childs.push({
      title: '',
      time: node.getAttribute('start') + node.getAttribute('dur'),
      isMuted: true
    });
  }
  //console.log('elements <text>', doc.documentElement.childNodes.map(a => a.getAttribute()).join(','))
  return childs;
  //console.log(doc.documentElement.getElementsByTagName('transcript')[0].getElementsByTagName('text').map(a => a.getAttribute()).join(',')) //.childNamed('transcript')
}
export function getCaptions(lang, youtubeId) {
  return fetch(CAPTIONS_ENDPOINT + lang + '&v=' + youtubeId)
    .then(r => r.text())
    .then(r => parseIntoTimestamps(r))
    .catch(e => console.error(e))
}