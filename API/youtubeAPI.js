
const API_KEY = 'AIzaSyCnkNKecXxIbzhI-0BMLzFwza_0BUv29ek';

const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search?type=video&maxResults=10&part=snippet&key=' + API_KEY + '&q='

const VIDEO_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&key=' + API_KEY + '&id='

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
