# ts-play

Basic TS config(s).

## setup

`docker-compose build`

## run

**Either:**
bash into the `app` container with `docker-compose run app sh` and then run `yarn run init` separately, staying in the container's scope.
***or***
run the script in the container from outwith the container (on the/your host machine), `docker-compose run app yarn run init`, then return to the host scope after.

## reuse

substitute `new-project`

copy repo: `git clone https://github.com/samthomson/ts-play new-project`

update remotes (after creating new repo on github): `cd new-project && git remote remove origin && git remote add origin git@github.com:samthomson/new-project.git`
