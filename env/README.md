# env

Shell config files for a new machine.

## Fish

```sh
# 1. Clone this repo
git clone https://github.com/mxdvl/mxdvl ~/Code/mxdvl

# 2. Source from ~/.config/fish/config.fish
echo 'source ~/Code/mxdvl/env/config.fish' >> ~/.config/fish/config.fish

# 3. Copy the jean-claude alias
cp ~/Code/mxdvl/env/jean-claude.fish ~/.config/fish/functions/
```

Then create `~/.config/fish/conf.d/secrets.fish` with tokens (see password manager).

## Git

`git.zsh` has helper functions — source it or copy what you need.
