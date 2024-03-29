function git_remove_gone_branches()  {
  # from https://stackoverflow.com/a/61935602/1577447, except works with squash & merge strategy.
  git fetch -p
  git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
}

# Merge all matching branches into local
function find_remaining_dependabot_branches() {
	git branch -r --list "origin/dependabot/*" --no-merged
}
