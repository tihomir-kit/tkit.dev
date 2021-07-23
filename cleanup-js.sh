ECHO '-- Wiping node_modules folders ------------------------------------------------------------------------------'
find . -name 'node_modules' -type d -prune
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

ECHO '-- Wiping bower_components folders --------------------------------------------------------------------------'
find . -name 'bower_components' -type d -prune
find . -name 'bower_components' -type d -prune -exec rm -rf '{}' +
