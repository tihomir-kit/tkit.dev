---
title: Thomson SpeedTouch 780WL – port forwarding to broadcast address
date: "2010-01-24T00:00:00.000Z"
description: How to set up port forwarding on Thomson SpeedTouch 780WL router.
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/23
tags: ["broadcast", "networking", "port forwarding", "speedtouch 780", "wake-on-lan", "wol"]
---

For your home network to be able to [wake-on-lan](http://en.wikipedia.org/wiki/Wake-on-LAN) a computer from the Internet so that you could later remotely access it, you need to forward a port to your broadcast address. This way you can broadcast a magic packet to all the computers in your network and then wake only one of them using its MAC address.

If you are reading this, you probably already tried forwarding a port to 255.255.255.255 but to no avail. That is because ST780 just drops anything forwarded to the broadcast address.

So, what you should do is choose one unused IP address in your subnet and make it appear like it's a broadcast address, and later do the port forwarding to that IP. How to do that? Telnet into your router, and assign a hardware (MAC) address of FF:FF:FF:FF:FF:FF (when translated to IP, that MAC address makes 255.255.255.255) to the chosen IP address. This is the basic idea behind this tutorial and a way to trick the router into doing the port forwarding to a (fake) broadcast address. So, do the following:

```bash
telnet <router_ip_address>
```

enter your superadmin username and password and execute the following two commands:

```bash
:ip arpadd intf=LocalNetwork ip=192.168.1.xxx hwaddr=FF:FF:FF:FF:FF:FF
:saveall
```

where xxx is the last octet of your chosen IP address (make sure that the chosen IP is not already in use, and that it's not 192.168.1.255).

Now go to your routers web interface and create an application with UDP port 9 (to make it a little bit more secure, I recommend you choose a port above 1024, and then translate it into 9). Assign the created application to a newly created IP address (192.168.1.xxx) and voila, you got it.

Now you can try and use [wol](http://sourceforge.net/projects/wake-on-lan/) (for Linux) or [this one](http://www.softpedia.com/get/Network-Tools/Misc-Networking-Tools/Wake-on-Lan-for-Windows-Graphical-User-Interface.shtml) (for Windows) to remotely turn on your computer. For this you will need your routers public address (I recommend using [DynDns](http://www.dyndns.com/) for that), and the MAC address of the computer you want to wake up.

