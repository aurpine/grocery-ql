function parse(obj) {
    if(obj.hasOwnProperty('S')) {
      return obj.S;
    } else if(obj.hasOwnProperty('N')) {
      return parseFloat(obj.N);
    } else if(obj.hasOwnProperty('SS')) {
      return map(obj.SS.substr(1, obj.SS.length-1).split(', '), i => i.substr(1, i.length-1));
    } else if(obj.hasOwnProperty('NS')) {
      return map(obj.NS.substr(1, obj.NS.length-1).split(', '), i => parseInt(i.substr(1, i.length-1)));
    } else if(obj.hasOwnProperty('M')) {
      for(var key in obj.M) {
        obj.M[key] = parse(obj.M[key]);
      }
      return obj.M;
    } else if(obj.hasOwnProperty('L')) {
      return obj.L;
    } else if(obj.hasOwnProperty('NULL')) {
      return null;
    } else if(obj.hasOwnProperty('BOOL')) {
      return obj.BOOL;
    } else {
      for(var key in obj) {
        obj[key] = parse(obj[key]);
      }
      return obj;
    }
  }

console.log(parse({
    Item: {
     "AlbumTitle": {
       S: "Songs About Life"
      }, 
     "Artist": {
       S: "Acme Band"
      }, 
     "SongTitle": {
       S: "Happy Day"
      }
    }
   }
));
