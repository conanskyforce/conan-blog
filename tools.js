// cookie 管理
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

/**
 * 生成网页水印
 * 通过canvas 生成图片
 * 通过全局遮盖一个div实现
 */
function watermark(text) {
  var container = document.body,
      width = '200px',
      height = '150px',
      textAlign = 'center',
      textBaseline = 'middle',
      font = "20px microsoft yahei",
      fillStyle = 'rgba(184, 184, 184, 0.8)',
      content = text || '请勿外传',
      rotate = 30,
      zIndex = 1000;
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  var ctx = canvas.getContext("2d");
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate(Math.PI / 180 * rotate);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);
  var base64Url = canvas.toDataURL();//用作水印的图片url
  var watermarkDiv = document.createElement("div");//用作水印的div遮罩层
  var styleList = [];
  styleList.push('position:absolute');
  styleList.push('top:0');
  styleList.push('left:0');
  styleList.push('bottom:0');
  styleList.push('right:0');
  styleList.push('right:0');
  styleList.push('z-index:' + zIndex);
  styleList.push('pointer-events:none');
  styleList.push('background-repeat:repeat');
  styleList.push('background-image:url(' + base64Url + ')');
  watermarkDiv.setAttribute('style', styleList.join(';'));
  container.style.position = 'relative';
  container.insertBefore(watermarkDiv, container.firstChild);
}
// 调用
// watermark('我是水印');
