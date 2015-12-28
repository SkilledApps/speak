import React from 'react-native';

const { AsyncStorage } = React;

const TimestampsAPI = {
  restore(key) {
    return AsyncStorage.getItem('timestamps.' + key);
  },
  persist(key, value) {
    return AsyncStorage.setItem('timestamps.' + key, JSON.stringify(value));
  },
  addTimestamp(timestamps, time) {
    // TODO: more validation
    const isDublicate = timestamps && timestamps.filter(t => t.time === time || Math.abs(t.time - time)*1000 < 200).length > 0 // 200 ms thrueshold
    if (isDublicate) {
      alert('it is dublicate, so ignore it (TODO: disable this alert');
      return timestamps;
    } else {
      const newTimestamp = {
        title: '<no title>',
        isMuted: false,
        time
      }

      return timestamps ? timestamps.concat([newTimestamp]).sort((a, b) => b.time - a.time) : [newTimestamp];
    }
  },
  deleteTimestamp(timestamps, index) {
    return timestamps.slice(0, index).concat(timestamps.slice(index + 1));
  },
  moveTimestamp(timestamps, index, delta) {
    const changedMarker = timestamps[index];
    changedMarker.time = Math.round((changedMarker.time + delta) * 100) / 100;
    return timestamps.slice(0, index).concat([changedMarker], timestamps.slice(index + 1));
  },
  getIndexByTime(timestamps, time) {
    const index = timestamps.filter(t => t.time > time);
    console.log('current position:', index.length, timestamps.length);
    return index.length;
    // if (index.length > 0 && index.length < timestamps.length) {
    //   return index.length;
    // } else {
    //   return timestamps.length - 1;
    // }
  }
}


module.exports = TimestampsAPI;

//
// getNextChapter() {
//   let currentChapterIndex = this.state.currentChapterIndex;
//   if (debug) console.log('currentChapterIndex', currentChapterIndex);
//   let nextChapterIndex = currentChapterIndex+1;
//   let chapters = this.state.chapters;
//   let nextChapter = chapters[nextChapterIndex];
//   if (debug) console.log('chapters', chapters);
//   if (debug) console.log('nextChapter', nextChapter);
//   if (nextChapter === undefined) {
//     return false;
//   }
//   this.startChapter(
//     nextChapter.start,
//     nextChapter,
//     nextChapterIndex,
//   );
// }
//
// getPrevChapter() {
//   let currentChapterIndex = this.state.currentChapterIndex;
//   if (debug) console.log('currentChapterIndex', currentChapterIndex);
//   let nextChapterIndex = currentChapterIndex > 0 ? currentChapterIndex -1 : currentChapterIndex;
//   let chapters = this.state.chapters;
//   let nextChapter = chapters[nextChapterIndex];
//   if (debug) console.log('chapters', chapters);
//   if (debug) console.log('nextChapter', nextChapter);
//   if (nextChapter === undefined) {
//     return false;
//   }
//   this.startChapter(
//     nextChapter.start,
//     nextChapter,
//     nextChapterIndex,
//   );
// }

// editStartTime(index) {
//   let chapters = this.state.chapters;
//   let chapter = chapters[index];
//   if (debug) console.log('OLD CHAPTER', chapter);
//   chapter.start = +chapter.start > 0.5 ? +chapter.start - 1 : 0;
//   chapters[index] = chapter;
//   this.setState({chapters});
//   if (debug) console.log('NEW CHAPTER', chapter);
//   if (debug) console.log('OLD CHAPTERS', chapters);
// }
//
// editEndTime(index) {
//   let chapters = this.state.chapters;
//   let chapter = chapters[index];
//   if (debug) console.log('OLD CHAPTER', chapter);
//   chapter.end = +chapter.end ? +chapter.end + 1 : +chapter.end + 1;
//   chapters[index] = chapter;
//   this.setState({chapters});
//   if (debug) console.log('NEW CHAPTER', chapter);
//   if (debug) console.log('OLD CHAPTERS', chapters);
// }

// createChapter(time) {
//   var chapter = this.state.chapters;
//   const chapterName = chapter.length ? 'chapter' + chapter.length  : 'chapter1';
//
//   if (this.state.chapters.length === 0) {
//     chapter = chapter.push({'chapterName' : chapterName, 'start': 0, 'end': Math.round(time, -2)});
//   } else {
//     var item = chapter.length > 0 ? chapter[chapter.length - 1] : chapter[0];
//     if (item === undefined) {
//       if (debug) console.log('ERROR', chapter.length);
//       if (debug) console.log('ERROR', item);
//       return false;
//     }
//     if (item.end > Math.round(time, -2))
//     { return false; }
//     chapter = chapter
//       .push(
//         {
//           'chapterName' : chapterName,
//           start: item.end,
//           end: Math.round(time, -2)
//         });
//   }
//   this.setState({chapter});
//   LayoutAnimation.easeInEaseOut();
//   if (debug) console.log('CHAPTER', this.state.chapters);
// }
