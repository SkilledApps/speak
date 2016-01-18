/* @flow */
'use strict';

import {
  SEARCHING_YOUTUBE,
  FOUND_ON_YOUTUBE,
  STOP_SEARCHING,
  ADD_TRACK_TO_COLLECTION,
  DELETE_TRACK_FROM_COLLECTION,
  SELECT_TRACK,
  FETCHED_SOURCE_FOR_TRACK
} from './actions';

import { LOAD, SAVE } from 'redux-storage';

type GlobalState = any;

const defaultState: GlobalState = {
  savedTracks: [],
  foundTracks: [],
  isLoading: false
};

export default function reducer(state = defaultState, action): GlobalState {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isLoading: false,
        isSearching: false,
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
        foundTracks: state.foundTracks,
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
          foundTracks: state.foundTracks
        }
      } else {
        state.savedTracks[state.selectedIndex.index].source = action.source;
        state.savedTracks[state.selectedIndex.index].sourceDate = new Date();
        return {
          ...state,
          savedTracks: state.savedTracks
        }
      }


    default:
      return state;
  }
}
