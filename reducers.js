/* @flow */
'use strict';

import {
  SEARCHING_YOUTUBE,
  FOUND_ON_YOUTUBE,
  STOP_SEARCHING,
  ADD_TRACK_TO_COLLECTION,
  DELETE_TRACK_FROM_COLLECTION,
  SELECT_TRACK,
  FETCHED_SOURCE_FOR_TRACK,
  FETCHED_CAPTIONS_FOR_TRACK,
  ADD_TIMESTAMP,
  CHANGE_TITLE_FOR_TIMESTAMP,
  MOVE_TIMESTAMP,
  DELETE_TIMESTAMP,
  MUTE_TIMESTAMP,
  LIKE_TIMESTAMP,
  TICK,
  APPLY_SETTINGS,
  START_RECORDING,
  STOP_RECORDING
} from './actions';

import { LOAD, SAVE } from 'redux-storage';
import { List } from 'immutable';

type GlobalState = any;

const defaultState: GlobalState = {
  savedTracks: [],
  foundTracks: [],
  isLoading: false,
  settings: {
    repeats: 3,
    intervalRatio: 1.5,
    startFromPause: true
  }
};

export default function reducer(state = defaultState, action): GlobalState {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isLoading: false,
        isSearching: false,
      };

    case TICK:
      state.savedTracks[0].currentTime = action.time;
      return {
        ...state,
        savedTracks: [...state.savedTracks]
      };

    case SEARCHING_YOUTUBE:
      return {
        ...state,
        isLoading: true
      };

    case FOUND_ON_YOUTUBE:
      action.tracks = action.tracks.map(t => {
        const found = state.savedTracks.filter(i => i.id.videoId === t.id.videoId);
        if (found.length > 0 ) {
          return found[0];
        }
        return t;
      })
      return {
        ...state,
        isLoading: false,
        isSearching: true,
        foundTracks: action.tracks
      };

    case ADD_TRACK_TO_COLLECTION:
      state.foundTracks[action.trackIndex].inSearch = false;
      return {
        ...state,
        foundTracks: state.foundTracks,
        savedTracks: [state.foundTracks[action.trackIndex]].concat(state.savedTracks)
      }

    case DELETE_TRACK_FROM_COLLECTION:
      if (state.inSearching) {
        // replace its status back
        state.foundTracks.filter(i => i.id.videoId)[0].inSearch = true;
      }
      return {
        ...state,
        savedTracks: state.savedTracks.filter(tr => tr !== action.track)
      }

    case STOP_SEARCHING:
      return {
        ...state,
        isSearching: false
      }

    case SELECT_TRACK:
      const savedIndex = state.savedTracks.indexOf(action.track)
      const foundIndex = state.foundTracks.indexOf(action.track)
      const selectedIndex = savedIndex > -1 ? {
        index: savedIndex,
        type: 'saved'
      } : {
        index: foundIndex,
        type: 'found'
      };

      return {
        ...state,
        selectedIndex
      }

    case FETCHED_SOURCE_FOR_TRACK:
      if (state.selectedIndex.type === 'found') {
        state.foundTracks[state.selectedIndex.index].source = action.source;
        state.foundTracks[state.selectedIndex.index].sourceDate = new Date();
        return {
          ...state,
          foundTracks: [...state.foundTracks]
        }
      } else {
        state.savedTracks[state.selectedIndex.index].source = action.source;
        state.savedTracks[state.selectedIndex.index].sourceDate = new Date();
        return {
          ...state,
          savedTracks: [...state.savedTracks]
        }
      }

    case FETCHED_CAPTIONS_FOR_TRACK:
      if (action.timestamps.length === 0) {
        return state;
      }
      if (state.selectedIndex.type === 'found') {
        state.foundTracks[state.selectedIndex.index].timestamps = action.timestamps;
        return {
          ...state,
          foundTracks: [...state.foundTracks]
        }
      } else {
        if (state.savedTracks[state.selectedIndex.index].timestamps &&
          state.savedTracks[state.selectedIndex.index].timestamps.length > 0) {
            return state;
          }
        state.savedTracks[state.selectedIndex.index].timestamps = action.timestamps;
        return {
          ...state,
          savedTracks: [...state.savedTracks]
        }
      }


    case ADD_TIMESTAMP:
      const track = getTrack(state)
      const isDublicate = track.timestamps && track.timestamps.filter(t =>
        t.time === action.time || Math.abs(t.time - action.time)*1000 < 200).length > 0 // 200 ms thrueshold
      if (isDublicate) {
        return state;
      } else {
        const newTimestamp = {
          title: '',
          isMuted: false,
          time: action.time
        }
        track.timestamps = track.timestamps ? track.timestamps.concat([newTimestamp]).sort((a, b) => a.time - b.time) : [newTimestamp];
        return {
          ...state,
          foundTracks: [...state.foundTracks],
          savedTracks: [...state.savedTracks]
        }
      }

    case CHANGE_TITLE_FOR_TIMESTAMP:
      const track2 = getTrack(state)
      track2.timestamps[action.index].title = action.title;
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case MOVE_TIMESTAMP:
      const track3 = getTrack(state)
      // if (track3.timestamps[action.index - 1].time > action.time) {
      //   track3.timestamps[action.index - 1].time > action.time
      // }
      track3.timestamps[action.index].time = action.time;
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case DELETE_TIMESTAMP:
      const track4 = getTrack(state)
      // if (track3.timestamps[action.index - 1].time > action.time) {
      //   track3.timestamps[action.index - 1].time > action.time
      // }
      track4.timestamps = track4.timestamps.filter((e, i) => parseInt(action.index, 10) !== i);
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case MUTE_TIMESTAMP:
      const track5 = getTrack(state)
      track5.timestamps[action.index].isMuted = !track5.timestamps[action.index].isMuted;
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case LIKE_TIMESTAMP:
      const track6 = getTrack(state)
      track6.timestamps[action.index].isLiked = !track6.timestamps[action.index].isLiked;
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case APPLY_SETTINGS:
      return {
        ...state,
        settings: action.settings
      }

    case START_RECORDING:
      const track7 = getTrack(state)
      if (!track7.recordings) {
        track7.recordings = [];
      }
      track7.recordings.push({
        startTime: action.startTime,
        createdAt: new Date(),
        trackName: action.trackName
      })

      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    case STOP_RECORDING:
      const track8 = getTrack(state)
      track8.recordings.filter(r => r.trackName === action.trackName)[0].duration = action.duration;
      return {
        ...state,
        foundTracks: [...state.foundTracks],
        savedTracks: [...state.savedTracks]
      }

    default:
      return state;
  }
}


function getTrack(state) {
  return state.selectedIndex.type === 'found' ?
    state.foundTracks[state.selectedIndex.index] :
    state.savedTracks[state.selectedIndex.index];
}
