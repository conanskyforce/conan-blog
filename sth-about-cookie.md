### cookie
```javascript
const setCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const setCookie = (name,value,options = {}) => {
  options = {
    path: '/',
    // 如果需要，可以在这里添加其他默认值
    ...options
  };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
// 使用范例：
setCookie('user', 'John', {secure: true, 'max-age': 3600});

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

```

## 总结
document.cookie 提供了对 cookie 的访问

- 写入操作只会修改其中提到的 cookie。
- name/value 必须被编码。
- 一个 cookie 最大为 4kb，每个网站最多有 20+ 个左右的 cookie（具体取决于浏览器）。

Cookie 选项：

- path=/，默认为当前路径，使 cookie 仅在该路径下可见。
- domain=site.com，默认 cookie 仅在当前域下可见，如果显式设置了域，可以使 cookie 在子域下也可见。
- expires 或 max-age 设置 cookie 过期时间，如果没有设置，则当浏览器关闭时 cookie 就失效了。
- secure 使 cookie 仅在 HTTPS 下有效。
- samesite，如果请求来自外部网站，禁止浏览器发送 cookie，这有助于防止 XSRF 攻击。
另外：

- 浏览器可能会禁用第三方 cookie，例如 Safari 浏览器默认禁止所有第三方 cookie。
- 在为欧盟公民设置跟踪 cookie 时，GDPR 要求必须得到用户明确许可。