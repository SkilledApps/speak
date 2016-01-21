import * as YoutubeAPI from './API/youtubeAPI' // { searchYoutube, obtainVideoFromLink, getCaptions }

export const SEARCHING_YOUTUBE = 'SEARCHING_YOUTUBE';
export const FOUND_ON_YOUTUBE = 'FOUND_ON_YOUTUBE';
export const STOP_SEARCHING = 'STOP_SEARCHING';

export const ADD_TRACK_TO_COLLECTION = 'ADD_TRACK_TO_COLLECTION';
export const DELETE_TRACK_FROM_COLLECTION = 'DELETE_TRACK_FROM_COLLECTION';

export const SELECT_TRACK = 'SELECT_TRACK';
export const FETCHED_SOURCE_FOR_TRACK = 'FETCHED_SOURCE_FOR_TRACK';
export const FETCHED_CAPTIONS_FOR_TRACK = 'FETCHED_CAPTIONS_FOR_TRACK';

export const ADD_TIMESTAMP = 'ADD_TIMESTAMP';
export const CHANGE_TITLE_FOR_TIMESTAMP = 'CHANGE_TITLE_FOR_TIMESTAMP';
export const MOVE_TIMESTAMP = 'MOVE_TIMESTAMP';
export const DELETE_TIMESTAMP = 'DELETE_TIMESTAMP';
export const RENAME_TIMESTAMP = 'RENAME_TIMESTAMP';
export const MUTE_TIMESTAMP = 'MUTE_TIMESTAMP';

export const TICK = 'TICK';

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

export function justSelectTrack(track) {
  return {
    type: SELECT_TRACK,
    track
  }
}
export function selectTrack(track, force) {
  if (!force && track.source && track.sourceDate && ((new Date() - new Date(track.sourceDate)) < 2*60*60*1000)) {
    return justSelectTrack(track);
  } else {
    return (dispatch) => {
      dispatch(justSelectTrack(track))
      return YoutubeAPI.obtainVideoFromLink(track.id.videoId)
        .then(source => dispatch(fetchedSource(track, source)))
        .then(() => YoutubeAPI.getCaptions('en', track.id.videoId))
        .then(timestamps => dispatch(fetchedCaptions(track, timestamps)))
    }
  }
}

export function fetchedSource(track, source) {
  return {
    type: FETCHED_SOURCE_FOR_TRACK,
    track,
    source,
  }
}

export function fetchedCaptions(track, timestamps) {
  return {
    type: FETCHED_CAPTIONS_FOR_TRACK,
    track,
    timestamps
  }
}

export function addTimestamp(time) {
  return {
    type: ADD_TIMESTAMP,
    time
  }
}

export function changeTitleForTimestamp(index, title) {
  return {
    type: CHANGE_TITLE_FOR_TIMESTAMP,
    index,
    title
  }
}

export function moveTimestamp(index, time) {
  return {
    type: MOVE_TIMESTAMP,
    index,
    time
  }
}

export function deleteTimestamp(index) {
  return {
    type: DELETE_TIMESTAMP,
    index
  }
}

export function tick(time) {
  return {
    type: TICK,
    time
  }
}
