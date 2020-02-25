// Deserialize query string
export const queryStringToJSON = (qs) => {
  if (!qs) {
    return {}
  }
  qs = qs.slice(1);

  const pairs = qs.split('&');
  let result = {};
  pairs.forEach(function(p) {
    let pair = p.split('=');
    let key = pair[0];
    let value = decodeURIComponent(pair[1] || '');

    if (result[key]) {
      if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
        result[key].push( value );
      } else {
        result[key] = [ result[key], value ];
      }
    } else {
      result[key] = value;
    }
  });

  return JSON.parse(JSON.stringify(result));
};