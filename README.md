### Setup

1. Create your own `.env` file in the root directory. Use the included .env.sample as reference.
2. Set your own value for `SECRET` in the new `.env` file.
3. Make sure you have Docker installed. Run `docker compose -f postgres-db.yml up --build` from the project's root directory.
4. Run `npm run dev`.
5. This backend server should now be running.
6. To access `psql` in the Docker container, in a separate terminal window, run `docker exec -it <container ID> psql -U postgres postgres`. You can get the container ID by typing `docker ps`
