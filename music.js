// Diatonic staff positions and duration-aware score rows, independent of the UI.
export function midiPitch(note) {
  const [,letter,sharp,octave]=/^([A-G])([#b]?)(\d)$/.exec(note);
  return (Number(octave)+1)*12+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter]+(sharp==='#'?1:sharp==='b'?-1:0);
}
export function staffY(note,bass=false) {
  const step=Number(note.at(-1))*7+'CDEFGAB'.indexOf(note[0]);
  // Bottom line: E4 in treble, G2 in bass. Adjacent notes are 5 SVG units apart.
  return 84-(step-(bass?18:30))*5;
}
export function scoreRows(song,beatsPerRow=4) {
  const rows=[];let row=[],beats=0;
  song.notes.forEach((note,index)=>{
    const duration=song.beats[index]||1;
    if(beats+duration>beatsPerRow&&row.length){rows.push(row);row=[];beats=0;}
    row.push({note,index,duration,beat:beats});beats+=duration;
    if(beats>=beatsPerRow){rows.push(row);row=[];beats=0;}
  });
  if(row.length)rows.push(row);
  return rows;
}

export function scoreAccidentals(song) {
  let beat=0;const active=new Map();
  return song.notes.map((note,i)=>{
    if(beat%4===0)active.clear();
    const pitch=note[0]+note.at(-1),sign=note.includes('#')?'♯':note.includes('b')?'♭':'';
    const result=sign||(active.get(pitch)?'♮':'');
    active.set(pitch,sign);beat+=song.beats[i]||1;
    return result;
  });
}
