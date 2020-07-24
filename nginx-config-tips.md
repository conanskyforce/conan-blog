# nginx相关采坑

## proxy_pass 后边是否带斜杠的区别

```shell
server {
  ...
  location /webApi {
    proxy_pass http://someApi.com; # will visit http://someApi.com/webApi/a.html
    proxy_pass http://someApi.com/; # will visit http://someApi.com/a.thml
  }
  ...
}

```
*总结*
<kbd>proxy_pass</kbd>后边带/会重写 location的值

## root, alias 重写规则

```shell
server {
  ...
  location / {
    root /share/nginx/html;
  }
  location /assets {
    root /share/nginx/html/resources; # will visit /share/nginx/html/resources/assets/a.html
    alias /share/nginx/html/resources; # will visit /share/nginx/html/resources/a.html
  }
  ...
}

```

*总结*

alias 是将 location后边的地址 直接*替换*为 alias 之后的地址
```
location /images/ 
alias /a/b/c
visit xxx.dc.xx/images/1.png
actually /a/b/c1.png  !!(watch out)
```
root 是将location后边的地址*拼接*
```
location /images/ 
alias /a/b/c
visit xxx.dc.xx/images/1.png
actually /a/b/c/images/1.png  !!(watch out)
```