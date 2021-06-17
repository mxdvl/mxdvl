# from https://stackoverflow.com/a/61935602/1577447
git fetch -p
git branch -vv --merged | grep ': gone]' | awk '{print $1}' | xargs git branch -d
