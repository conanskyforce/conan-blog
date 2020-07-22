# 玩转Linux 指南

## 多台服务器怎么玩转

> 很常见的一个场景就是买了很多台的服务器，然后每次想统一操作的时候都很麻烦, 这时候，就轮到我们的ansbile上场了

## step 1
  将主服务器的ssh公钥都复制进分服务器的authorized_keys里边, 
  这样你就可以批量操作这些服务器了
  你可以手动复制，但是最简单的方式还是通过ssh-copy-id的方式复制
但是手动复制之前，厉害可以设置别名的，端口的方式，设置服务器，而不是难看又不易识别的ip + 端口号
设置 ~/.ssh/config
```
Host shanghai
hostname xx.xxx.xx.xx
user ubuntu

Host guangzhou
hostname xx.xxx.xx.xx
user root

Host chengdu
hostname xx.xxx.xx.xx
port xxxx
user root

Host beijing
hostname xx.xxx.xx.xx
user xxx

Host lancer
user root
port xxx
hostname xx.xxx.xx.xx

Host tomotech
user root
port xxxx
hostname xx.xxx.xx.xx
```
然后copy每个服务器
```
ssh-copy-id shanghai
ssh-copy-id guangzhou
ssh-copy-id chengdu
ssh-copy-id beijing
ssh-copy-id lancer
```
## step 2
