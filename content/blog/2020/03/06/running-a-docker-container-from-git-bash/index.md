---
title: Mounting a Docker volume from Git Bash
date: "2020-03-06T00:00:00.000Z"
description: How to mount a Docker volume inside a container from Git Bash on Windows
featuredImage: /assets/featured/docker.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/6
tags: ["docker", "windows", "git", "bash"]
seoKeywords: ["docker", "windows", "git", "bash"]
---

Apparently, because of a [bug/limitation](https://stackoverflow.com/a/49013604/413785) [in Git for Windows](https://github.com/git-for-windows/build-extra/blob/master/ReleaseNotes.md#bug-fixes-2), mounting a volume in Docker on Windows is slightly problematic. It took me a while to find the right combination of casing, bracket type and command prefixing to make it work.

The first thing was to prefix the whole command with `MSYS_NO_PATHCONV=1`, and I had to use the standard round brackets and lowercase `$(pwd)` with no backslashes or anything like that.

Finally, my `docker run` invocation looks like this:

```sh
MSYS_NO_PATHCONV=1 \
  docker run \
    --rm -v $(pwd):/local \
    openapitools/openapi-generator-cli generate \
      -i http://host.docker.internal:26628/swagger/v1/swagger.json \
      -g typescript-axios \
      -o /local/generated
```

For clarity - this will run the `openapitools/openapi-generator-cli` image container with a few extra command switches (`-i`, `-g`, `-o`). Backslashes are there simply to allow me to break the command down over multiple lines and make it more readable. The `$(pwd)` bit means that Docker will mount my current folder (the one that I'm running the `docker run` command from in the host OS) under a temporary `local` folder inside the container, and the output of the openapi tool will then put the generated code into the "local/generated" subfolder inside the container (and as a result of that the generated files will end up in the host OS). When the tool finishes with the execution, my actual OS (docker host) folder will have a subfolder called "generated" and all the generated code will be persisted there.

[This whole thread](https://github.com/docker/toolbox/issues/673) contains a few more solutions which didn't work for me, but maybe you'll have better luck with them if what has been written here doesn't help you.