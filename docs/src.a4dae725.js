parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"aiJW":[function(require,module,exports) {

},{}],"il2D":[function(require,module,exports) {
"use strict";function e(e,r,t){void 0===t&&(t={});var o={type:"Feature"};return(0===t.id||t.id)&&(o.id=t.id),t.bbox&&(o.bbox=t.bbox),o.properties=r||{},o.geometry=e,o}function r(e,r,o){switch(void 0===o&&(o={}),e){case"Point":return t(r).geometry;case"LineString":return s(r).geometry;case"Polygon":return n(r).geometry;case"MultiPoint":return m(r).geometry;case"MultiLineString":return d(r).geometry;case"MultiPolygon":return c(r).geometry;default:throw new Error(e+" is invalid")}}function t(r,t,o){return void 0===o&&(o={}),e({type:"Point",coordinates:r},t,o)}function o(e,r,o){return void 0===o&&(o={}),u(e.map(function(e){return t(e,r)}),o)}function n(r,t,o){void 0===o&&(o={});for(var n=0,i=r;n<i.length;n++){var s=i[n];if(s.length<4)throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");for(var a=0;a<s[s.length-1].length;a++)if(s[s.length-1][a]!==s[0][a])throw new Error("First and last Position are not equivalent.")}return e({type:"Polygon",coordinates:r},t,o)}function i(e,r,t){return void 0===t&&(t={}),u(e.map(function(e){return n(e,r)}),t)}function s(r,t,o){if(void 0===o&&(o={}),r.length<2)throw new Error("coordinates must be an array of two or more positions");return e({type:"LineString",coordinates:r},t,o)}function a(e,r,t){return void 0===t&&(t={}),u(e.map(function(e){return s(e,r)}),t)}function u(e,r){void 0===r&&(r={});var t={type:"FeatureCollection"};return r.id&&(t.id=r.id),r.bbox&&(t.bbox=r.bbox),t.features=e,t}function d(r,t,o){return void 0===o&&(o={}),e({type:"MultiLineString",coordinates:r},t,o)}function m(r,t,o){return void 0===o&&(o={}),e({type:"MultiPoint",coordinates:r},t,o)}function c(r,t,o){return void 0===o&&(o={}),e({type:"MultiPolygon",coordinates:r},t,o)}function l(r,t,o){return void 0===o&&(o={}),e({type:"GeometryCollection",geometries:r},t,o)}function h(e,r){if(void 0===r&&(r=0),r&&!(r>=0))throw new Error("precision must be a positive number");var t=Math.pow(10,r||0);return Math.round(e*t)/t}function p(e,r){void 0===r&&(r="kilometers");var t=exports.factors[r];if(!t)throw new Error(r+" units is invalid");return e*t}function f(e,r){void 0===r&&(r="kilometers");var t=exports.factors[r];if(!t)throw new Error(r+" units is invalid");return e/t}function x(e,r){return w(f(e,r))}function g(e){var r=e%360;return r<0&&(r+=360),r}function w(e){return 180*(e%(2*Math.PI))/Math.PI}function b(e){return e%360*Math.PI/180}function v(e,r,t){if(void 0===r&&(r="kilometers"),void 0===t&&(t="kilometers"),!(e>=0))throw new Error("length must be a positive number");return p(f(e,r),t)}function y(e,r,t){if(void 0===r&&(r="meters"),void 0===t&&(t="kilometers"),!(e>=0))throw new Error("area must be a positive number");var o=exports.areaFactors[r];if(!o)throw new Error("invalid original units");var n=exports.areaFactors[t];if(!n)throw new Error("invalid final units");return e/o*n}function E(e){return!isNaN(e)&&null!==e&&!Array.isArray(e)&&!/^\s*$/.test(e)}function R(e){return!!e&&e.constructor===Object}function P(e){if(!e)throw new Error("bbox is required");if(!Array.isArray(e))throw new Error("bbox must be an Array");if(4!==e.length&&6!==e.length)throw new Error("bbox must be an Array of 4 or 6 numbers");e.forEach(function(e){if(!E(e))throw new Error("bbox must only contain numbers")})}function T(e){if(!e)throw new Error("id is required");if(-1===["string","number"].indexOf(typeof e))throw new Error("id must be a number or a string")}function M(){throw new Error("method has been renamed to `radiansToDegrees`")}function k(){throw new Error("method has been renamed to `degreesToRadians`")}function A(){throw new Error("method has been renamed to `lengthToDegrees`")}function L(){throw new Error("method has been renamed to `lengthToRadians`")}function D(){throw new Error("method has been renamed to `radiansToLength`")}function F(){throw new Error("method has been renamed to `bearingToAzimuth`")}function S(){throw new Error("method has been renamed to `convertLength`")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.earthRadius=6371008.8,exports.factors={centimeters:100*exports.earthRadius,centimetres:100*exports.earthRadius,degrees:exports.earthRadius/111325,feet:3.28084*exports.earthRadius,inches:39.37*exports.earthRadius,kilometers:exports.earthRadius/1e3,kilometres:exports.earthRadius/1e3,meters:exports.earthRadius,metres:exports.earthRadius,miles:exports.earthRadius/1609.344,millimeters:1e3*exports.earthRadius,millimetres:1e3*exports.earthRadius,nauticalmiles:exports.earthRadius/1852,radians:1,yards:exports.earthRadius/1.0936},exports.unitsFactors={centimeters:100,centimetres:100,degrees:1/111325,feet:3.28084,inches:39.37,kilometers:.001,kilometres:.001,meters:1,metres:1,miles:1/1609.344,millimeters:1e3,millimetres:1e3,nauticalmiles:1/1852,radians:1/exports.earthRadius,yards:1/1.0936},exports.areaFactors={acres:247105e-9,centimeters:1e4,centimetres:1e4,feet:10.763910417,inches:1550.003100006,kilometers:1e-6,kilometres:1e-6,meters:1,metres:1,miles:3.86e-7,millimeters:1e6,millimetres:1e6,yards:1.195990046},exports.feature=e,exports.geometry=r,exports.point=t,exports.points=o,exports.polygon=n,exports.polygons=i,exports.lineString=s,exports.lineStrings=a,exports.featureCollection=u,exports.multiLineString=d,exports.multiPoint=m,exports.multiPolygon=c,exports.geometryCollection=l,exports.round=h,exports.radiansToLength=p,exports.lengthToRadians=f,exports.lengthToDegrees=x,exports.bearingToAzimuth=g,exports.radiansToDegrees=w,exports.degreesToRadians=b,exports.convertLength=v,exports.convertArea=y,exports.isNumber=E,exports.isObject=R,exports.validateBBox=P,exports.validateId=T,exports.radians2degrees=M,exports.degrees2radians=k,exports.distanceToDegrees=A,exports.distanceToRadians=L,exports.radiansToDistance=D,exports.bearingToAngle=F,exports.convertDistance=S;
},{}],"MNc+":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@turf/helpers");function t(e,r,n){if(null!==e)for(var o,i,a,u,l,s,c,g,f=0,p=0,h=e.type,y="FeatureCollection"===h,d="Feature"===h,v=y?e.features.length:1,P=0;P<v;P++){l=(g=!!(c=y?e.features[P].geometry:d?e.geometry:e)&&"GeometryCollection"===c.type)?c.geometries.length:1;for(var m=0;m<l;m++){var w=0,x=0;if(null!==(u=g?c.geometries[m]:c)){s=u.coordinates;var b=u.type;switch(f=!n||"Polygon"!==b&&"MultiPolygon"!==b?0:1,b){case null:break;case"Point":if(!1===r(s,p,P,w,x))return!1;p++,w++;break;case"LineString":case"MultiPoint":for(o=0;o<s.length;o++){if(!1===r(s[o],p,P,w,x))return!1;p++,"MultiPoint"===b&&w++}"LineString"===b&&w++;break;case"Polygon":case"MultiLineString":for(o=0;o<s.length;o++){for(i=0;i<s[o].length-f;i++){if(!1===r(s[o][i],p,P,w,x))return!1;p++}"MultiLineString"===b&&w++,"Polygon"===b&&x++}"Polygon"===b&&w++;break;case"MultiPolygon":for(o=0;o<s.length;o++){for(x=0,i=0;i<s[o].length;i++){for(a=0;a<s[o][i].length-f;a++){if(!1===r(s[o][i][a],p,P,w,x))return!1;p++}x++}w++}break;case"GeometryCollection":for(o=0;o<u.geometries.length;o++)if(!1===t(u.geometries[o],r,n))return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}function r(e,r,n,o){var i=n;return t(e,function(e,t,o,a,u){i=0===t&&void 0===n?e:r(i,e,t,o,a,u)},o),i}function n(e,t){var r;switch(e.type){case"FeatureCollection":for(r=0;r<e.features.length&&!1!==t(e.features[r].properties,r);r++);break;case"Feature":t(e.properties,0)}}function o(e,t,r){var o=r;return n(e,function(e,n){o=0===n&&void 0===r?e:t(o,e,n)}),o}function i(e,t){if("Feature"===e.type)t(e,0);else if("FeatureCollection"===e.type)for(var r=0;r<e.features.length&&!1!==t(e.features[r],r);r++);}function a(e,t,r){var n=r;return i(e,function(e,o){n=0===o&&void 0===r?e:t(n,e,o)}),n}function u(e){var r=[];return t(e,function(e){r.push(e)}),r}function l(e,t){var r,n,o,i,a,u,l,s,c,g,f=0,p="FeatureCollection"===e.type,h="Feature"===e.type,y=p?e.features.length:1;for(r=0;r<y;r++){for(u=p?e.features[r].geometry:h?e.geometry:e,s=p?e.features[r].properties:h?e.properties:{},c=p?e.features[r].bbox:h?e.bbox:void 0,g=p?e.features[r].id:h?e.id:void 0,a=(l=!!u&&"GeometryCollection"===u.type)?u.geometries.length:1,o=0;o<a;o++)if(null!==(i=l?u.geometries[o]:u))switch(i.type){case"Point":case"LineString":case"MultiPoint":case"Polygon":case"MultiLineString":case"MultiPolygon":if(!1===t(i,f,s,c,g))return!1;break;case"GeometryCollection":for(n=0;n<i.geometries.length;n++)if(!1===t(i.geometries[n],f,s,c,g))return!1;break;default:throw new Error("Unknown Geometry Type")}else if(!1===t(null,f,s,c,g))return!1;f++}}function s(e,t,r){var n=r;return l(e,function(e,o,i,a,u){n=0===o&&void 0===r?e:t(n,e,o,i,a,u)}),n}function c(t,r){l(t,function(t,n,o,i,a){var u,l=null===t?null:t.type;switch(l){case null:case"Point":case"LineString":case"Polygon":return!1!==r(e.feature(t,o,{bbox:i,id:a}),n,0)&&void 0}switch(l){case"MultiPoint":u="Point";break;case"MultiLineString":u="LineString";break;case"MultiPolygon":u="Polygon"}for(var s=0;s<t.coordinates.length;s++){var c={type:u,coordinates:t.coordinates[s]};if(!1===r(e.feature(c,o),n,s))return!1}})}function g(e,t,r){var n=r;return c(e,function(e,o,i){n=0===o&&0===i&&void 0===r?e:t(n,e,o,i)}),n}function f(r,n){c(r,function(r,o,i){var a=0;if(r.geometry){var u=r.geometry.type;if("Point"!==u&&"MultiPoint"!==u){var l,s=0,c=0,g=0;return!1!==t(r,function(t,u,f,p,h){if(void 0===l||o>s||p>c||h>g)return l=t,s=o,c=p,g=h,void(a=0);var y=e.lineString([l,t],r.properties);if(!1===n(y,o,i,h,a))return!1;a++,l=t})&&void 0}}})}function p(e,t,r){var n=r,o=!1;return f(e,function(e,i,a,u,l){n=!1===o&&void 0===r?e:t(n,e,i,a,u,l),o=!0}),n}function h(t,r){if(!t)throw new Error("geojson is required");c(t,function(t,n,o){if(null!==t.geometry){var i=t.geometry.type,a=t.geometry.coordinates;switch(i){case"LineString":if(!1===r(t,n,o,0,0))return!1;break;case"Polygon":for(var u=0;u<a.length;u++)if(!1===r(e.lineString(a[u],t.properties),n,o,u))return!1}}})}function y(e,t,r){var n=r;return h(e,function(e,o,i,a){n=0===o&&void 0===r?e:t(n,e,o,i,a)}),n}function d(t,r){if(r=r||{},!e.isObject(r))throw new Error("options is invalid");var n,o=r.featureIndex||0,i=r.multiFeatureIndex||0,a=r.geometryIndex||0,u=r.segmentIndex||0,l=r.properties;switch(t.type){case"FeatureCollection":o<0&&(o=t.features.length+o),l=l||t.features[o].properties,n=t.features[o].geometry;break;case"Feature":l=l||t.properties,n=t.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":n=t;break;default:throw new Error("geojson is invalid")}if(null===n)return null;var s=n.coordinates;switch(n.type){case"Point":case"MultiPoint":return null;case"LineString":return u<0&&(u=s.length+u-1),e.lineString([s[u],s[u+1]],l,r);case"Polygon":return a<0&&(a=s.length+a),u<0&&(u=s[a].length+u-1),e.lineString([s[a][u],s[a][u+1]],l,r);case"MultiLineString":return i<0&&(i=s.length+i),u<0&&(u=s[i].length+u-1),e.lineString([s[i][u],s[i][u+1]],l,r);case"MultiPolygon":return i<0&&(i=s.length+i),a<0&&(a=s[i].length+a),u<0&&(u=s[i][a].length-u-1),e.lineString([s[i][a][u],s[i][a][u+1]],l,r)}throw new Error("geojson is invalid")}function v(t,r){if(r=r||{},!e.isObject(r))throw new Error("options is invalid");var n,o=r.featureIndex||0,i=r.multiFeatureIndex||0,a=r.geometryIndex||0,u=r.coordIndex||0,l=r.properties;switch(t.type){case"FeatureCollection":o<0&&(o=t.features.length+o),l=l||t.features[o].properties,n=t.features[o].geometry;break;case"Feature":l=l||t.properties,n=t.geometry;break;case"Point":case"MultiPoint":return null;case"LineString":case"Polygon":case"MultiLineString":case"MultiPolygon":n=t;break;default:throw new Error("geojson is invalid")}if(null===n)return null;var s=n.coordinates;switch(n.type){case"Point":return e.point(s,l,r);case"MultiPoint":return i<0&&(i=s.length+i),e.point(s[i],l,r);case"LineString":return u<0&&(u=s.length+u),e.point(s[u],l,r);case"Polygon":return a<0&&(a=s.length+a),u<0&&(u=s[a].length+u),e.point(s[a][u],l,r);case"MultiLineString":return i<0&&(i=s.length+i),u<0&&(u=s[i].length+u),e.point(s[i][u],l,r);case"MultiPolygon":return i<0&&(i=s.length+i),a<0&&(a=s[i].length+a),u<0&&(u=s[i][a].length-u),e.point(s[i][a][u],l,r)}throw new Error("geojson is invalid")}exports.coordEach=t,exports.coordReduce=r,exports.propEach=n,exports.propReduce=o,exports.featureEach=i,exports.featureReduce=a,exports.coordAll=u,exports.geomEach=l,exports.geomReduce=s,exports.flattenEach=c,exports.flattenReduce=g,exports.segmentEach=f,exports.segmentReduce=p,exports.lineEach=h,exports.lineReduce=y,exports.findSegment=d,exports.findPoint=v;
},{"@turf/helpers":"il2D"}],"lhdg":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@turf/meta");function r(r){var t=[1/0,1/0,-1/0,-1/0];return e.coordEach(r,function(e){t[0]>e[0]&&(t[0]=e[0]),t[1]>e[1]&&(t[1]=e[1]),t[2]<e[0]&&(t[2]=e[0]),t[3]<e[1]&&(t[3]=e[1])}),t}exports.default=r;
},{"@turf/meta":"MNc+"}],"J3VH":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("@turf/bbox"));function t(e){return e&&e.__esModule?e:{default:e}}var r={type:"Polygon",coordinates:[[[61.23882293701172,55.13826611409422],[61.360359191894524,55.13826611409422],[61.360359191894524,55.223344564576664],[61.23882293701172,55.223344564576664],[61.23882293701172,55.13826611409422]]]},o=(0,e.default)(r);exports.default=o;
},{"@turf/bbox":"lhdg"}],"vp4F":[function(require,module,exports) {
module.exports="data.782f1299.geojson";
},{}],"H99C":[function(require,module,exports) {
"use strict";require("./styles.scss");var t=n(require("./bounds")),e=n(require("./data.geojson"));function n(t){return t&&t.__esModule?t:{default:t}}var o="2010",r=!1,i=document.getElementById("slider-snap");noUiSlider.create(i,{range:{min:2010,"25%":2014,"40%":2015,"55%":2016,"70%":2017,"85%":2018,max:2019},start:[o],snap:!0,connect:!0,pips:{mode:"steps",stepped:!0,density:-1}});var s=new mapboxgl.Map({container:"map",attributionControl:!1,style:{version:8,sources:{osm:{type:"raster",tiles:["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"],attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',tileSize:256}},layers:[{id:"osm",source:"osm",type:"raster"}]},center:[61.2756148940565,55.142590470969964],zoom:12});s.addControl(new mapboxgl.AttributionControl,"top-right");var a=["2010","2014","2015","2016","2017","2018","2019"].reverse(),c={DIFF:{colors:["#A82A2A","#FFB366","#15B371"],names:["Новые","В процессе","Завершен"]},PLAIN:{colors:["#A82A2A"],names:["Стройплощадки"]}},l={PLAIN:["match",["get","type"],"new","#A82A2A","in_progress","#A82A2A","done","#15B371","#6e599f"],DIFF:["match",["get","type"],"new","#A82A2A","in_progress","#FFB366","done","#15B371","#6e599f"]};function u(){return{year:h(i.noUiSlider.get()),showDiff:document.getElementById("set-done").checked}}function d(t){r&&console.log("load",t),s.setLayoutProperty(t,"visibility","visible")}function p(t){r&&console.log("unload",t),s.setLayoutProperty(t,"visibility","none")}function f(t){r&&console.log("hide",t),s.setPaintProperty(t,"raster-opacity",0)}function y(t){r&&console.log("show",t),s.setPaintProperty(t,"raster-opacity",1)}function m(t){a.filter(function(e){return e!==t}).map(f)}function g(){var t=u(),e=["all",["==","year",t.year]];t.showDiff?(s.setPaintProperty("constructions-fills","fill-color",l.DIFF),b(c.DIFF)):(e=e.concat([["!=","type","done"]]),s.setPaintProperty("constructions-fills","fill-color",l.PLAIN),b(c.PLAIN)),s.setFilter("constructions-fills",e)}function h(t){return parseInt(t,10).toString()}function v(e){var n="raster-".concat(e),o="".concat(e),r="https://rasters.aeronetlab.space/api/v0/cogs/tiles/{z}/{x}/{y}.png?uri=s3://demos/constructions/chelyabinsk/".concat(e,".tif");s.addSource(n,{type:"raster",tiles:[r],tileSize:256,attribution:"&copy; MAXAR",bounds:t.default}),s.addLayer({id:o,type:"raster",source:n,paint:{"raster-opacity":0},layout:{visibility:"none"}})}var A=document.getElementById("swatches");function b(t){A.innerHTML="",t.colors.forEach(function(e,n){var o=document.createElement("div"),r=document.createElement("div"),i=document.createElement("div");i.innerHTML=t.names[n],r.className="swatch-color",r.style.backgroundColor=e,o.appendChild(r),o.appendChild(i),A.appendChild(o)})}function P(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){return!0};return function(n,o){var r=a.indexOf(n)+o;if(void 0!==a[r]){var i=a[r];e(i)&&t(i)}}}var w=new Set,I=function(t){w.add(t),d(t)},F=P(I),L=P(p,function(t){return!w.has(t)});function C(){var t=u().year;r&&console.log("-------\x3e",t),I(t),y(t),B(200).then(function(){m(t),F(t,1),F(t,-1),L(t,-2),L(t,2),r&&console.log("-------<",t)}),g()}function B(t){return new Promise(function(e){setTimeout(e,t)})}function E(t,e){return function(n){var o=this.lastCall;this.lastCall=Date.now(),o&&this.lastCall-o<=e&&clearTimeout(this.lastCallTimer),this.lastCallTimer=setTimeout(function(){return t(n)},e)}}s.on("load",function(){s.fitBounds(t.default),a.map(v),s.addSource("constructions",{type:"geojson",data:e.default}),s.addLayer({id:"constructions-fills",type:"fill",source:"constructions",paint:{"fill-opacity":.5,"fill-color":l.PLAIN}}),g(),document.getElementById("set-done").addEventListener("change",g),document.getElementById("unset-done").addEventListener("change",g),i.noUiSlider.on("update",E(C,210))});
},{"./styles.scss":"aiJW","./bounds":"J3VH","./data.geojson":"vp4F"}]},{},["H99C"], null)
//# sourceMappingURL=src.a4dae725.js.map