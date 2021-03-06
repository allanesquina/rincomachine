// Filters for dox json
var get = {};
var m = {};

var Markdown = require('markdown').markdown;

get.tags = function (type, data) {
   if(data.length && data.length === 0) return false;
   return data.tags.filter(function(tag) {
        return tag.type === type;
   });
};

get.all = function (type, data) {
  if(data.length && data.length === 0) return false;
   return data.filter(function(tag) {
        return (item.hasOwnProperty('ctx') && item.ctx.type === type)
    })
};

get.className = function (obj) {

  var buf = {};
  buf.name = obj;
  switch (obj.toLowerCase().trim()) {
    case 'string':
        buf.css = 'primary';
      break;
    case 'object':
        buf.css = 'default';
      break;
    case 'function':
        buf.css = 'success';
      break;
    case 'array':
        buf.css = 'warning';
      break;
    case 'boolean':
        buf.css = 'info';
      break;
    default:
      buf.css = 'default';
      break;
  }
  return buf;
};

get.typeClass = function (arr) {
  arr = arr.map(function (item) {
    item.types = item.types.map(function (obj) {
      return get.className(obj);
    });

    return item;
  });
  return arr;
};

m.process = function (obj) {
    switch (obj.ctx.type) {
      case 'method':
          obj = (function (obj) {
            try {
              var buf ={}, params, returns;
              params = get.tags('param', obj);
              buf.name = get.tags('name', obj);
              buf.params = get.typeClass(params);
              var joinParams = buf.params.map(function (obj) {
                  if(obj) {
                    return obj.name + ':' + obj.types.map(function (o) {
                        return o.name;
                    }).join('|');
                  }
              }).join(' , ');
              buf.str = obj.ctx && obj.ctx.name ? ((obj.ctx && obj.ctx.receiver + '.' || '') +  obj.ctx.name  + ' (' +  joinParams + ')') : '';
              buf.example = get.tags('example', obj);
              returns = get.tags('return', obj);
              buf.returns = get.typeClass(returns);
              buf.all = obj;
              return buf;
            } catch(err) {
              // return err;
            }
          }(obj));
        //
        break;
      case 'property':
            try {
              obj.type = get.className(get.tags('type', obj)[0].string);
            } catch (e) {}
            return obj;
        break;
      case 'constructor':
        //
        break;
      case 'declaration':
        //
        break;
      default:
    }
    // console.log(obj);
    return obj;
}

module.exports = function (json) {
  var buf = {};
    // Grouping types
  buf = json
  .reduce(function (types, obj, i) {
    if(!(obj.ctx && obj.ctx.type)) return types;

    var type = obj.ctx.type.trim().toLowerCase();
    if(typeof type === 'string') {
      obj = m.process(obj);
      if(types.hasOwnProperty(type)) {
        types[type].push(obj);
      } else {
        types[type] = [obj];
      }
    }
    return types;
  }, {});
  console.log(buf['method']);
  return buf;
};
