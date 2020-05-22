---
title: TF300T Easter brick resurrection
date: "2015-04-05T00:00:00.000Z"
description: Is there a way to fix almost-bricked TF300T?
featuredImage: /assets/featured/android-lollipop.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/38
tags: ["adb", "android", "brick", "cwm", "cyanogenmod", "fastboot", "flashing", "recovery", "rom", "tablet", "tf300t", "twrp"]
---

Since Asus stopped providing us with official updates for TF300T tablet from the old Android 4.2.1, I decided it was finally time to root it and put a brand new shiny Lollipop ROM onto it. I rooted all my previous phones and it all went well all the times so I figured it would go smooth this time as well. Except it didn't. :D

Somehow I managed to follow an outdated tutorial for unlocking and flashing the TF300T that recommended using the ClockWorkMod recovery. All went well up to that point, I unlocked the tablet and put the CWM without any trouble but when I tried to flash the CyanogenMod ROM, CWM complained about not being able to mount any partitions. That meant that I couldn't select the ROM zip file from a internal location or sideload it with ADB. Funky.

So I did a bit more research and it turned out that CM does not really support CWM for Lollipop (not sure if only for this device, or generally, but it doesn't matter anyway). Solution - flash TWRP recovery instead. Ok, so I went back to fastboot and tried to flash TWRP over CWM but it failed every time. This is where it all started to go down..

My first mistake was that I downloaded the *-JB version of TWRP instead of the *-4.2. I was quite lucky here as it was only later that I read that if you screwed that part - hardbricking was guaranteed. Instead of everything going to smoke already, flashing TWRP simply failed every time (RCK would stop blinking and rebooting using _fastboot -i 0x0B05 reboot_ didn't work) and each reboot into recovery would load CWM again and again. I could still boot into Android as well. I thought that was strange so I tried a couple of times but of course it didn't help.

My second (even bigger) mistake was - I selected the "wipe" option from the fastboot screen.. Fool of a Took. ‘#$&%*!... I thought this would somehow help but instead I got stuck inside an infinite CWM loop. I had ADB access, but rebooting to fastboot using _adb reboot-bootloader_ simply didn't work. After ~6 hours of trying, I almost gave up at this point but after a bit more research I found a slightly different version of the same command - _adb reboot bootloader_ (without the dash) and BINGO! That was my way back. So happy! Now I could boot into fastboot again.

Well now I only had to figure out how to get rid of the CWM.. This [SE answer](http://android.stackexchange.com/a/75296/2192) stated that I should restore the device to defaults by flashing [Asus stock ROM](http://support.asus.com/download.aspx?SLanguage=en&amp;m=ASUS+Transformer+Pad+TF300T&amp;os=8) (download firmware for your language, unzip it and flash the *.blob file). Running _fastbot erase_ before flashing the Asus firmware looked reeeally scary, but it was the only option I had so I went for it.. It all went great and after that it was very easy to flash TWRP and then CM and Gapps from TWRP.

Problem solved! After ~8 hours of not giving up, my tablet was resurrected and alive again! Easter day of 2015. True story.

Well, lesson learned - do the research and RTFM in advance. And I hope the post helps some other impatient bricker! :)

PS - the device works faster/smoother/better with Lollipop. *thumbsup* for the Android team.

Cheers!