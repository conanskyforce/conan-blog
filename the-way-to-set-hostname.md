## 设置hostname的几种方式

edit /etc/sysconfig/network

echo [yourhostname] > /proc/sys/kernel/hostname

hostnamectl set-hostname [yourhostname]

