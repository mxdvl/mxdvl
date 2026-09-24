# editor
set -gx EDITOR "zed --wait"
set -gx BAT_THEME "Coldark-Dark"

# node (fnm)
fnm env --use-on-cd | source

# python
pyenv init - fish | source

# paths
fish_add_path -p ~/.deno/bin
fish_add_path -p ~/.local/bin

# pnpm
set -gx PNPM_HOME "$HOME/Library/pnpm"
fish_add_path -p $PNPM_HOME

# starship
starship init fish | source
