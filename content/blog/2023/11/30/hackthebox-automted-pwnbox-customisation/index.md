---
title: HackTheBox - automated PwnBox customisation
date: "2023-11-30T00:00:00.000Z"
description: How to automatically customise bash, register custom scripts and download some commonly used, but missing tools in your PwnBox instance?
featuredImage: /assets/featured/hackthebox.png
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/54
tags: ["hackthebox", "security", "parrot-os", "vm", "pwnbox", "bash"]
---

[PwnBox](https://help.hackthebox.com/en/articles/5185608-introduction-to-pwnbox) works fantastic. However, one of the things that one might want to do is to customise it a little and persist these tweaks. Now, each reboot gives us a fresh box, and most of the system gets reset back to defaults. But, HTB exposed a `user_init` file which can be used to execute custom bash on startup. Its purpose is to make customisation programmable, flexible and automatable.

A few useful things you can do with this:

- Put a bunch of your customisation into a public GitHub repository
- Instruct `user_init` to clone this repo automatically
- Update `user_init` to the latest version from your repo
- If you have a collection of custom shell scripts in your repo, you can automatically add them to the `PATH`
  - I prefixed them all with `px-*` so they show up with autocomplete
- Use your own `.bashrc` or just append it to the default one
- [Automatically download](https://github.com/tihomir-kit/planq/blob/main/scripts/px-download-bin-tools) some tools that are missing from PwnBox but are used very often (i.e. pspy, linpeas, winpeas, nc.exe, chisel...)
- Fix any other tiny annoyances like `gnome-keyring-daemon` unlock prompt etc..
- You could probably further use ansible for some more powerful automation

For initial setup, you can run something like this the first time around, but after that, updates are automatic:

```sh
cd; cd my_data; curl -s https://raw.githubusercontent.com/tihomir-kit/planq/main/user_init > user_init; ./user_init; . ~/.bashrc
```

If you want to force a reinit without rebooting the machine, run the `reinit` alias that I added to `.bashrc`.

One thing I didn't do is use `apt` or `go install` to automatically install packages through `user_init`, it didn't really work well. Half the time packages would end up getting not installed. It looked like a permissions issue, and I decided to not pursue it further because some of these packages take a while to download, and I wanted to cut down on PwnBox startup to ready-to-use time. So I just run [`px-install-tools`](https://github.com/tihomir-kit/planq) when I need to. I might break it down further into a few separate `px-install-*` commands at some point.

Here's [what I have so far](https://github.com/tihomir-kit/planq), if you'd like to fish for some ideas.
