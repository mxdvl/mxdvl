# env

Shell config files for a new machine.

## Fish

```sh
git clone https://github.com/mxdvl/mxdvl ~/Code/mxdvl
ln -s ~/Code/mxdvl/env/config.fish ~/.config/fish/conf.d/mxdvl.fish
ln -s ~/Code/mxdvl/env/jean-claude.fish ~/.config/fish/functions/jean-claude.fish
```

Then create `~/.config/fish/conf.d/secrets.fish` with tokens (see password manager).

## Git

`git.zsh` has helper functions — source or symlink as needed.
