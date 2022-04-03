# uniswap-sniping-bot

Based on https://www.youtube.com/watch?v=a5at-FEyITQ which seems based on https://github.com/jklepatch/eattheblocks/tree/master/screencast/322-uniswap-trading-bot

## setup

`docker-compose build`

## run

**Either:**
bash into the `app` container with `docker-compose run app sh` and then run `yarn run bot` separately, staying in the container's scope.
***or***
run the script in the container from outwith the container (on the/your host machine), `docker-compose run app yarn run bot`, then return to the host scope after.
