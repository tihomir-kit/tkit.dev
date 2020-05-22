---
title: TP-Link WR703N OpenWrt post installation tips
date: "2012-06-03T00:00:00.000Z"
description: What are some things you could do to your WR703N after installing OpenWrt on it to enhance its capabilities?
featuredImage: /assets/featured/tplink.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/43
tags: ["bash", "configuration", "dyndns", "extroot", "ip", "linux", "networking", "openwrt", "reflashing", "ssh", "tp-link", "wr703n"]
---

In this post I'll write down a few things I think are worth doing right after flashing your WR703N. The flashing itself is not covered in this post. For that, check out my [How to flash TP-Link WR703N with OpenWrt](/2012/06/03/how-to-flash-tp-link-wr703n-with-openwrt/) post.

####Setting up a static IP address

The first thing you should do is to assign a static IP address of your choice to your WR703N. There are three main reasons for doing this:

- Since your home router probably already uses 192.168.1.1, you will avoid having problems caused by conflicting IP addresses
- You will always know what the IP of your WR703N is and you will be able to connect to it from inside your network very fast
- Lastly, you will be able to make it work with DynDNS and port forwarding to connect to it from anywhere on the Internet

Connect your WR703N directly to your PC using ethernet cable, telnet to it (`telnet 192.168.1.1`) and then edit `/etc/config/network` ([Vi editor](https://wiki.archlinux.org/index.php/Vi#Basic_Editing) comes installed with OpenWrt, so you can use that). For example, to set the IP to 192.168.1.100 (assuming your network uses 192.168.1.X range and your home router is at 192.168.1.1), your lan interface section should look like this (do not change/remove the loopback interface part):

```
config interface 'lan'
  option ifname 'eth0'
  option type 'bridge'
  option proto 'static'
  option ipaddr '192.168.1.100'
  option netmask '255.255.255.0'
  option gateway '192.168.1.1'
  option dns '192.168.1.1'
```

Now run this command:

```
/etc/init.d/network restart
```

And after that, feel free to disconnect the WR703N from your computer and connect it to your router/switch (you will be able to access it on the IP address that you just set up).

####Enabling SSH / disabling telnet (setting up password)

Setting up the account password (using `passwd` command) will automatically disable telnet and enable Dropbear SSH daemon on port 22. Dropbear is an OpenSSH replacement designed for environments with low memory and processor resources (such as WR703N) and on OpenWrt it is installed by default instead of OpenSSH. You can easily [replace Dropbear with OpenSSH](http://wiki.openwrt.org/inbox/replacingdropbearbyopensshserver) if you want, but don't do it before setting up extroot (see the next subsection) or else you will run out of free space.

####Extroot - extending your memory with an external USB device

Extroot will allow you to use an external USB device to extend your internal memory which will enable you to install more packages onto your device (WR703N only has 4MB of flash memory which really isn't much). Since this is a bit more tricky and it depends on which version of OpenWrt you have installed as well as on what kind of USB stick you have, I believe it is better for you to go to [extroot wiki page](http://wiki.openwrt.org/doc/howto/extroot) and follow the steps provided there than for me to just copy all that stuff here.

####Installing GNU Screen and Vim

[GNU Screen](http://www.gnu.org/software/screen/) will allow you to have multiple screens (you can view them as tabs or virtual terminals) so you won't have to log in multiple times to have several terminals at once which is really, really handy. [Vim](http://www.vim.org/) is simply Vi improved. If you prefer another terminal editor (nano, joe..), go ahead and install that one.

```
opkg update
opkg install vim screen
```

If you're not familiar with screen, here are some [basics](https://wiki.archlinux.org/index.php/Screen#Basics).

####Installing the web interface

You might want to install the OpenWrt web interface - [LuCI](http://wiki.openwrt.org/doc/howto/luci.essentials) (you need to have extroot set up for this or you will run out of free space):

```
opkg update
opkg install luci
```

You will have to enable and start uhttpd daemon afterwards:

```
/etc/init.d/uhttpd enable
/etc/init.d/uhttpd start
```

Then you will be able to access the web interface by typing your WR703N's IP into your browser's URL bar.

####Switching to Bash / setting up .bashrc

OpenWrt comes with Ash shell. If you would like to use Bash instead, here is how you can switch and add some nice colouring to it. Install Bash by issuing the following:

```
opkg update
opkg install bash
```

Then edit `/etc/passwd` and change the root user line to this:

```
root:x:0:0:root:/root:/bin/bash
```

After that, run this command (which will create `/root/.bash_profile` and put `. $HOME/.bashrc` in it):

```
echo ". $HOME/.bashrc" &gt; /root/.bash_profile
```

Then you can use your own .bashrc and put it in your root directory, make sure to put it in /root.

Now log out, and log in again and you should have a brand new prompt.

####SSH public key authentication

To enable SSH public key authentication on Dropbear you will first have to copy your public key to your WR703N's tmp directory by issuing the following command from your Linux machine (change YOUR\_KEY with your actual public key file name, and WR703N\_P with the IP address of your device):

```
scp ~/.ssh/YOUR_KEY.pub root@WR703N_IP:/tmp
```

Then log in to your WR703N and copy your public key to `authorized_keys` file:

```
cat /tmp/YOUR_KEY.pub &gt;&gt; /etc/dropbear/authorized_keys
chmod 0600 authorized_keys
```

I couldn't make make OpenSSH work with SSH public key authentication because apparently there is a bug in OpenWrt's OpenSSH package (I read that somewhere on OpenWrt forums while I was trying to make it work some time ago, but I can't find that post now... if I find it, I'll put the link here).

If you don't use SSH public key authentication already, go [here](https://wiki.archlinux.org/index.php/SSH_Keys) and read why you should and how to use it.

[For MS Windows users](http://wiki.openwrt.org/oldwiki/dropbearpublickeyauthenticationhowto?s[]=ssh&amp;s[]=keys#using.putty.on.windows).

####Using DynDNS / setting up port forwarding on your router

If your router supports [DynDNS](http://dyn.com/dns/), or a similar service, you can make your WR703N accessible from anywhere on the internet (this is useful because you will be able to use your WR703N to [tunnel your traffic](https://wiki.archlinux.org/index.php/Secure_Shell#Encrypted_Socks_Tunnel) to protect yourself while you are connected to an unsecured network somewhere). The explanation will be a bit more generic, but it will give you a rough idea on what you have to do to make it work:

- Register an account on DynDNS webpage
- Enter your DynDNS credentials into your router (find them somewhere in your router's options)
- Forward a high TCP port (something above port 1024) to your WR703N (for example - if your WR703N is on 192.168.1.100, and Dropbear is running on port 22, then forward 8822 TCP to 192.168.1.100 port 22)

Now you should be able to SSH into your WR703N by issuing the following command inside your terminal:

```
ssh -p 8822 root@your.dyndns.domain
```

[This](http://portforward.com/) might help you set up port forwarding on your router.

####Reflashing

If you for any reason ever want / need to reflash your WR703N with a fresh instance of OpenWrt do the following (wget will download the latest snapshot of OpenWrt for WR703N, and mtd command will flash it to your device):

```
cd /tmp
wget http://downloads.openwrt.org/snapshots/trunk/ar71xx/openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-factory.bin
mtd -r write openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-factory.bin firmware
```

####Other

- [OPKG Wiki](http://wiki.openwrt.org/doc/techref/opkg)
- [OpenWrt WR703N Wiki](http://wiki.openwrt.org/toh/tp-link/tl-wr703n)
- [MiniPwner](http://www.minipwner.com/index.php/minipwner-build)
- [PirateBox](http://wiki.daviddarts.com/PirateBox_DIY_OpenWrt)

Hope this helps. If you find out that something I wrote is wrong and is not working, please drop a comment bellow and I'll fix it. Thanks. =)