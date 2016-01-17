import * as YoutubeAPI from './API/youtubeAPI' // { searchYoutube, obtainVideoFromLink, getCaptions }

export const SEARCHING_YOUTUBE = 'SEARCHING_YOUTUBE';
export const FOUND_ON_YOUTUBE = 'FOUND_ON_YOUTUBE';
export const STOP_SEARCHING = 'STOP_SEARCHING';
export const DELETE_TRACK_FROM_COLLECTION = 'DELETE_TRACK_FROM_COLLECTION';

export const ADD_TRACK_TO_COLLECTION = 'ADD_TRACK_TO_COLLECTION';

function searchingYoutube() {
  return {
    type: SEARCHING_YOUTUBE
  }
}

function foundOnYoutube(tracks) {
  return {
    type: FOUND_ON_YOUTUBE,
    tracks
  }
}

export function searchYoutube(query) {
  return (dispatch) => {
     dispatch(searchingYoutube())
       return YoutubeAPI.searchYoutube(query)
        .then(tracks => dispatch(foundOnYoutube(tracks)));
   }
}

export function addTrackToCollection(trackIndex) {
  return {
    type: ADD_TRACK_TO_COLLECTION,
    trackIndex
  }
}

export function stopSearching() {
  return {
    type: STOP_SEARCHING
  }
}

export function deleteTrackFromCollection(track) {
  return {
    type: DELETE_TRACK_FROM_COLLECTION,
    track
  }
}
