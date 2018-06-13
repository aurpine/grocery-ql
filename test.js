data = {
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
   };
console.log(data);
console.log(data.Item);
console.log(data['Item'])
console.log(data.Item.AlbumTitle);
console.log(data['Item']['AlbumTitle']);

x = {}
x['wow'] = 1
console.log(x);