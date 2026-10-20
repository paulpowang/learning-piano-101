import test from 'node:test';
import assert from 'node:assert/strict';
import {midiPitch,staffY,scoreRows,scoreAccidentals} from '../music.js';
import {songs,normalizeProgress} from '../curriculum.js';

test('bass and treble ledger/space positions match pitch and octave',()=>{
  assert.equal(midiPitch('C3'),48);assert.equal(midiPitch('C4'),60);
  assert.equal(midiPitch('Db4'),midiPitch('C#4'));assert.equal(midiPitch('Bb4'),70);assert.equal(midiPitch('F#3'),54);assert.equal(midiPitch('A4'),69);
  assert.equal(staffY('E4'),84);assert.equal(staffY('C4'),94);
  assert.equal(staffY('G2',true),84);assert.equal(staffY('C3',true),69);
  assert.equal(staffY('C4',true),34);
});
test('score has complete four-beat measures and two complete verses with aligned durations',()=>{
  for(const song of songs){
    assert.equal(song.notes.length,song.beats.length);
    assert.deepEqual(song.notes.slice(0,song.verseLength),song.notes.slice(song.verseLength));
    assert.deepEqual(song.beats.slice(0,song.verseLength),song.beats.slice(song.verseLength));
    for(const count of [4,8]){
      const rows=scoreRows(song,count);
      assert.deepEqual(rows.flat().map(n=>n.note),song.notes);
      assert.ok(rows.every(row=>row.reduce((sum,n)=>sum+n.duration,0)===count));
    }
  }
  assert.equal(normalizeProgress({showShortcuts:false}).showShortcuts,false);
});


test('new categories have three tunes each and accidentals cancel only within their measure',()=>{
 for(const category of ['high','bass','accidentals'])assert.equal(songs.filter(s=>s.category===category).length,3);
 const signs=scoreAccidentals({notes:['F#4','F4','F4','F#4','F4','Bb4','B4','B4'],beats:Array(8).fill(1)});
 assert.deepEqual(signs,['♯','♮','','♯','','♭','♮','']);
});
